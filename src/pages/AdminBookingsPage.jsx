// src/pages/AdminBookingsPage.jsx (Corrigé)

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBookings, hideBooking, unhideBooking } from '../redux/bookingSlice.js';
import { 
    Container, Typography, Box, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, CircularProgress, Alert, 
    IconButton, Stack, FormControlLabel, Switch, Tooltip 
} from '@mui/material';
import { toast } from 'react-toastify';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookingDetailsModal from '../components/BookingDetailsModal.jsx';

function AdminBookingsPage() {
    const dispatch = useDispatch();
    const { allBookings, hiddenAdminBookings, loading, error } = useSelector((state) => state.bookings);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showHidden, setShowHidden] = useState(false);

    useEffect(() => {
        dispatch(fetchAllBookings(showHidden));
    }, [dispatch, showHidden]);
    
    const handleToggleHide = (bookingId) => {
        const action = showHidden ? unhideBooking : hideBooking;
        const messages = showHidden 
            ? { pending: 'Restauration...', success: 'Réservation restaurée.', error: 'Erreur de restauration.' }
            : { pending: 'Masquage...', success: 'Réservation masquée.', error: 'Erreur de masquage.' };
        
        toast.promise(dispatch(action(bookingId)).unwrap(), messages);
    };

    const bookingsToDisplay = showHidden ? hiddenAdminBookings : allBookings;

    if (loading && bookingsToDisplay.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

    return (
        <>
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" gutterBottom>
                        {showHidden ? 'Réservations Archivées' : 'Gestion des Réservations'}
                    </Typography>
                    <FormControlLabel
                        control={<Switch checked={showHidden} onChange={() => setShowHidden(!showHidden)} />}
                        label="Voir les archives"
                    />
                </Stack>
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
                            {bookingsToDisplay.map((booking) => (
                                <TableRow key={booking._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    {/* ✅ SÉCURITÉ : On vérifie que les données existent */}
                                    <TableCell>{booking.user ? booking.user.username : <Typography variant="caption" color="error">Utilisateur supprimé</Typography>}</TableCell>
                                    <TableCell>{booking.service ? booking.service.title : <Typography variant="caption" color="error">Service supprimé</Typography>}</TableCell>
                                    <TableCell>{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{booking.status}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Consulter les détails">
                                            <IconButton size="small" onClick={() => setSelectedBooking(booking)} color="primary">
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={showHidden ? 'Restaurer' : 'Archiver'}>
                                            <IconButton size="small" onClick={() => handleToggleHide(booking._id)}>
                                                {showHidden ? <UnarchiveIcon /> : <ArchiveIcon color="action" />}
                                            </IconButton>
                                        </Tooltip>
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