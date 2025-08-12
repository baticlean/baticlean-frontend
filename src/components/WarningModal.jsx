// src/components/WarningModal.jsx

import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    FormGroup, FormControlLabel, Checkbox, Typography, Box
} from '@mui/material';

// On définit les actions possibles ici pour les réutiliser facilement
const AVAILABLE_ACTIONS = [
    { label: "Contacter le support", type: "contact_support" },
    { label: "Vérifier Mon Profil", type: "review_profile" },
    // On pourra en ajouter d'autres plus tard
];

function WarningModal({ open, onClose, onSubmit }) {
  const [message, setMessage] = useState('');
  // ✅ On ajoute un état pour suivre les actions cochées
  const [selectedActions, setSelectedActions] = useState([]);

  const handleActionChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedActions(prev => [...prev, name]);
    } else {
      setSelectedActions(prev => prev.filter(actionType => actionType !== name));
    }
  };

  const handleSubmit = () => {
    if (message.trim()) {
      // ✅ On envoie maintenant un objet contenant le message ET les actions
      const actionsToSubmit = AVAILABLE_ACTIONS.filter(a => selectedActions.includes(a.type));
      onSubmit({ message, actions: actionsToSubmit });
      
      // On réinitialise l'état pour la prochaine fois
      setMessage('');
      setSelectedActions([]);
    }
  };

  const handleClose = () => {
    setMessage('');
    setSelectedActions([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Envoyer un avertissement</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Message de l'avertissement"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {/* ✅ On ajoute les checkboxes pour les actions */}
        <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>Actions suggérées pour l'utilisateur :</Typography>
            <FormGroup>
                {AVAILABLE_ACTIONS.map(action => (
                    <FormControlLabel
                        key={action.type}
                        control={
                            <Checkbox 
                                checked={selectedActions.includes(action.type)} 
                                onChange={handleActionChange} 
                                name={action.type} 
                            />
                        }
                        label={action.label}
                    />
                ))}
            </FormGroup>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="warning">
          Envoyer l'avertissement
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default WarningModal;