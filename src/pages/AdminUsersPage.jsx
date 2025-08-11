// src/pages/AdminUsersPage.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser, notifyUserRestored } from '../redux/adminSlice.js';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, ButtonGroup, CircularProgress, Alert, TextField
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

  // ✅ SÉCURITÉ : On s'assure que "users" est bien un tableau et on filtre les entrées invalides.
  const validUsers = Array.isArray(users) ? users.filter(Boolean) : [];

  if (loading && validUsers.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          Gestion des Utilisateurs
        </Typography>
        <TextField
          label="Rechercher (nom, email, tel...)"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      {/* ✅ BONUS : On rend le tableau scrollable horizontalement sur les petits écrans */}
      <TableContainer component={Paper} sx={{ overflowX: { xs: 'auto', md: 'visible' } }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nom d'utilisateur</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* ✅ On utilise notre liste sécurisée "validUsers" */}
            {validUsers.map((user) => (
              <TableRow key={user._id}>
                {/* ✅ SÉCURITÉ : On ajoute des valeurs par défaut pour chaque cellule */}
                <TableCell>{user.username ?? 'Nom manquant'}</TableCell>
                <TableCell>{user.email ?? 'Email manquant'}</TableCell>
                <TableCell>{user.phoneNumber ?? 'N/A'}</TableCell>
                <TableCell>{user.role ?? 'Inconnu'}</TableCell>
                <TableCell>{user.status ?? 'Inconnu'}</TableCell>
                <TableCell align="right">
                  <ButtonGroup variant="contained" size="small">
                    {user.role === 'user' ? (
                      <Button color="primary" onClick={() => handleUpdate(user._id, { role: 'admin' })}>Promouvoir</Button>
                    ) : (
                      <Button color="secondary" onClick={() => handleUpdate(user._id, { role: 'user' })}>Rétrograder</Button>
                    )}
                    {user.status === 'active' ? (
                        <Button color="warning" onClick={() => handleUpdate(user._id, { status: 'suspended' })}>Suspendre</Button>
                    ) : (
                        <Button color="success" onClick={() => handleUpdate(user._id, { status: 'active' })}>Activer</Button>
                    )}
                    <Button color="error" onClick={() => handleUpdate(user._id, { status: 'banned' })}>Bannir</Button>
                    <Button color="info" onClick={() => handleNotify(user._id)}>Notifier</Button>
                  </ButtonGroup>
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