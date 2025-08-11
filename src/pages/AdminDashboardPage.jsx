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

// Le composant StatCard est parfait, aucune modification n'est nécessaire.
const StatCard = ({ title, value, icon }) => (
    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
        {icon}
        <Box>
            <Typography variant="h6">{value ?? 0}</Typography>
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
            // Si aucun token n'est présent au montage, on arrête le chargement.
            setLoading(false);
            setError("Vous n'êtes pas authentifié.");
        }
    }, [token]);

    // 1. État de chargement
    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    }

    // 2. État d'erreur
    if (error) {
        return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
    }

    // 3. Garde-fou principal : la clé de la stabilité
    if (!stats || !stats.stats) {
        return <Alert severity="warning" sx={{ m: 3 }}>Aucune donnée statistique à afficher pour le moment.</Alert>;
    }

    // 4. Rendu du composant si toutes les données sont valides
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Tableau de Bord
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Total Utilisateurs" value={stats.stats.totalUsers} icon={<PeopleAlt color="primary" sx={{ fontSize: 40 }} />} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Réservations en Attente" value={stats.stats.pendingBookings} icon={<BookOnline color="warning" sx={{ fontSize: 40 }} />} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Nouveaux Clients (7j)" value={stats.stats.newUsersLast7Days} icon={<PeopleAlt color="success" sx={{ fontSize: 40 }} />} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Nouvelles Réservations (7j)" value={stats.stats.newBookingsLast7Days} icon={<BookOnline color="info" sx={{ fontSize: 40 }} />} /></Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Typography variant="h6" gutterBottom>Derniers Avis Clients</Typography>
                        <List sx={{ flexGrow: 1 }}>
                            {stats.recentReviews?.length > 0 ? (
                                stats.recentReviews.map((review, index) => (
                                    review && (
                                        <React.Fragment key={review._id || index}>
                                            <ListItem alignItems="flex-start">
                                                <ListItemText
                                                    primary={<><Rating value={review.rating || 0} readOnly size="small" /> pour "{review.serviceTitle || 'Service non spécifié'}"</>}
                                                    secondary={<>"{review.comment}" - <Typography component="span" variant="body2" color="text.primary">{review.username || 'Anonyme'}</Typography></>}
                                                />
                                            </ListItem>
                                            {index < stats.recentReviews.length - 1 && <Divider component="li" />}
                                        </React.Fragment>
                                    )
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
                            {stats.recentTickets?.length > 0 ? (
                                stats.recentTickets.map((ticket, index) => (
                                    ticket?.user && (
                                        <React.Fragment key={ticket._id}>
                                            <ListItem>
                                                <ListItemAvatar><Avatar>{ticket.user.username?.[0] || '?'}</Avatar></ListItemAvatar>
                                                <ListItemText
                                                    primary={`Ticket de ${ticket.user.username}`}
                                                    secondary={`Ouvert le: ${new Date(ticket.createdAt).toLocaleDateString()}`}
                                                />
                                            </ListItem>
                                            {index < stats.recentTickets.length - 1 && <Divider component="li" />}
                                        </React.Fragment>
                                    )
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