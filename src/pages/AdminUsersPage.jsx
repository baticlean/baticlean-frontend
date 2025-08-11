// src/pages/AdminUsersPage.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser, notifyUserRestored } from '../redux/adminSlice.js';
import {
    Container, Typography, Box, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, CircularProgress, Alert, TextField,
    Stack, IconButton // On importe IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info'; // On importe l'icône pour le bouton
import { toast } from 'react-toastify';
import { onNewUserRegistered, offNewUserRegistered } from '../socket/socket.js';
import UserDetailsModal from '../components/UserDetailsModal.jsx'; // ✅ On importe notre nouvelle modale

function AdminUsersPage() {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');
    
    // ✅ On ajoute les états pour gérer la modale
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

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

    // ✅ Fonctions pour ouvrir/fermer la modale
    const handleOpenModal = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedUser(null);
    };

    const validUsers = Array.isArray(users) ? users.filter(Boolean) : [];

    if (loading && validUsers.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

    return (
        <> {/* On encapsule dans un fragment pour la modale */}
            <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 4, px: { xs: 2, sm: 3 } }}>
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

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Nom d'utilisateur</TableCell>
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
                                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{user.email ?? 'Email manquant'}</TableCell>
                                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{user.phoneNumber ?? 'N/A'}</TableCell>
                                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{user.role ?? 'Inconnu'}</TableCell>
                                    <TableCell>{user.status ?? 'Inconnu'}</TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                            {/* ✅ Le nouveau bouton "Infos" */}
                                            <Button 
                                                variant="outlined" 
                                                size="small" 
                                                color="info" 
                                                onClick={() => handleOpenModal(user)}
                                                sx={{ display: { xs: 'inline-flex', md: 'none' } }} // N'apparaît que sur mobile
                                            >
                                                Infos
                                            </Button>

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

            {/* ✅ On affiche la modale si un utilisateur est sélectionné */}
            <UserDetailsModal
                open={modalOpen}
                onClose={handleCloseModal}
                user={selectedUser}
            />
        </>
    );
}

export default AdminUsersPage;