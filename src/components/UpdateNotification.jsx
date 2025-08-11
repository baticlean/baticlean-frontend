// src/components/UpdateNotification.jsx

import React from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  useMediaQuery, Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Un petit composant pour afficher une information dans la liste
const InfoPoint = ({ primary, secondary }) => (
  <ListItem sx={{ py: 0.5 }}>
    <ListItemIcon sx={{ minWidth: 32 }}>
      <CheckCircleOutlineIcon fontSize="small" color="primary" />
    </ListItemIcon>
    <ListItemText primary={primary} secondary={secondary} />
  </ListItem>
);

function UpdateNotification({ open, onClose, onConfirm, versionInfo }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // S'assure que versionInfo existe avant de l'utiliser
  if (!versionInfo?.available) return null;
  
  const handleFeedbackClick = () => {
    toast.info("Cette fonctionnalité est en cours de développement.");
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="update-dialog-title"
      PaperProps={{ sx: { borderRadius: { sm: 4 } } }} // Bords arrondis sur grand écran
    >
      <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
        <RocketLaunchIcon sx={{ fontSize: 60, color: 'primary.main' }} />
        <DialogTitle id="update-dialog-title" sx={{ p: 1, fontWeight: 'bold' }}>
          Nouvelle Version Déployée !
        </DialogTitle>
      </Box>
      <DialogContent dividers>
        <Typography gutterBottom>
          Découvrez les nouveautés et améliorations :
        </Typography>
        <List dense>
          <InfoPoint 
            primary="Nouvelle version" 
            secondary={versionInfo.newVersion} 
          />
          <InfoPoint 
            primary="Date de la mise à jour" 
            secondary={new Date(versionInfo.timestamp).toLocaleString('fr-FR')} 
          />
          <InfoPoint 
            primary="Auteur" 
            secondary="BATICleanNIC" 
          />
          <InfoPoint 
            primary="Stabilité" 
            secondary="Amélioration des performances générales." 
          />
           <InfoPoint 
            primary="Correctifs" 
            secondary="Résolution de bugs mineurs et optimisation du cache." 
          />
        </List>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={handleFeedbackClick} size="small">Laisser un avis</Button>
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