// baticlean-frontend/src/components/UpdatingScreen.jsx

import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

const spinTransition = { loop: Infinity, ease: "linear", duration: 4 };
const bounceTransition = { y: { duration: 0.8, yoyo: Infinity, ease: "easeOut" } };

const UpdatingScreen = ({ open }) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #005B6A 0%, #2E7D32 100%)', 
        color: 'white', zIndex: 9999, p: 3
      }}
    >
      <Box sx={{ position: 'relative', width: { xs: 150, sm: 200 }, height: { xs: 150, sm: 200 }, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={spinTransition} style={{ position: 'absolute', top: 10, left: 10, opacity: 0.2 }}>
          <SettingsSuggestIcon sx={{ fontSize: { xs: 80, sm: 100 } }} />
        </motion.div>
        <motion.div animate={{ y: ["0%", "-10%"] }} transition={bounceTransition} style={{ zIndex: 2, display: 'flex', gap: 15 }}>
            <EngineeringIcon sx={{ fontSize: { xs: 60, sm: 80 }, color: '#FFD700' }} />
            <CleaningServicesIcon sx={{ fontSize: { xs: 60, sm: 80 }, color: '#AFEEEE' }} />
        </motion.div>
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
        Optimisation du Système 🛠️
      </Typography>
      <Typography variant="body1" sx={{ mb: 1, opacity: 0.9, textAlign: 'center', maxWidth: 500 }}>
        BATIClean se met à jour pour vous offrir une meilleure expérience.
      </Typography>
      
      {/* ✅ TEXTE MODIFIÉ : "un certain temps" */}
      <Typography variant="caption" sx={{ mb: 4, opacity: 0.7, fontStyle: 'italic' }}>
        Cela peut prendre un certain temps selon votre connexion...
      </Typography>

      <CircularProgress color="inherit" size={30} thickness={4} />
    </Box>
  );
};

export default UpdatingScreen;