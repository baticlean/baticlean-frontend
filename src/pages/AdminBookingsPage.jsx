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
    const validBookings = Array.isArray(bookingsToDisplay) ? bookingsToDisplay.filter(Boolean) : [];

    if (loading && validBookings.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

    return (
        <>
            {/* RESPONSIVE: Ajustement des marges et du padding pour les petits écrans */}
            <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 4 }, mb: 4, px: { xs: 2, sm: 3 } }}>
                
                {/* RESPONSIVE: La direction du Stack passe en 'column' sur xs */}
                <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    justifyContent="space-between" 
                    alignItems={{ xs: 'flex-start', sm: 'center' }} 
                    mb={3}
                >
                    {/* RESPONSIVE: La taille de la police du titre est réduite sur xs */}
                    <Typography variant={{ xs: 'h5', sm: 'h4' }} gutterBottom>
                        {showHidden ? 'Réservations Archivées' : 'Gestion des Réservations'}
                    </Typography>
                    <FormControlLabel
                        control={<Switch checked={showHidden} onChange={() => setShowHidden(!showHidden)} />}
                        label="Voir les archives"
                        // RESPONSIVE: On supprime la marge à gauche sur mobile pour un meilleur alignement
                        sx={{ ml: { xs: 0, sm: 1 } }} 
                    />
                </Stack>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Utilisateur</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
                                
                                {/* RESPONSIVE: Colonne masquée sur les écrans xs */}
                                <TableCell sx={{ fontWeight: 'bold', display: { xs: 'none', md: 'table-cell' } }}>Date</TableCell>
                                
                                {/* RESPONSIVE: Colonne masquée sur les écrans xs */}
                                <TableCell sx={{ fontWeight: 'bold', display: { xs: 'none', md: 'table-cell' } }}>Statut</TableCell>
                                
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {validBookings.map((booking) => (
                                <TableRow key={booking._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {booking.user ? booking.user.username : <Typography variant="caption" color="error">Utilisateur supprimé</Typography>}
                                    </TableCell>
                                    <TableCell>{booking.service ? booking.service.title : <Typography variant="caption" color="error">Service supprimé</Typography>}</TableCell>
                                    
                                    {/* RESPONSIVE: Cellule masquée sur les écrans xs */}
                                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                        {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('fr-FR') : 'Date inconnue'}
                                    </TableCell>
                                    
                                    {/* RESPONSIVE: Cellule masquée sur les écrans xs */}
                                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                        {booking.status || 'Statut inconnu'}
                                    </TableCell>
                                    
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