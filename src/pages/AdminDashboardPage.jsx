// src/pages/AdminDashboardPage.jsx (Fichier complet et corrigé)

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Grid, Paper, Typography, Box, CircularProgress, Alert, Rating, List, ListItem, ListItemText, Divider, Avatar, ListItemAvatar } from '@mui/material';
import { PeopleAlt, BookOnline, RateReview, Message } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

// Le composant StatCard n'a pas besoin de modification.
const StatCard = ({ title, value, icon }) => (
    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
        {icon}
        <Box>
            {/* ✅ SÉCURITÉ : On s'assure que 'value' n'est jamais null pour éviter les erreurs React */}
            <Typography variant="h6">{value ?? 0}</Typography>
            <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
        </Box>
    </Paper>
);

function AdminDashboardPage() {
    // On initialise les stats à 'null' pour savoir quand les données ne sont pas encore arrivées.
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Pas de changement ici, la logique de fetch est correcte.
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
        // On s'assure de ne lancer le fetch que si on a un token.
        if (token) {
            fetchStats();
        }
    }, [token]);

    // Affiche un spinner PENDANT le chargement. Pas de changement ici.
    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    // Affiche une erreur si l'appel API a échoué. Pas de changement ici.
    if (error) {
        return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
    }

    // 🛡️ CORRECTION PRINCIPALE : C'est la garde de protection la plus importante.
    // Elle empêche le reste du composant de s'afficher si 'stats' est encore 'null'
    // ou si la structure attendue (`stats.stats`) n'est pas présente dans la réponse de l'API.
    // C'est ce qui corrige directement l'erreur "Cannot read properties of null".
    if (!stats || !stats.stats) {
        return <Alert severity="warning" sx={{ m: 3 }}>Aucune donnée statistique à afficher pour le moment.</Alert>;
    }

    // Le code ci-dessous ne sera exécuté QUE si les vérifications ci-dessus sont passées.
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Tableau de Bord</Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* On accède maintenant à 'stats.stats' en toute sécurité */}
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
                            {/* ✅ SÉCURITÉ : On vérifie que le tableau 'recentReviews' existe avant de le parcourir. */}
                            {stats.recentReviews && stats.recentReviews.map((review, index) => (
                                // ✅ SÉCURITÉ : On utilise une clé unique et stable. On vérifie que 'review' n'est pas null.
                                review && <React.Fragment key={review._id || index}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            // ✅ SÉCURITÉ : Utilisation de l'optional chaining (?.) et de valeurs par défaut ('||')
                                            // pour éviter un crash si une propriété (ex: serviceTitle) est manquante.
                                            primary={<><Rating value={review?.rating || 0} readOnly size="small" /> pour "{review?.serviceTitle || 'Service Indisponible'}"</>}
                                            secondary={<>"{review?.comment}" - <Typography component="span" variant="body2" color="text.primary">{review?.username || 'Utilisateur Anonyme'}</Typography></>}
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
                             {/* ✅ SÉCURITÉ : Même principe pour les tickets. On vérifie que le tableau existe. */}
                            {stats.recentTickets && stats.recentTickets.map((ticket, index) => (
                                // ✅ SÉCURITÉ : On vérifie que le ticket et l'utilisateur associé existent avant de tenter de les afficher.
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
                                ) : null // Si le ticket ou son user est manquant, on n'affiche rien.
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default AdminDashboardPage;