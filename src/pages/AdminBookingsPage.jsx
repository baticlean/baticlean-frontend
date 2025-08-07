import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBookings, updateBookingStatus, deleteBooking } from '../redux/bookingSlice.js';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Alert, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookingDetailsModal from '../components/BookingDetailsModal.jsx'; // Importer

function AdminBookingsPage() {
  const dispatch = useDispatch();
  const { allBookings, loading, error } = useSelector((state) => state.bookings);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);
  
  const handleDelete = (bookingId) => {
    toast.promise(
      dispatch(deleteBooking(bookingId)).unwrap(),
      {
        pending: 'Suppression en cours...',
        success: 'Réservation supprimée.',
        error: 'Erreur lors de la suppression.'
      }
    );
  };

  if (loading && allBookings.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Gestion des Réservations</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Utilisateur</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allBookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking.user?.username || 'N/A'}</TableCell>
                  <TableCell>{booking.service?.title || 'N/A'}</TableCell>
                  <TableCell>{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => setSelectedBooking(booking)} color="primary">
                        <VisibilityIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(booking._id)}>
                        <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <BookingDetailsModal booking={selectedBooking} open={!!selectedBooking} onClose={() => setSelectedBooking(null)} />
    </>
  );
}

export default AdminBookingsPage;