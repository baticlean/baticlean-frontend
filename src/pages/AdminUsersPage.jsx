import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser, notifyUserRestored } from '../redux/adminSlice.js';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, ButtonGroup, CircularProgress, Alert, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { onNewUserRegistered, offNewUserRegistered } from '../socket/socket.js';

function AdminUsersPage() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');

  // Ce useEffect gère la recherche avec un délai pour ne pas surcharger le serveur
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchUsers(searchTerm));
    }, 500); // On attend 500ms après que l'utilisateur a fini de taper

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch]);

  // Ce useEffect gère la mise à jour en temps réel lors d'une nouvelle inscription
  useEffect(() => {
    const handleNewUser = () => {
      // On recharge la liste en conservant le filtre de recherche actuel
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

  if (loading && users.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
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
      <TableContainer component={Paper}>
        <Table>
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
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
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