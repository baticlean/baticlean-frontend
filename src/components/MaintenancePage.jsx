// src/components/MaintenancePage.jsx

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // La librairie pour les animations

function MaintenancePage() {
  const navigate = useNavigate();

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh', // Pour centrer verticalement sur la page
      }}
    >
      {/* Animation d'apparition de la fenêtre */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Box
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderImage: 'linear-gradient(45deg, #E94057, #8A2387) 1',
          }}
        >
          {/* Animation de l'icône */}
          <motion.div
            animate={{ rotate: [0, 20, -20, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: '4rem', marginBottom: '16px' }}
          >
            🛠️
          </motion.div>

          <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
            Page En Maintenance
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Cette page est en maintenance pour améliorations. Veuillez réessayer plus tard ou contacter l'administration si le problème est d'une urgence extrême.
            <br/><br/>
            BATIClean s'excuse pour les désagréments occasionnés.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            {/* Animation des boutons */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/support-chat')} // Redirige vers le chat
              >
                Contacter l'administration
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate(-1)} // Redirige vers la page précédente
              >
                Retour
              </Button>
            </motion.div>
          </Box>
        </Box>
      </motion.div>
    </Container>
  );
}

export default MaintenancePage;