// src/pages/AdminUsersPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser } from '../redux/adminSlice';
import {
  Container, Typography, Box, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Button, ButtonGroup
} from '@mui/material';
import { toast } from 'react-toastify';

function AdminUsersPage() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  const handleUpdate = (userId, data) => {
    toast.promise(
        dispatch(updateUser({ userId, data })).unwrap(),
        {
          pending: 'Mise à jour...',
          success: 'Utilisateur mis à jour !',
          error: 'Erreur lors de la mise à jour.'
        }
    );
  };

  if (loading && users.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Utilisateurs
      </Typography>
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