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

function LandingPage() {
  const navigate = useNavigate();

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
      <Box sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1,
          background: 'linear-gradient(135deg, #005B6A 0%, #40E0D0 100%)', color: 'white', textAlign: 'center', p: { xs: 2, sm: 3 },
        }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
          <Typography variant="h2" sx={{ 
              fontWeight: 'bold', mb: 2, animation: `${colorAnimationMain} 8s linear infinite`,
              fontSize: { xs: '1.9rem', sm: '3rem', md: '4rem' } // Titre réduit sur mobile pour éviter le scroll
            }}>
            BATIClean, un bâtiment propre pour une image forte.
          </Typography>

          <Typography variant="h5" sx={{ 
              fontFamily: 'Pollin', fontWeight: '300', mb: 1, animation: `${colorAnimationSub} 8s linear infinite`,
              fontSize: { xs: '1.1rem', sm: '1.5rem' }
            }}>
            Créé par Kevin Amon, Initié par Yvann Acandi.
          </Typography>

          <Typography variant="h6" sx={{ 
              fontFamily: 'Pollin', fontWeight: '300', mb: 4, animation: `${colorAnimationSub} 8s linear infinite`,
              fontSize: { xs: '0.9rem', sm: '1.2rem' }
            }}>
            Penser comme un entrepreneur, c'est déjà en devenir un.
          </Typography>
        </motion.div>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '85%', sm: 'auto' } }}>
            <Button variant="contained" sx={{ backgroundColor: '#FFD700', color: 'white', fontWeight: 'bold' }} onClick={() => navigate('/register')}>S'inscrire</Button>
            <Button variant="outlined" color="inherit" onClick={() => navigate('/login')}>Se connecter</Button>
            <Button variant="outlined" color="inherit" onClick={handleActionClick}>Demander un devis</Button>
            <Button variant="outlined" color="inherit" onClick={handleActionClick}>Réserver un service</Button>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
}

export default LandingPage;