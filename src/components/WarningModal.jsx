// src/components/WarningModal.jsx

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

function WarningModal({ open, onClose, onSubmit }) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim()) {
      onSubmit(message);
      setMessage(''); // On vide le champ après envoi
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Envoyer un avertissement</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="warning-message"
          label="Message de l'avertissement"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="warning">
          Envoyer l'avertissement
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default WarningModal;