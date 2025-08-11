// src/pages/AdminUsersPage.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser, notifyUserRestored } from '../redux/adminSlice.js';
import {
    Container, Typography, Box, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, CircularProgress, Alert, TextField,
    Stack, IconButton, Tooltip, useTheme, useMediaQuery // ✅ Ajouts pour le responsive
} from '@mui/material';
// ✅ On importe toutes les icônes dont nous avons besoin
import { 
    Info, ArrowUpward, ArrowDownward, PauseCircleOutline, 
    CheckCircleOutline, Gavel, Email 
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { onNewUserRegistered, offNewUserRegistered } from '../socket/socket.js';
import UserDetailsModal from '../components/UserDetailsModal.jsx';

function AdminUsersPage() {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // ✅ Hook pour détecter si on est sur un écran mobile
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // ... (toute la logique des useEffect et des handlers reste inchangée)
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
        <>
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
                                        {/* ✅ Les boutons utilisent maintenant des icônes sur mobile */}
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                            <Tooltip title="Infos"><IconButton size="small" color="info" onClick={() => handleOpenModal(user)}><Info /></IconButton></Tooltip>
                                            
                                            {user.role === 'user' ? (
                                                <Tooltip title="Promouvoir"><IconButton size="small" color="primary" onClick={() => handleUpdate(user._id, { role: 'admin' })}><ArrowUpward /></IconButton></Tooltip>
                                            ) : (
                                                <Tooltip title="Rétrograder"><IconButton size="small" color="secondary" onClick={() => handleUpdate(user._id, { role: 'user' })}><ArrowDownward /></IconButton></Tooltip>
                                            )}
                                            {user.status === 'active' ? (
                                                <Tooltip title="Suspendre"><IconButton size="small" color="warning" onClick={() => handleUpdate(user._id, { status: 'suspended' })}><PauseCircleOutline /></IconButton></Tooltip>
                                            ) : (
                                                <Tooltip title="Activer"><IconButton size="small" color="success" onClick={() => handleUpdate(user._id, { status: 'active' })}><CheckCircleOutline /></IconButton></Tooltip>
                                            )}
                                            <Tooltip title="Bannir"><IconButton size="small" color="error" onClick={() => handleUpdate(user._id, { status: 'banned' })}><Gavel /></IconButton></Tooltip>
                                            <Tooltip title="Notifier"><IconButton size="small" color="info" onClick={() => handleNotify(user._id)}><Email /></IconButton></Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>

            <UserDetailsModal
                open={modalOpen}
                onClose={handleCloseModal}
                user={selectedUser}
            />
        </>
    );
}

export default AdminUsersPage;