// src/components/BookingModal.jsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

function BookingModal({ open, onClose, onSubmit, service }) {
  const [bookingDate, setBookingDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      serviceId: service._id,
      bookingDate,
      notes,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Réserver le service</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="h6" gutterBottom>{service?.title}</Typography>
          <TextField
            label="Date de la réservation"
            type="date"
            fullWidth
            required
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Notes supplémentaires (optionnel)"
            multiline
            rows={3}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained">Confirmer</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
// Ajout d'un import manquant
import { Typography } from '@mui/material';
export default BookingModal;