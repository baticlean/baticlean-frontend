// baticlean-frontend/src/components/UpdateCompleteModal.jsx

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, Typography, Button, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CelebrationIcon from '@mui/icons-material/Celebration';

const UpdateCompleteModal = ({ open, onClose }) => {
  const [version, setVersion] = useState('actuelle');

  useEffect(() => {
    if (open) {
      const savedVersion = sessionStorage.getItem('newAppVersion');
      if (savedVersion) {
        setVersion(savedVersion);
        sessionStorage.removeItem('newAppVersion');
      }
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 3, p: 2, textAlign: 'center' } }}>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <CelebrationIcon sx={{ fontSize: 60, color: '#FFD700' }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          Mise à jour réussie !
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          BATIClean a été mis à jour vers la version <strong>{version}</strong>.
          Toutes les fonctionnalités sont maintenant optimisées.
        </Typography>
        <Button 
          variant="contained" 
          fullWidth 
          onClick={onClose}
          startIcon={<CheckCircleOutlineIcon />}
          sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
        >
          C'est parti !
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCompleteModal;