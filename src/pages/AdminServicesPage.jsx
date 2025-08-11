import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices, deleteService, createService, updateService } from '../redux/serviceSlice.js';
import {
    Container, Typography, Box, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, CircularProgress, Alert,
    Stack // RESPONSIVE: On importe Stack pour l'en-tête
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
            dispatch(fetchServices());
        });
    };

    const handleDelete = (id) => {
        if (!id) {
            toast.error("Impossible de supprimer un service sans identifiant.");
            return;
        }
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

    const validServices = Array.isArray(services) ? services.filter(Boolean) : [];

    if (loading && validServices.length === 0) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
    }

    return (
        <>
            {/* RESPONSIVE: Marges et padding ajustés */}
            <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 4, px: { xs: 2, sm: 3 } }}>
                {/* RESPONSIVE: On utilise Stack pour un en-tête flexible */}
                <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    justifyContent="space-between" 
                    alignItems={{ xs: 'stretch', sm: 'center' }} // 'stretch' pour que le bouton prenne toute la largeur sur xs
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    {/* RESPONSIVE: Titre avec une taille de police adaptable */}
                    <Typography variant={{ xs: 'h5', sm: 'h4' }}>
                        Gestion des Services
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
                        Ajouter un Service
                    </Button>
                </Stack>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Titre</TableCell>
                                {/* RESPONSIVE: Colonnes masquées sur xs */}
                                <TableCell sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'table-cell' } }}>Catégorie</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'table-cell' } }}>Prix</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {validServices.map((service) => (
                                <TableRow key={service._id}>
                                    <TableCell>{service.title ?? 'Titre manquant'}</TableCell>
                                    {/* RESPONSIVE: Cellules masquées sur xs */}
                                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{service.category ?? 'Catégorie manquante'}</TableCell>
                                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{service.price != null ? `${service.price} FCFA` : 'N/A'}</TableCell>
                                    <TableCell align="right">
                                        {/* RESPONSIVE: Les boutons s'empilent sur xs */}
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, justifyContent: 'flex-end' }}>
                                            <Button size="small" onClick={() => handleOpenModal(service)}>Modifier</Button>
                                            <Button variant="contained" color="error" size="small" onClick={() => handleDelete(service._id)}>Supprimer</Button>
                                        </Box>
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