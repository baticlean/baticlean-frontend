import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserTickets } from '../redux/ticketSlice';
import { Container, Typography, Box, Paper, CircularProgress, Alert, List, ListItemButton, ListItemText, ListItemAvatar, Avatar, Badge } from '@mui/material';
import TicketConversationModal from '../components/TicketConversationModal.jsx';

function UserTicketsPage() {
  const dispatch = useDispatch();
  const { userTickets: tickets, loading, error } = useSelector((state) => state.tickets);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    dispatch(fetchUserTickets());
  }, [dispatch]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Mes Conversations</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Veuillez actualiser la page pour voir les mises à jour.
        </Typography>
        <Paper>
          <List>
            {tickets && tickets.length > 0 ? tickets.map(ticket => (
              <ListItemButton 
                key={ticket._id} 
                onClick={() => setSelectedTicket(ticket)}
                sx={{ 
                    border: !ticket.isReadByUser ? '2px solid #1976d2' : '1px solid #ddd', 
                    m: 1, 
                    borderRadius: 2
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <Badge color="error" variant="dot" invisible={ticket.isReadByUser}>
                        💬
                    </Badge>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={ticket.subject} 
                  secondary={`Statut: ${ticket.status} - Dernière mise à jour: ${new Date(ticket.updatedAt).toLocaleDateString()}`} 
                />
              </ListItemButton>
            )) : (
                <Typography sx={{ p: 2 }}>Vous n'avez aucune conversation pour le moment.</Typography>
            )}
          </List>
        </Paper>
      </Container>
      {selectedTicket && (
        <TicketConversationModal 
          ticketId={selectedTicket._id} 
          open={!!selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
        />
      )}
    </>
  );
}

export default UserTicketsPage;