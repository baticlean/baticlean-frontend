// src/pages/AdminBookingsPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBookings, updateBookingStatus } from '../redux/bookingSlice.js';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ButtonGroup, Button, CircularProgress, Alert } from '@mui/material';
import { toast } from 'react-toastify';

function AdminBookingsPage() {
  const dispatch = useDispatch();
  const { allBookings, loading, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const handleStatusUpdate = (bookingId, status) => {
    toast.promise(
      dispatch(updateBookingStatus({ bookingId, status })).unwrap(),
      {
        pending: 'Mise à jour du statut...',
        success: 'Statut de la réservation mis à jour !',
        error: 'Erreur lors de la mise à jour.'
      }
    );
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Réservations
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Utilisateur</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date de Réservation</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Statut Actuel</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allBookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{booking.user?.username || 'Utilisateur introuvable'}</TableCell>
                <TableCell>{booking.service?.title || 'Service introuvable'}</TableCell>
                <TableCell>{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
                <TableCell>{booking.status}</TableCell>
                <TableCell align="right">
                  {booking.status === 'En attente' && (
                    <ButtonGroup size="small">
                      <Button color="success" onClick={() => handleStatusUpdate(booking._id, 'Confirmée')}>Confirmer</Button>
                      <Button color="error" onClick={() => handleStatusUpdate(booking._id, 'Annulée')}>Annuler</Button>
                    </ButtonGroup>
                  )}
                   {booking.status === 'Confirmée' && (
                    <Button size="small" variant="contained" color="primary" onClick={() => handleStatusUpdate(booking._id, 'Terminée')}>
                      Marquer comme terminée
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default AdminBookingsPage;