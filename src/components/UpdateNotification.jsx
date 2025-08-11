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
import NewReleasesIcon from '@mui/icons-material/NewReleases';

const InfoPoint = ({ icon, primary, secondary }) => (
  <ListItem sx={{ py: 0.5 }}>
    <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
      {icon}
    </ListItemIcon>
    <ListItemText 
      primary={primary} 
      secondary={secondary}
      // ✅ Texte légèrement plus petit sur mobile
      primaryTypographyProps={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
      secondaryTypographyProps={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
    />
  </ListItem>
);

function UpdateNotification({ open, onClose, onConfirm, versionInfo }) {
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
      PaperProps={{ sx: { borderRadius: { xs: 0, sm: 4 } } }} // Pas de bords arrondis en plein écran
    >
      <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
        {/* ✅ Icône plus petite sur mobile */}
        <RocketLaunchIcon sx={{ fontSize: { xs: 48, sm: 60 }, color: 'primary.main' }} />
        <DialogTitle id="update-dialog-title" sx={{ p: 1, fontWeight: 'bold', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
          Mise à Jour Disponible !
        </DialogTitle>
      </Box>
      <DialogContent dividers>
        <Typography gutterBottom sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          Une nouvelle version de l'application vient d'être déployée :
        </Typography>
        <List dense>
          <InfoPoint 
            icon={<NewReleasesIcon />}
            primary="Nouvelle version" 
            secondary={versionInfo.displayVersion || 'Chargement...'} 
          />
          <InfoPoint 
            icon={<InfoOutlinedIcon color="action" />}
            primary="Éditeur" 
            secondary="BATIClean Dev Team"
          />
          <InfoPoint 
            icon={<InfoOutlinedIcon color="action" />}
            primary="Correctifs" 
            secondary="Amélioration de la stabilité et des performances."
          />
        </List>
      </DialogContent>
      {/* ✅ Boutons plus petits et empilés sur mobile si nécessaire */}
      <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, justifyContent: 'space-between' }}>
        <Button onClick={handleFeedbackClick} size="small">Donner un avis</Button>
        <Box>
            <Button onClick={onClose} size="small">Plus tard</Button>
            <Button onClick={onConfirm} variant="contained" autoFocus size="small">
              Actualiser
            </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateNotification;