import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import { logout } from '../redux/authSlice.js';
import { toast } from 'react-toastify';
import ReclamationModal from '../components/ReclamationModal.jsx';
import { createReclamation } from '../redux/reclamationSlice.js';
import ReactivatedNotice from '../components/ReactivatedNotice.jsx';

// Définition des animations
const keyframes = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(229, 115, 115, 0.7);
    }
    70% {
      transform: scale(1.05);
      box-shadow: 0 0 10px 15px rgba(229, 115, 115, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(229, 115, 115, 0);
    }
  }
`;

function BannedPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const { justReactivated } = useSelector((state) => state.auth);

  if (justReactivated) {
    return <ReactivatedNotice />;
  }

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
        error: "Erreur lors de l'envoi.",
      }
    );
    setModalOpen(false);
  };

  return (
    <>
      <style>{keyframes}</style>
      <Container component="main" maxWidth="sm">
        <Box 
          sx={{ 
            marginTop: 8, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center', 
            backgroundColor: '#ffebee', 
            padding: 4, 
            borderRadius: 3, 
            border: '1px solid #e57373',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            animation: 'fadeIn 0.8s ease-out forwards',
            fontFamily: "'Poppins', sans-serif", // Application de la nouvelle police
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            sx={{ 
              color: '#c62828', 
              mb: 2,
              fontWeight: '700', // Texte en gras
            }}
          >
            Accès Refusé
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, mb: 3, fontWeight: '400' }}>
            Votre compte a été suspendu ou banni.
            <br/>
            Veuillez contacter l'administration ou faire une réclamation.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setModalOpen(true)} 
            sx={{ 
              mb: 2, 
              fontWeight: '600',
              borderRadius: '50px',
              padding: '10px 30px',
              backgroundColor: '#d32f2f',
              transition: 'transform 0.2s ease, background-color 0.2s ease',
              animation: 'pulse 2s infinite', // Animation du bouton
              '&:hover': {
                backgroundColor: '#c62828',
                transform: 'scale(1.05)'
              }
            }}
          >
            Faire une réclamation
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleLogout}
            sx={{
              fontWeight: '600',
              borderRadius: '50px',
              padding: '8px 25px',
              transition: 'transform 0.2s ease, background-color 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                transform: 'scale(1.05)'
              }
            }}
          >
            Se déconnecter
          </Button>
        </Box>
      </Container>
      <ReclamationModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleReclamationSubmit} />
    </>
  );
}

export default BannedPage;