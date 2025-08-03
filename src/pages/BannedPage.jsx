// src/pages/BannedPage.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import { logout } from '../redux/authSlice.js';
import { toast } from 'react-toastify';
import ReclamationModal from '../components/ReclamationModal.jsx';
import { createReclamation } from '../redux/reclamationSlice.js';

function BannedPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const handleReclamationSubmit = (reclamationData) => {
    toast.promise(
      dispatch(createReclamation(reclamationData)).unwrap(),
      {
        pending: 'Envoi de votre réclamation...',
        success: 'Réclamation envoyée avec succès !',
        error: 'Erreur lors de l\'envoi.'
      }
    );
  };

  return (
    <>
      <Container component="main" maxWidth="sm">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: '#ffebee', padding: 4, borderRadius: 2, border: '1px solid #e57373' }}>
          <Typography component="h1" variant="h4" sx={{ color: '#c62828', mb: 2 }}>Accès Refusé</Typography>
          <Typography variant="body1">Votre compte a été suspendu ou banni.</Typography>
          <Typography variant="body1" sx={{ mt: 1, mb: 3 }}>Veuillez contacter l'administration ou faire une réclamation.</Typography>
          <Button variant="contained" onClick={() => setModalOpen(true)} sx={{ mb: 2 }}>
            Faire une réclamation
          </Button>
          <Button variant="outlined" color="error" onClick={handleLogout}>Se déconnecter</Button>
        </Box>
      </Container>
      <ReclamationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleReclamationSubmit}
      />
    </>
  );
}

export default BannedPage;