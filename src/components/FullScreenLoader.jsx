// src/components/FullScreenLoader.jsx

import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

/**
 * Affiche une surcouche de chargement en plein écran.
 * @param {object} props - Les propriétés du composant.
 * @param {boolean} props.open - Contrôle la visibilité du loader.
 * @param {string} [props.message="Chargement..."] - Le message à afficher sous le spinner.
 */
function FullScreenLoader({ open, message = "Chargement..." }) {
  return (
    <Backdrop
      sx={{ 
        color: '#fff', 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent
        zIndex: (theme) => theme.zIndex.drawer + 1 // Assure qu'il est au-dessus de tout
      }}
      open={open}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CircularProgress color="inherit" />
        <Typography sx={{ mt: 2 }}>
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
}

export default FullScreenLoader;