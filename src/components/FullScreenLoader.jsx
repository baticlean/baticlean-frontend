// src/components/FullScreenLoader.jsx

import React from 'react';
import { Backdrop, Typography, Box } from '@mui/material';
import { keyframes } from '@emotion/react';

// On définit l'animation des points avec @keyframes
const pulseAnimation = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0;
  }
  40% {
    transform: scale(1.0);
    opacity: 1;
  }
`;

// Styles pour le conteneur des points
const Bouncer = (props) => (
  <Box
    sx={{
      width: '70px',
      display: 'flex',
      justifyContent: 'space-between',
    }}
    {...props}
  />
);

// Style pour chaque point individuel
const BouncerDot = (props) => (
  <Box
    component="span"
    sx={{
      width: '12px',
      height: '12px',
      backgroundColor: '#8A2387', // Une belle couleur violette
      borderRadius: '50%',
      display: 'inline-block',
      animation: `${pulseAnimation} 1.4s infinite ease-in-out both`,
    }}
    {...props}
  />
);

function FullScreenLoader({ open, message = "Chargement..." }) {
  return (
    <Backdrop
      sx={{ 
        color: '#fff', 
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fond grisé plus clair
        zIndex: (theme) => theme.zIndex.drawer + 2 // On s'assure qu'il est bien au-dessus
      }}
      open={open}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* L'animation des points */}
        <Bouncer>
          <BouncerDot sx={{ animationDelay: '-0.32s' }} />
          <BouncerDot sx={{ animationDelay: '-0.16s' }} />
          <BouncerDot />
        </Bouncer>
        
        <Typography sx={{ mt: 3, color: '#333', fontWeight: '500' }}>
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
}

export default FullScreenLoader;