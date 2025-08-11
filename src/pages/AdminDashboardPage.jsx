import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
    Container, 
    Grid, 
    Paper, 
    Typography, 
    Box, 
    CircularProgress, 
    Alert, 
    Rating, 
    List, 
    ListItem, 
    ListItemText, 
    Divider, 
    Avatar, 
    ListItemAvatar 
} from '@mui/material';
import { PeopleAlt, BookOnline } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

// RESPONSIVE: On passe les props de taille d'icône et de variante de typo pour les rendre dynamiques
const StatCard = ({ title, value, icon, iconSize, valueVariant }) => (
    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
        {/* On clone l'icône pour lui appliquer les styles responsives */}
        {React.cloneElement(icon, { sx: { ...icon.props.sx, fontSize: iconSize } })}
        <Box>
            <Typography variant={valueVariant}>{value ?? 0}</Typography>
            <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
        </Box>
    </Paper>
);

function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(`${API_URL}/api/admin/dashboard-stats`, config);
                setStats(response.data);
            } catch (err) {
                setError('Impossible de charger les statistiques du tableau de bord.');
                toast.error('Erreur de chargement des données.');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchStats();
        } else {
            setLoading(false);
            setError("Vous n'êtes pas authentifié.");
        }
    }, [token]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
    }

    if (!stats) {
        return <Alert severity="warning" sx={{ m: 3 }}>Aucune donnée statistique à afficher pour le moment.</Alert>;
    }

    // RESPONSIVE: On définit les tailles responsives ici pour les passer aux StatCards
    const iconSize = { xs: 32, sm: 40 };
    const valueVariant = { xs: 'h5', sm: 'h6' };

    return (
        // RESPONSIVE: Ajustement des marges et du padding pour les petits écrans
        <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 4, px: { xs: 2, sm: 3 } }}>
            {/* RESPONSIVE: La taille de la police du titre est réduite sur xs */}
            <Typography variant={{ xs: 'h5', sm: 'h4' }} gutterBottom sx={{ mb: 3 }}>
                Tableau de Bord
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* On passe les props responsives à chaque StatCard */}
                <Grid item xs={12} sm={6} md={3}><StatCard title="Total Utilisateurs" value={stats.stats?.totalUsers} icon={<PeopleAlt color="primary" />} iconSize={iconSize} valueVariant={valueVariant} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Réservations en Attente" value={stats.stats?.pendingBookings} icon={<BookOnline color="warning" />} iconSize={iconSize} valueVariant={valueVariant} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Nouveaux Clients (7j)" value={stats.stats?.newUsersLast7Days} icon={<PeopleAlt color="success" />} iconSize={iconSize} valueVariant={valueVariant} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Nouvelles Réservations (7j)" value={stats.stats?.newBookingsLast7Days} icon={<BookOnline color="info" />} iconSize={iconSize} valueVariant={valueVariant} /></Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Typography variant="h6" gutterBottom>Derniers Avis Clients</Typography>
                        <List sx={{ flexGrow: 1 }}>
                            {Array.isArray(stats.recentReviews) && stats.recentReviews.length > 0 ? (
                                stats.recentReviews.filter(Boolean).map((review, index) => (
                                    <React.Fragment key={review._id || index}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemText
                                                // RESPONSIVE: Empilement vertical sur mobile pour une meilleure lisibilité
                                                primary={
                                                    <Box component="span" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 0.5, sm: 1 }}}>
                                                        <Rating value={review?.rating ?? 0} readOnly size="small" />
                                                        <Typography variant="body2" component="span" color="text.secondary">
                                                            pour "{review?.serviceTitle ?? 'Service non spécifié'}"
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={<>"{review?.comment ?? ''}" - <Typography component="span" variant="body2" color="text.primary">{review?.username ?? 'Anonyme'}</Typography></>}
                                            />
                                        </ListItem>
                                        {index < stats.recentReviews.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <ListItem><ListItemText primary="Aucun avis récent." /></ListItem>
                            )}
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Typography variant="h6" gutterBottom>Derniers Tickets en Attente</Typography>
                        <List sx={{ flexGrow: 1 }}>
                            {Array.isArray(stats.recentTickets) && stats.recentTickets.length > 0 ? (
                                stats.recentTickets.filter(ticket => ticket && ticket.user).map((ticket, index) => (
                                    <React.Fragment key={ticket._id}>
                                        <ListItem>
                                            <ListItemAvatar><Avatar>{ticket.user.username?.[0]?.toUpperCase() ?? '?'}</Avatar></ListItemAvatar>
                                            <ListItemText
                                                primary={`Ticket de ${ticket.user?.username ?? 'Utilisateur supprimé'}`}
                                                secondary={ticket.createdAt ? `Ouvert le: ${new Date(ticket.createdAt).toLocaleDateString('fr-FR')}` : 'Date inconnue'}
                                            />
                                        </ListItem>
                                        {index < stats.recentTickets.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <ListItem><ListItemText primary="Aucun ticket en attente." /></ListItem>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default AdminDashboardPage;