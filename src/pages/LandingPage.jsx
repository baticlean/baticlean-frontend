import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CircularLoading from '../components/CircularLoading.jsx';
import Footer from '../components/Footer.jsx';
import { keyframes } from '@emotion/react';

// NOUVELLE PALETTE "OASIS" : Turquoise, Or, et Blanc.
const colors = ['#FFFFFF', '#FFD700', '#FFFFFF', '#AFEEEE']; // Blanc, Jaune Or, Blanc, Turquoise Pâle

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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
          padding: 3,
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
              mb: 2,
              animation: `${colorAnimationMain} 8s linear infinite`
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
              animation: `${colorAnimationSub} 8s linear infinite`
            }}
          >
            Créée par Kevin Amon, Initié par Yvann Acandi.
          </Typography>

          <Typography 
            variant="h6" 
            component="p" 
            sx={{ 
              fontFamily: 'Pollin',
              fontWeight: '300',
              mb: 4,
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
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button 
                variant="contained" 
                sx={{ 
                  ...buttonSx, 
                  backgroundColor: '#FFD700', // Jaune Or
                  color: 'white',             // CORRIGÉ : Le texte est maintenant blanc
                  '&:hover': { 
                    backgroundColor: '#E6C300' // Or un peu plus foncé au survol
                  } 
                }} 
                onClick={() => navigate('/register')}
              >
                S'inscrire
              </Button>
              <Button variant="outlined" color="inherit" sx={{ ...buttonSx, borderColor: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }} onClick={() => navigate('/login')}>Se connecter</Button>
              <Button variant="outlined" color="inherit" sx={{ ...buttonSx, borderColor: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }} onClick={handleActionClick}>Demander un devis</Button>
              <Button variant="outlined" color="inherit" sx={{ ...buttonSx, borderColor: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }} onClick={handleActionClick}>Réserver un service</Button>
          </Stack>
        </motion.div>
      </Box>
      <Footer />
    </Box>
  );
}

export default LandingPage;