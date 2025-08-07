import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReclamations, hideReclamation } from '../redux/reclamationSlice.js';
import { Container, Typography, Box, Paper, CircularProgress, Alert, IconButton, Button } from '@mui/material';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import ReclamationDetailsModal from '../components/ReclamationDetailsModal.jsx';

function AdminReclamationsPage() {
  const dispatch = useDispatch();
  const { items: reclamations, loading, error } = useSelector((state) => state.reclamations);
  const [selectedReclamation, setSelectedReclamation] = useState(null);

  useEffect(() => {
    dispatch(fetchAllReclamations());
  }, [dispatch]);

  const handleHide = (reclamationId) => {
    toast.promise(
      dispatch(hideReclamation(reclamationId)).unwrap(),
      {
        pending: 'Masquage en cours...',
        success: 'Réclamation masquée !',
        error: 'Erreur lors du masquage.'
      }
    );
  };

  if (loading && reclamations.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Gestion des Réclamations</Typography>
        {reclamations.length === 0 ? (
          <Typography>Aucune réclamation pour le moment.</Typography>
        ) : (
          reclamations.map((reclamation) => (
            <Paper key={reclamation._id} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6">Réclamation de {reclamation.user?.username || 'Utilisateur inconnu'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Statut: {reclamation.status} - Reçue le: {format(new Date(reclamation.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                </Typography>
              </Box>
              <Box>
                  <Button variant="contained" size="small" sx={{ mr: 1 }} onClick={() => setSelectedReclamation(reclamation)}>Consulter</Button>
                  <IconButton color="error" onClick={() => handleHide(reclamation._id)}>
                      <DeleteIcon />
                  </IconButton>
              </Box>
            </Paper>
          ))
        )}
      </Container>
      <ReclamationDetailsModal reclamation={selectedReclamation} open={!!selectedReclamation} onClose={() => setSelectedReclamation(null)} />
    </>
  );
}

export default AdminReclamationsPage;