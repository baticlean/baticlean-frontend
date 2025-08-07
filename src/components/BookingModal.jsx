import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box } from '@mui/material';

function BookingModal({ open, onClose, onSubmit, service }) {
  const [bookingDetails, setBookingDetails] = useState({
    bookingDate: '',
    bookingTime: '',
    address: '',
    phoneNumber: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // On ajoute l'ID du service aux données avant de les envoyer
    onSubmit({ ...bookingDetails, serviceId: service._id });
    onClose(); // Ferme la modal après soumission
  };

  if (!service) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Réserver le service : {service.title}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" gutterBottom>
            Veuillez remplir les informations ci-dessous pour finaliser votre réservation.
          </Typography>
          <TextField
            margin="dense"
            label="Date de la réservation"
            type="date"
            fullWidth
            variant="outlined"
            name="bookingDate"
            value={bookingDetails.bookingDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            margin="dense"
            label="Heure de la réservation"
            type="time"
            fullWidth
            variant="outlined"
            name="bookingTime"
            value={bookingDetails.bookingTime}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            margin="dense"
            label="Adresse complète"
            type="text"
            fullWidth
            variant="outlined"
            name="address"
            value={bookingDetails.address}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Numéro de téléphone"
            type="tel"
            fullWidth
            variant="outlined"
            name="phoneNumber"
            value={bookingDetails.phoneNumber}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Notes supplémentaires (optionnel)"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            name="notes"
            value={bookingDetails.notes}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained">Confirmer la réservation</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default BookingModal;