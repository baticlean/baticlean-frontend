import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings } from '../redux/bookingSlice.js';
import { Container, Typography, Box, Paper, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';

function MyBookingsPage() {
  const dispatch = useDispatch();
  // --- LA CORRECTION EST ICI ---
  // On lit dans 'userBookings' au lieu de 'items'
  const { userBookings: bookings, loading, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Mes Réservations</Typography>
      {bookings && bookings.length === 0 ? (
        <Typography>Vous n'avez aucune réservation pour le moment.</Typography>
      ) : (
        <Paper>
          <List>
            {(bookings || []).map(booking => (
              <ListItem key={booking._id} divider>
                <ListItemText 
                  primary={booking.service?.title || 'Service non disponible'}
                  secondary={`Date: ${new Date(booking.bookingDate).toLocaleDateString()} - Statut: ${booking.status}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
}

export default MyBookingsPage;