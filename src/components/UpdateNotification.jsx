// src/components/UpdateNotification.jsx

import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { toast } from 'react-toastify';

function UpdateNotification({ open, onClose, onConfirm }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFeedbackClick = () => {
    toast.info("Cette fonctionnalité est en cours de développement.");
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="update-dialog-title"
      PaperProps={{ sx: { borderRadius: { sm: 4 } } }}
    >
      <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
        <RocketLaunchIcon sx={{ fontSize: 60, color: 'primary.main' }} />
        <DialogTitle id="update-dialog-title" sx={{ p: 1, fontWeight: 'bold' }}>
          Mise à Jour Disponible !
        </DialogTitle>
      </Box>
      <DialogContent sx={{pt: 2}}>
        <DialogContentText>
            Une nouvelle version de l'application vient d'être déployée avec des améliorations et des correctifs.
        </DialogContentText>
        <DialogContentText sx={{ mt: 2, fontWeight: 500}}>
            Pour en bénéficier, veuillez actualiser l'application.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={handleFeedbackClick} size="small">Donner un avis</Button>
        <Box>
            <Button onClick={onClose}>Plus tard</Button>
            <Button onClick={onConfirm} variant="contained" autoFocus>
              Actualiser
            </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateNotification;