import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CircularLoading from '../components/CircularLoading.jsx';
import Footer from '../components/Footer.jsx'; // Importer le Footer

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1, // Permet à cette section de grandir et de pousser le footer en bas
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
            BATIClean, un bâtiment propre pour une image forte.
            By_KY™
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="contained" color="secondary" onClick={() => navigate('/register')}>S'inscrire</Button>
              <Button variant="outlined" color="inherit" sx={{ borderColor: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }} onClick={() => navigate('/login')}>Se connecter</Button>
              <Button variant="outlined" color="inherit" sx={{ borderColor: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }} onClick={handleActionClick}>Demander un devis</Button>
              <Button variant="outlined" color="inherit" sx={{ borderColor: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }} onClick={handleActionClick}>Réserver un service</Button>
          </Stack>
        </motion.div>
      </Box>
      <Footer />
    </Box>
  );
}

export default LandingPage;