import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings, cancelBooking } from '../redux/bookingSlice.js';
import {
  Container, Typography, Box, Paper, CircularProgress, Alert,
  Accordion, AccordionSummary, AccordionDetails, Button, Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';

// Composant pour la timeline
const Timeline = ({ events }) => (
  <Box sx={{ mt: 2 }}>
    {events.map((event, index) => (
      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Chip 
          label={event.status} 
          color={
            event.status === 'Confirmée' ? 'success' : 
            event.status === 'Annulée' ? 'error' : 'primary'
          } 
          size="small" 
        />
        <Typography variant="caption" sx={{ ml: 2 }}>
          {new Date(event.updatedAt).toLocaleString()}
        </Typography>
      </Box>
    ))}
  </Box>
);

function MyBookingsPage() {
  const dispatch = useDispatch();
  const { userBookings, loading, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const handleCancel = (bookingId) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      toast.promise(
        dispatch(cancelBooking(bookingId)).unwrap(),
        {
          pending: 'Annulation en cours...',
          success: 'Réservation annulée.',
          error: 'Impossible d\'annuler cette réservation.'
        }
      );
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Mes Réservations</Typography>
      {userBookings.length === 0 ? (
        <Typography>Vous n'avez aucune réservation pour le moment.</Typography>
      ) : (
        userBookings.map(booking => (
          <Accordion key={booking._id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Typography>
                  {booking.service.title} - {new Date(booking.bookingDate).toLocaleDateString()}
                </Typography>
                <Chip label={booking.status} color="primary" />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="h6">Suivi de la réservation :</Typography>
              <Timeline events={booking.timeline} />
              {booking.status === 'En attente' && (
                <Button 
                  variant="contained" 
                  color="error" 
                  size="small" 
                  sx={{ mt: 2 }}
                  onClick={() => handleCancel(booking._id)}
                >
                  Annuler la réservation
                </Button>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Container>
  );
}

export default MyBookingsPage;