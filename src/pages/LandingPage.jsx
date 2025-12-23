// baticlean-frontend/src/pages/LandingPage.jsx

import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CircularLoading from '../components/CircularLoading.jsx';
import Footer from '../components/Footer.jsx';
import { keyframes } from '@emotion/react';

const colors = ['#FFFFFF', '#FFD700', '#FFFFFF', '#AFEEEE'];

const colorAnimationMain = keyframes`
  0%, 100% { color: ${colors[0]}; }
  25% { color: ${colors[1]}; }
  50% { color: ${colors[2]}; }
  75% { color: ${colors[3]}; }
`;

const colorAnimationSub = keyframes`
  0%, 100% { color: ${colors[2]}; }
  25% { color: ${colors[3]}; }
  50% { color: ${colors[0]}; }
  75% { color: ${colors[1]}; }
`;

const breathingAnimation = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 5px rgba(255,255,255,0.2); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(255,255,255,0.5); }
  100% { transform: scale(1); box-shadow: 0 0 5px rgba(255,255,255,0.2); }
`;

function LandingPage() {
  const navigate = useNavigate();

  const handleActionClick = () => {
    const toastId = toast.info(<CircularLoading message="Veuillez vous connecter..." />, {
      autoClose: false,
      closeButton: false,
    });
    
    setTimeout(() => {
        toast.update(toastId, { 
          render: "Redirection...", 
          type: "info", 
          isLoading: false, 
          autoClose: 1500,
          closeButton: true,
        });
        navigate('/login');
    }, 2000);
  };

  const buttonSx = {
    animation: `${breathingAnimation} 3s ease-in-out infinite`,
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        animationPlayState: 'paused',
        transform: 'scale(1.1)'
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          background: 'linear-gradient(135deg, #005B6A 0%, #40E0D0 100%)',
          color: 'white',
          textAlign: 'center',
          padding: { xs: 2, sm: 3 }, // Padding réduit sur mobile
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold', 
              mb: { xs: 1, sm: 2 },
              animation: `${colorAnimationMain} 8s linear infinite`,
              fontSize: {
                xs: '1.8rem', // Taille optimisée pour mobile (évite le scroll)
                sm: '3rem',
                md: '4rem'
              }
            }}
          >
            BATIClean, un bâtiment propre pour une image forte.
          </Typography>

          <Typography 
            variant="h5"
            component="p" 
            sx={{ 
              fontFamily: 'Pollin',
              fontWeight: '300',
              mb: 1,
              fontSize: { xs: '1.1rem', sm: '1.5rem' },
              animation: `${colorAnimationSub} 8s linear infinite`
            }}
          >
            Créé par Kevin Amon, Initié par Yvann Acandi.
          </Typography>

          <Typography 
            variant="h6" 
            component="p" 
            sx={{ 
              fontFamily: 'Pollin',
              fontWeight: '300',
              mb: { xs: 3, sm: 4 },
              fontSize: { xs: '0.9rem', sm: '1.25rem' },
              animation: `${colorAnimationSub} 8s linear infinite`
            }}
          >
            Penser comme un entrepreneur, c'est déjà en devenir un.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '80%', sm: 'auto' }, margin: '0 auto' }}>
              <Button 
                variant="contained" 
                sx={{ 
                  ...buttonSx, 
                  backgroundColor: '#FFD700',
                  color: 'white',
                  '&:hover': { backgroundColor: '#E6C300' } 
                }} 
                onClick={() => navigate('/register')}
              >
                S'inscrire
              </Button>
              <Button variant="outlined" color="inherit" sx={{ ...buttonSx, borderColor: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }} onClick={() => navigate('/login')}>Se connecter</Button>
              <Button variant="outlined" color="inherit" sx={{ ...buttonSx, borderColor: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }} onClick={handleActionClick}>Demander un devis</Button>
              <Button variant="outlined" color="inherit" sx={{ ...buttonSx, borderColor: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }} onClick={handleActionClick}>Réserver un service</Button>
          </Stack>
        </motion.div>
      </Box>
      <Footer />
    </Box>
  );
}

export default LandingPage;