// src/components/UpdateNotification.jsx

import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import UpdateIcon from '@mui/icons-material/SystemUpdateAlt';

function UpdateNotification({ open, onClose, onConfirm }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm')); // Responsive pour les petits écrans

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="update-dialog-title"
    >
      <DialogTitle id="update-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <UpdateIcon color="primary" />
        Mise à Jour Disponible
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Une nouvelle version de l'application est prête ! Pour garantir une expérience optimale et éviter les bugs, nous vous recommandons de recharger la page.
        </DialogContentText>
        <DialogContentText sx={{ mt: 2, fontSize: '0.8rem', fontStyle: 'italic' }}>
          (Vous pourrez toujours actualiser plus tard si vous fermez cette fenêtre).
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
        <Button onClick={onClose}>Plus tard</Button>
        <Button onClick={onConfirm} variant="contained" autoFocus>
          Actualiser Maintenant
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateNotification;