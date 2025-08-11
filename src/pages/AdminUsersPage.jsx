import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser, notifyUserRestored } from '../redux/adminSlice.js';
import {
    Container, Typography, Box, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, CircularProgress, Alert, TextField,
    Stack // RESPONSIVE: On importe Stack
} from '@mui/material';
import { toast } from 'react-toastify';
import { onNewUserRegistered, offNewUserRegistered } from '../socket/socket.js';

function AdminUsersPage() {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(fetchUsers(searchTerm));
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, dispatch]);

    useEffect(() => {
        const handleNewUser = () => {
            dispatch(fetchUsers(searchTerm));
        };
        onNewUserRegistered(handleNewUser);
        return () => {
            offNewUserRegistered(handleNewUser);
        };
    }, [dispatch, searchTerm]);

    const handleUpdate = (userId, data) => {
        toast.promise(dispatch(updateUser({ userId, data })).unwrap(), {
            pending: 'Mise à jour...',
            success: 'Utilisateur mis à jour !',
            error: 'Erreur lors de la mise à jour.'
        });
    };
    
    const handleNotify = (userId) => {
        toast.promise(dispatch(notifyUserRestored(userId)).unwrap(), {
            pending: 'Envoi de la notification...',
            success: 'Notification envoyée !',
            error: 'Erreur lors de l\'envoi.'
        });
    };

    const validUsers = Array.isArray(users) ? users.filter(Boolean) : [];

    if (loading && validUsers.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

    return (
        // RESPONSIVE: Marges et padding ajustés
        <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 4, px: { xs: 2, sm: 3 } }}>
            {/* RESPONSIVE: On utilise Stack pour l'en-tête */}
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'stretch', md: 'center' }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Typography variant={{ xs: 'h5', sm: 'h4' }}>
                    Gestion des Utilisateurs
                </Typography>
                <TextField
                    label="Rechercher (nom, email, tel...)"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Stack>

            {/* RESPONSIVE: On retire le défilement horizontal pour masquer des colonnes à la place */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nom d'utilisateur</TableCell>
                            {/* RESPONSIVE: Colonnes masquées sur mobile */}
                            <TableCell sx={{ fontWeight: 'bold', display: { xs: 'none', md: 'table-cell' } }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', display: { xs: 'none', md: 'table-cell' } }}>Téléphone</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', display: { xs: 'none', lg: 'table-cell' } }}>Rôle</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {validUsers.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.username ?? 'Nom manquant'}</TableCell>
                                {/* RESPONSIVE: Cellules correspondantes masquées */}
                                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{user.email ?? 'Email manquant'}</TableCell>
                                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{user.phoneNumber ?? 'N/A'}</TableCell>
                                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{user.role ?? 'Inconnu'}</TableCell>
                                <TableCell>{user.status ?? 'Inconnu'}</TableCell>
                                <TableCell align="right">
                                    {/* RESPONSIVE: On remplace ButtonGroup par un Box flexible */}
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                        {user.role === 'user' ? (
                                            <Button variant="contained" size="small" color="primary" onClick={() => handleUpdate(user._id, { role: 'admin' })}>Promouvoir</Button>
                                        ) : (
                                            <Button variant="contained" size="small" color="secondary" onClick={() => handleUpdate(user._id, { role: 'user' })}>Rétrograder</Button>
                                        )}
                                        {user.status === 'active' ? (
                                            <Button variant="contained" size="small" color="warning" onClick={() => handleUpdate(user._id, { status: 'suspended' })}>Suspendre</Button>
                                        ) : (
                                            <Button variant="contained" size="small" color="success" onClick={() => handleUpdate(user._id, { status: 'active' })}>Activer</Button>
                                        )}
                                        <Button variant="contained" size="small" color="error" onClick={() => handleUpdate(user._id, { status: 'banned' })}>Bannir</Button>
                                        <Button variant="contained" size="small" color="info" onClick={() => handleNotify(user._id)}>Notifier</Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default AdminUsersPage;