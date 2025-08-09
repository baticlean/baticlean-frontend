import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings, cancelBooking, toggleHideBooking } from '../redux/bookingSlice.js';
import {
    Container, Typography, Box, CircularProgress, Alert,
    Accordion, AccordionSummary, AccordionDetails, Button, Chip,
    Stack, FormControlLabel, Switch, IconButton, Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from 'react-toastify';
import BookingTimeline from '../components/BookingTimeline.jsx';
import CustomModal from '../components/CustomModal.jsx'; // Assurez-vous d'avoir un composant modal

function MyBookingsPage() {
    const dispatch = useDispatch();
    // ✅ On récupère les deux listes de réservations
    const { userBookings, hiddenUserBookings, loading, error } = useSelector((state) => state.bookings);
    const [showHidden, setShowHidden] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);

    // ✅ On recharge les données quand on bascule la vue
    useEffect(() => {
        dispatch(fetchUserBookings(showHidden));
    }, [dispatch, showHidden]);

    const handleConfirmCancel = () => {
        if (bookingToCancel) {
            toast.promise(
                dispatch(cancelBooking(bookingToCancel)).unwrap(),
                {
                    pending: 'Annulation en cours...',
                    success: 'Réservation annulée.',
                    error: 'Impossible d\'annuler cette réservation.'
                }
            );
            setBookingToCancel(null); // Ferme le modal
        }
    };

    // ✅ Nouvelle fonction pour masquer/afficher
    const handleToggleHide = (e, bookingId) => {
        e.stopPropagation(); // Important pour ne pas ouvrir/fermer l'accordéon
        const actionText = showHidden ? 'afficher' : 'masquer';
        toast.promise(
            dispatch(toggleHideBooking({ bookingId, hide: !showHidden })).unwrap(),
            {
                pending: 'Mise à jour...',
                success: `Réservation ${showHidden ? 'affichée' : 'masquée'} !`,
                error: `Erreur pour ${actionText} la réservation.`
            }
        );
    };
    
    // ✅ On choisit la bonne liste à afficher
    const bookingsToDisplay = showHidden ? hiddenUserBookings : userBookings;

    if (loading && bookingsToDisplay.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" gutterBottom>
                        {showHidden ? 'Réservations Masquées' : 'Mes Réservations'}
                    </Typography>
                    <FormControlLabel
                        control={<Switch checked={showHidden} onChange={() => setShowHidden(!showHidden)} />}
                        label="Voir les masquées"
                    />
                </Stack>
                {bookingsToDisplay.length === 0 ? (
                    <Typography>{showHidden ? 'Aucune réservation masquée.' : 'Vous n\'avez aucune réservation pour le moment.'}</Typography>
                ) : (
                    bookingsToDisplay.map(booking => (
                        <Accordion key={booking._id} defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', pr: 2 }}>
                                    <Typography>
                                        {booking.service.title} - {new Date(booking.bookingDate).toLocaleDateString()}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Chip 
                                            label={booking.status} 
                                            color={
                                                booking.status === 'Confirmée' ? 'success' : 
                                                booking.status === 'Terminée' ? 'primary' :
                                                booking.status === 'Annulée' ? 'error' : 'info'
                                            } 
                                        />
                                        <Tooltip title={showHidden ? "Afficher la réservation" : "Masquer la réservation"}>
                                            <IconButton size="small" onClick={(e) => handleToggleHide(e, booking._id)}>
                                                {showHidden ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="h6">Suivi de votre réservation :</Typography>
                                <BookingTimeline timeline={booking.timeline} currentStatus={booking.status} />
                                <Box sx={{mt: 2, display: 'flex', gap: 1}}>
                                    {!showHidden && booking.status === 'En attente' && (
                                        <Button 
                                            variant="contained" 
                                            color="warning" 
                                            size="small" 
                                            onClick={() => setBookingToCancel(booking._id)}
                                        >
                                            Annuler la réservation
                                        </Button>
                                    )}
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    ))
                )}
            </Container>

            {/* Modal de confirmation pour l'annulation */}
            <CustomModal
                open={!!bookingToCancel}
                onClose={() => setBookingToCancel(null)}
                title="Confirmer l'annulation"
                content="Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible."
                actions={
                    <>
                        <Button onClick={() => setBookingToCancel(null)}>Retour</Button>
                        <Button onClick={handleConfirmCancel} color="error">Confirmer l'annulation</Button>
                    </>
                }
            />
        </>
    );
}

export default MyBookingsPage;
