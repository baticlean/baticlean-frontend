// src/components/SpecialWarning.jsx

import React, { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ContactSupportModal from './ContactSupportModal.jsx';

function SpecialWarning({ message, onClose }) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!message) return null;

  return (
    <>
      <Paper 
        elevation={6} 
        sx={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: '90%', sm: 'auto' },
          maxWidth: '600px',
          bgcolor: 'error.main',
          color: 'white',
          p: 2,
          borderRadius: 2,
          zIndex: 9999, // Pour être au-dessus de tout
          textAlign: 'center'
        }}
      >
        <Typography variant="body1" sx={{ mb: 2 }}>{message}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" color="inherit" onClick={() => setModalOpen(true)}>
            Régler le problème
          </Button>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Fermer
          </Button>
        </Box>
      </Paper>
      <ContactSupportModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

export default SpecialWarning;