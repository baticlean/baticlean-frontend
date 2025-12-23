// baticlean-frontend/src/pages/LandingPage.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CircularLoading from '../components/CircularLoading.jsx';
import Footer from '../components/Footer.jsx';
import { keyframes } from '@emotion/react';

// --- ANIMATIONS ---
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

// ✅ L'animation de respiration est de retour
const breathingAnimation = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 5px rgba(255,255,255,0.2); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(255,255,255,0.5); }
  100% { transform: scale(1); box-shadow: 0 0 5px rgba(255,255,255,0.2); }
`;

function LandingPage() {
  const navigate = useNavigate();
  
  // 🎁 SURPRISE : État pour la position de la souris
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });

  useEffect(() => {
    // Fonction pour suivre la souris sur desktop uniquement
    const handleMouseMove = (event) => {
        if (window.innerWidth > 768) { // On évite sur mobile pour la performance
            setMousePos({ x: `${event.clientX}px`, y: `${event.clientY}px` });
        }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleActionClick = () => {
    const toastId = toast.info(<CircularLoading message="Veuillez vous connecter..." />, {
      autoClose: false,
      closeButton: false,
    });
    
    setTimeout(() => {
        toast.update(toastId, { render: "Redirection...", type: "info", isLoading: false, autoClose: 1500, closeButton: true });
        navigate('/login');
    }, 2000);
  };

  // ✅ Le style de base des boutons animés
  const buttonSx = {
    animation: `${breathingAnimation} 3s ease-in-out infinite`,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        animationPlayState: 'paused',
        transform: 'scale(1.1)',
        boxShadow: '0 0 25px rgba(255,255,255,0.7)'
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
          // 🎁 SURPRISE : Le background dynamique !
          // On superpose un dégradé radial qui suit la souris sur le dégradé linéaire de base.
          background: `radial-gradient(circle at ${mousePos.x} ${mousePos.y}, rgba(64, 224, 208, 0.4) 0%, rgba(0, 91, 106, 0) 50%), linear-gradient(135deg, #005B6A 0%, #40E0D0 100%)`,
          color: 'white',
          textAlign: 'center',
          p: { xs: 2, sm: 3 },
          transition: 'background 0.1s ease-out' // Transition fluide pour le mouvement
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 'bold', 
              mb: { xs: 1, sm: 2 },
              animation: `${colorAnimationMain} 8s linear infinite`,
              fontSize: { xs: '1.9rem', sm: '3rem', md: '4rem' }
            }}
          >
            BATIClean, un bâtiment propre pour une image forte.
          </Typography>

          <Typography 
            variant="h5"
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
          {/* ✅ Les boutons utilisent maintenant correctement le buttonSx */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '85%', sm: 'auto' } }}>
              <Button 
                variant="contained" 
                sx={{ 
                  ...buttonSx, 
                  backgroundColor: '#FFD700', color: 'white', fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#E6C300', ...buttonSx['&:hover'] } 
                }} 
                onClick={() => navigate('/register')}
              >
                S'inscrire
              </Button>
              <Button variant="outlined" color="inherit" sx={{ ...buttonSx, borderColor: 'white' }} onClick={() => navigate('/login')}>Se connecter</Button>
              <Button variant="outlined" color="inherit" sx={{ ...buttonSx, borderColor: 'white' }} onClick={handleActionClick}>Demander un devis</Button>
              <Button variant="outlined" color="inherit" sx={{ ...buttonSx, borderColor: 'white' }} onClick={handleActionClick}>Réserver un service</Button>
          </Stack>
        </motion.div>
      </Box>
      <Footer />
    </Box>
  );
}

export default LandingPage;