import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices, deleteService, createService, updateService } from '../redux/serviceSlice.js';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, CircularProgress, Alert
} from '@mui/material';
import { toast } from 'react-toastify';
import ServiceFormModal from '../components/ServiceFormModal.jsx';

function AdminServicesPage() {
  const dispatch = useDispatch();
  const { items: services, loading, error } = useSelector((state) => state.services);
  const [modalOpen, setModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleOpenModal = (service = null) => {
    setServiceToEdit(service);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setServiceToEdit(null);
    setModalOpen(false);
  };

  const handleFormSubmit = (serviceData) => {
    const action = serviceToEdit 
      ? updateService({ id: serviceToEdit._id, serviceData }) 
      : createService(serviceData);

    toast.promise(
      dispatch(action).unwrap(),
      {
        pending: serviceToEdit ? 'Mise à jour...' : 'Création...',
        success: `Service ${serviceToEdit ? 'mis à jour' : 'créé'} !`,
        error: `Erreur lors de la ${serviceToEdit ? 'mise à jour' : 'création'}.`
      }
    ).then(() => {
      // On rafraîchit la liste depuis le serveur pour éviter les doublons
      dispatch(fetchServices());
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      toast.promise(
        dispatch(deleteService(id)).unwrap(),
        {
          pending: 'Suppression...',
          success: 'Service supprimé !',
          error: 'Erreur lors de la suppression.'
        }
      );
    }
  };

  if (loading && services.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Gestion des Services
          </Typography>
          <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
            Ajouter un Service
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Titre</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell>Prix</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service._id}>
                  <TableCell>{service.title}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{service.price} €</TableCell>
                  <TableCell align="right">
                    <Button size="small" sx={{ mr: 1 }} onClick={() => handleOpenModal(service)}>Modifier</Button>
                    <Button variant="contained" color="error" size="small" onClick={() => handleDelete(service._id)}>Supprimer</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <ServiceFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        serviceToEdit={serviceToEdit}
      />
    </>
  );
}

export default AdminServicesPage;