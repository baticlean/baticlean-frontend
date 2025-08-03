// src/pages/AdminTicketsPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTickets } from '../redux/ticketSlice.js';
import {
  Container, Typography, Box, Paper, List, ListItem, ListItemText,
  Chip, CircularProgress, Alert
} from '@mui/material';

function AdminTicketsPage() {
  const dispatch = useDispatch();
  const { items: tickets, loading, error } = useSelector((state) => state.tickets);

  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ouvert': return 'success';
      case 'En cours': return 'warning';
      case 'Fermé': return 'default';
      default: return 'default';
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Tickets de Support
      </Typography>
      {tickets.length === 0 ? (
        <Typography>Aucun ticket pour le moment.</Typography>
      ) : (
        <Paper>
          <List>
            {tickets.map(ticket => (
              <ListItem key={ticket._id} divider button>
                <ListItemText
                  primary={`Ticket de ${ticket.user.username} (${ticket.user.email})`}
                  secondary={`Sujet: ${ticket.subject} - Ouvert le: ${new Date(ticket.createdAt).toLocaleDateString()}`}
                />
                <Chip label={ticket.status} color={getStatusColor(ticket.status)} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
}

export default AdminTicketsPage;