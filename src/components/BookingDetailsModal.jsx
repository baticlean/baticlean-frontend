import React from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, ButtonGroup } from '@mui/material';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { toast } from 'react-toastify';
import { updateBookingStatus } from '../redux/bookingSlice';

function BookingDetailsModal({ booking, open, onClose }) {
  const dispatch = useDispatch();

  if (!booking) return null;

  const handleStatusUpdate = (status) => {
    toast.promise(
      dispatch(updateBookingStatus({ bookingId: booking._id, status })).unwrap(),
      {
        pending: 'Mise à jour du statut...',
        success: 'Statut mis à jour !',
        error: 'Erreur lors de la mise à jour.'
      }
    ).then(onClose); // Ferme la modal après la mise à jour
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails de la Réservation</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom><strong>Service:</strong> {booking.service?.title}</Typography>
        <Typography gutterBottom><strong>Client:</strong> {booking.user?.username} ({booking.user?.email})</Typography>
        <Typography gutterBottom><strong>Date:</strong> {format(new Date(booking.bookingDate), 'eeee dd MMMM yyyy', { locale: fr })} à {booking.bookingTime}</Typography>
        <Typography gutterBottom><strong>Adresse:</strong> {booking.address}</Typography>
        <Typography gutterBottom><strong>Téléphone:</strong> {booking.phoneNumber}</Typography>
        <Typography gutterBottom><strong>Statut actuel:</strong> {booking.status}</Typography>
        {booking.notes && <Typography gutterBottom><strong>Notes:</strong> {booking.notes}</Typography>}
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px', justifyContent: 'space-between' }}>
        <Button onClick={onClose}>Fermer</Button>
        <ButtonGroup variant="contained" size="small">
            <Button color="success" onClick={() => handleStatusUpdate('Confirmée')} disabled={booking.status !== 'En attente'}>
                Confirmer
            </Button>
            <Button color="primary" onClick={() => handleStatusUpdate('Terminée')} disabled={booking.status !== 'Confirmée'}>
                Terminer
            </Button>
            <Button color="error" onClick={() => handleStatusUpdate('Annulée')} disabled={['Terminée', 'Annulée'].includes(booking.status)}>
                Annuler
            </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
}

export default BookingDetailsModal;