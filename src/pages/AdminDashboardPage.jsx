// src/pages/AdminDashboardPage.jsx (Corrigé)

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Grid, Paper, Typography, Box, CircularProgress, Alert, Rating, List, ListItem, ListItemText, Divider, Avatar, ListItemAvatar } from '@mui/material';
import { PeopleAlt, BookOnline, RateReview, Message } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

const StatCard = ({ title, value, icon }) => (
    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        {icon}
        <Box>
            <Typography variant="h6">{value}</Typography>
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
        fetchStats();
    }, [token]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }
    if (error) {
        return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
    }
    if (!stats || !stats.stats) {
        return <Alert severity="warning" sx={{ m: 3 }}>Aucune donnée à afficher pour le tableau de bord.</Alert>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Tableau de Bord</Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Total Utilisateurs" value={stats.stats.totalUsers} icon={<PeopleAlt color="primary" sx={{ fontSize: 40 }} />} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Réservations en Attente" value={stats.stats.pendingBookings} icon={<BookOnline color="warning" sx={{ fontSize: 40 }} />} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Nouveaux Clients (7j)" value={stats.stats.newUsersLast7Days} icon={<PeopleAlt color="success" sx={{ fontSize: 40 }} />} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Nouvelles Réservations (7j)" value={stats.stats.newBookingsLast7Days} icon={<BookOnline color="info" sx={{ fontSize: 40 }} />} /></Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>Derniers Avis Clients</Typography>
                        <List>
                            {stats.recentReviews && stats.recentReviews.map((review, index) => (
                                <React.Fragment key={review?._id || index}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={<><Rating value={review?.rating || 0} readOnly size="small" /> pour "{review?.serviceTitle || 'Service supprimé'}"</>}
                                            secondary={<>"{review?.comment}" - <Typography component="span" variant="body2" color="text.primary">{review?.username || 'Utilisateur supprimé'}</Typography></>}
                                        />
                                    </ListItem>
                                    {index < stats.recentReviews.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>Derniers Tickets en Attente</Typography>
                        <List>
                            {stats.recentTickets && stats.recentTickets.map((ticket, index) => (
                                ticket && ticket.user ? (
                                    <React.Fragment key={ticket._id}>
                                        <ListItem>
                                            <ListItemAvatar><Avatar>{ticket.user.username.charAt(0)}</Avatar></ListItemAvatar>
                                            <ListItemText
                                                primary={`Ticket de ${ticket.user.username}`}
                                                secondary={`Ouvert le: ${new Date(ticket.createdAt).toLocaleDateString()}`}
                                            />
                                        </ListItem>
                                        {index < stats.recentTickets.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ) : null
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default AdminDashboardPage;