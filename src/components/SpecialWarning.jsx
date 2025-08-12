// src/components/SpecialWarning.jsx

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button, Paper } from '@mui/material';
import ContactSupportModal from './ContactSupportModal.jsx';
import { dismissWarning } from '../redux/warningSlice.js'; // ✅ On importe l'action pour supprimer
import { toast } from 'react-toastify';

function SpecialWarning() {
  const dispatch = useDispatch();
  // ✅ 1. On se connecte à Redux pour récupérer la liste des avertissements
  const { items: warnings } = useSelector((state) => state.warnings);
  
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // ✅ 2. On affiche toujours le premier avertissement de la liste (le plus récent)
  const currentWarning = warnings?.[0];

  // Si pas d'avertissement, on n'affiche rien
  if (!currentWarning) {
    return null;
  }

  // ✅ 3. Fonction pour fermer l'avertissement
  const handleDismiss = () => {
    dispatch(dismissWarning(currentWarning._id))
      .unwrap()
      .catch(() => {
        toast.error("Erreur, impossible de fermer l'avertissement.");
      });
  };

  // ✅ 4. Fonction pour le bouton "Régler le problème"
  const handleActionClick = (actionType) => {
    if (actionType === 'contact_support') {
      setContactModalOpen(true);
    }
    // Peu importe l'action, on ferme la notification après avoir cliqué
    handleDismiss();
  };

  return (
    <>
      <Paper 
        elevation={8} 
        sx={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: '95%', sm: 'auto' },
          maxWidth: '600px',
          bgcolor: 'error.main',
          color: 'white',
          p: 2.5,
          borderRadius: 2,
          zIndex: 9999,
          textAlign: 'center'
        }}
      >
        <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
          {currentWarning.message}
        </Typography>
        
        <Typography variant="caption" sx={{ fontStyle: 'italic', opacity: 0.8 }}>
          Cette notification restera visible jusqu'à ce qu'une action soit prise.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          {/* ✅ 5. On affiche les boutons d'action dynamiquement */}
          {currentWarning.actions?.map(action => (
            <Button 
              key={action.type} 
              variant="contained" 
              sx={{ bgcolor: 'white', color: 'error.main', '&:hover': { bgcolor: 'grey.200' } }} 
              onClick={() => handleActionClick(action.type)}
            >
              {action.label}
            </Button>
          ))}
          <Button variant="outlined" color="inherit" onClick={handleDismiss}>
            Fermer
          </Button>
        </Box>
      </Paper>
      {/* La modale de contact reste la même */}
      <ContactSupportModal open={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </>
  );
}

export default SpecialWarning;