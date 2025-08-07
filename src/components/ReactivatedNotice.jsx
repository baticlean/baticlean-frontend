import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import { logout } from '../redux/authSlice.js';

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
  @keyframes pulseGreen {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
    }
    70% {
      transform: scale(1.05);
      box-shadow: 0 0 10px 15px rgba(76, 175, 80, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
    }
  }
`;

function ReactivatedNotice() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleReconnect = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleReconnect();
    }, 15000); // 15 secondes

    return () => clearTimeout(timer);
  }, []);

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
            backgroundColor: '#e8f5e9', 
            padding: 4, 
            borderRadius: 3, 
            border: '1px solid #66bb6a',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            animation: 'fadeIn 0.8s ease-out forwards',
            fontFamily: "'Poppins', sans-serif", // Application de la nouvelle police
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            sx={{ 
              color: '#2e7d32', 
              mb: 2,
              fontWeight: '700' // Texte en gras
            }}
          >
            ✅ Compte Réactivé
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, mb: 3, fontWeight: '400' }}>
            Votre compte a été réactivé ! Vous allez être redirigé vers la page de connexion dans 15 secondes pour vous reconnecter, vous pouvez aussi cliquer sur "Se reconnecter" pour vous reconnecter. BATIClean s'excuse pour tous désagréments occasionnés. 
          </Typography>
          <Button 
            variant="contained" 
            color="success" 
            onClick={handleReconnect}
            sx={{
              fontWeight: '600',
              borderRadius: '50px',
              padding: '10px 30px',
              transition: 'transform 0.2s ease, background-color 0.2s ease',
              animation: 'pulseGreen 2s infinite', // Animation du bouton
              '&:hover': {
                backgroundColor: '#388e3c',
                transform: 'scale(1.05)'
              }
            }}
          >
            Se reconnecter
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default ReactivatedNotice;