import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings, cancelBooking, toggleHideBooking, markOneBookingAsRead } from '../redux/bookingSlice.js';
import {
    Container, Typography, Box, CircularProgress, Alert,
    Accordion, AccordionSummary, AccordionDetails, Button, Chip,
    Stack, FormControlLabel, Switch, IconButton, Tooltip, Badge
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import BookingTimeline from '../components/BookingTimeline.jsx';
import CustomModal from '../components/CustomModal.jsx';
import ReviewModal from '../components/ReviewModal.jsx';

function MyBookingsPage() {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { userBookings, hiddenUserBookings, loading, error } = useSelector((state) => state.bookings);
    const [showHidden, setShowHidden] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);
    const [bookingToReview, setBookingToReview] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [expanded, setExpanded] = useState(false);

    // --- TOUTE LA LOGIQUE RESTE INCHANGÉE ---
    useEffect(() => {
        dispatch(fetchUserBookings(showHidden));
    }, [dispatch, showHidden]);

    useEffect(() => {
        const reviewBookingId = searchParams.get('reviewBookingId');
        if (reviewBookingId && !loading && userBookings.length > 0) {
            const bookingFromLink = userBookings.find(b => b._id === reviewBookingId);
            if (bookingFromLink && bookingFromLink.status === 'Terminée' && !bookingFromLink.hasBeenReviewed) {
                setBookingToReview(bookingFromLink);
                searchParams.delete('reviewBookingId');
                setSearchParams(searchParams, { replace: true });
            }
        }
    }, [userBookings, loading, searchParams, setSearchParams]);

    const handleConfirmCancel = () => {
        if (bookingToCancel) {
            toast.promise(dispatch(cancelBooking(bookingToCancel)).unwrap(), {
                pending: 'Annulation en cours...',
                success: 'Réservation annulée.',
                error: 'Impossible d\'annuler cette réservation.'
            });
            setBookingToCancel(null);
        }
    };

    const handleToggleHide = (e, bookingId) => {
        e.stopPropagation();
        const actionText = showHidden ? 'afficher' : 'masquer';
        toast.promise(dispatch(toggleHideBooking({ bookingId, hide: !showHidden })).unwrap(), {
            pending: 'Mise à jour...',
            success: `Réservation ${showHidden ? 'affichée' : 'masquée'} !`,
            error: `Erreur pour ${actionText} la réservation.`
        });
    };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        const booking = bookingsToDisplay.find(b => b._id === panel);
        if (isExpanded && booking && !booking.isReadByUser) {
            dispatch(markOneBookingAsRead(booking._id));
        }
    };

    const handleCloseReviewModal = (reviewSubmitted) => {
        setBookingToReview(null);
        if (reviewSubmitted) {
            dispatch(fetchUserBookings(showHidden));
        }
    };
    
    const bookingsToDisplay = showHidden ? hiddenUserBookings : userBookings;

    if (loading && bookingsToDisplay.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

    return (
        <>
            {/* RESPONSIVE: Marges et padding ajustés */}
            <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: 4, px: { xs: 2, sm: 3 } }}>
                {/* RESPONSIVE: En-tête de page flexible */}
                <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    justifyContent="space-between" 
                    alignItems={{ xs: 'flex-start', sm: 'center' }} 
                    mb={3}
                >
                    <Typography variant={{ xs: 'h5', sm: 'h4' }} gutterBottom>
                        {showHidden ? 'Réservations Archivées' : 'Mes Réservations'}
                    </Typography>
                    <FormControlLabel
                        control={<Switch checked={showHidden} onChange={() => setShowHidden(!showHidden)} />}
                        label="Voir les archives"
                        sx={{ ml: { xs: 0, sm: 1 } }}
                    />
                </Stack>
                
                {bookingsToDisplay.length === 0 ? (
                    <Typography>{showHidden ? 'Aucune réservation archivée.' : 'Vous n\'avez aucune réservation pour le moment.'}</Typography>
                ) : (
                    bookingsToDisplay
                        .filter(booking => booking && booking.service)
                        .map(booking => (
                            <Accordion 
                                key={booking._id} 
                                expanded={expanded === booking._id} 
                                onChange={handleAccordionChange(booking._id)}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    {/* RESPONSIVE: Le conteneur principal du résumé devient une colonne sur mobile */}
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        justifyContent: 'space-between', 
                                        width: '100%', 
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        gap: 1.5
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            {!booking.isReadByUser && !showHidden && (
                                                <Badge color="success" variant="dot" />
                                            )}
                                            {/* RESPONSIVE: Le titre peut maintenant prendre toute la largeur nécessaire */}
                                            <Typography variant="body1">
                                                {booking.service?.title || 'Service Supprimé'} - {new Date(booking.bookingDate).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        {/* RESPONSIVE: Le statut et l'icône s'alignent à droite sur mobile */}
                                        <Stack 
                                            direction="row" 
                                            spacing={1} 
                                            alignItems="center"
                                            sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: 'flex-end' }}
                                        >
                                            <Chip 
                                                label={booking.status} 
                                                color={booking.status === 'Confirmée' ? 'success' : booking.status === 'Terminée' ? 'primary' : booking.status === 'Annulée' ? 'error' : 'info'} 
                                            />
                                            <Tooltip title={showHidden ? "Restaurer" : "Archiver"}>
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
                                    {/* RESPONSIVE: Le conteneur des boutons peut passer à la ligne */}
                                    <Box sx={{mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap'}}>
                                        {!showHidden && booking.status === 'En attente' && (
                                            <Button variant="contained" color="warning" size="small" onClick={() => setBookingToCancel(booking._id)}>
                                                Annuler la réservation
                                            </Button>
                                        )}
                                        {!showHidden && booking.status === 'Terminée' && !booking.hasBeenReviewed && (
                                            <Button variant="contained" color="primary" size="small" startIcon={<StarIcon />} onClick={() => setBookingToReview(booking)}>
                                                Laisser un avis
                                            </Button>
                                        )}
                                        {booking.status === 'Terminée' && booking.hasBeenReviewed && (
                                            <Chip label="Vous avez déjà laissé un avis" color="success" variant="outlined" size="small" />
                                        )}
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        ))
                )}
            </Container>

            <CustomModal
                open={!!bookingToCancel}
                onClose={() => setBookingToCancel(null)}
                title="Confirmer l'annulation"
                content="Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible."
                actions={<><Button onClick={() => setBookingToCancel(null)}>Retour</Button><Button onClick={handleConfirmCancel} color="error">Confirmer</Button></>}
            />
            
            {bookingToReview && (
                <ReviewModal 
                    open={!!bookingToReview}
                    onClose={handleCloseReviewModal}
                    booking={bookingToReview}
                    token={token}
                />
            )}
        </>
    );
}

export default MyBookingsPage;