// src/components/UpdateNotification.jsx

import React from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  useMediaQuery, Box, Typography, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Un petit composant réutilisable pour afficher une ligne d'information
const InfoPoint = ({ icon, primary, secondary }) => (
  <ListItem sx={{ py: 0.5 }}>
    <ListItemIcon sx={{ minWidth: 36 }}>
      {icon}
    </ListItemIcon>
    <ListItemText primary={primary} secondary={secondary} />
  </ListItem>
);

function UpdateNotification({ open, onClose, onConfirm, versionInfo }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFeedbackClick = () => {
    toast.info("Cette fonctionnalité est en cours de développement.");
  };

  // Formate la date pour un affichage lisible
  const updateDate = versionInfo.timestamp 
    ? new Date(versionInfo.timestamp).toLocaleString('fr-FR', {
        dateStyle: 'long',
        timeStyle: 'short',
      }) 
    : 'Indisponible';

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
      <DialogContent dividers>
        <Typography gutterBottom>
          Une nouvelle version de l'application vient d'être déployée avec des améliorations :
        </Typography>
        <List dense>
          <InfoPoint 
            icon={<InfoOutlinedIcon fontSize="small" color="action" />}
            primary="Éditeur" 
            secondary="BATICleanNIC"
          />
          <InfoPoint 
            icon={<InfoOutlinedIcon fontSize="small" color="action" />}
            primary="Date de la mise à jour" 
            secondary={updateDate}
          />
          <InfoPoint 
            icon={<InfoOutlinedIcon fontSize="small" color="action" />}
            primary="Correctifs" 
            secondary="Amélioration de la stabilité et des performances."
          />
        </List>
      </DialogContent>
      <DialogActions sx={{ p: { xs: 2, sm: 3 }, justifyContent: 'space-between' }}>
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