import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTickets, hideTicket, claimTicket } from '../redux/ticketSlice.js';
import { Container, Typography, Box, Paper, CircularProgress, Alert, IconButton, Button, Badge, Chip } from '@mui/material';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import TicketConversationModal from '../components/TicketConversationModal.jsx';

function AdminTicketsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { adminTickets: tickets, loading, error } = useSelector((state) => state.tickets);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [dispatch]);

  const handleReplyClick = (ticket) => {
    if (!ticket.assignedAdmin) {
        dispatch(claimTicket(ticket._id)).unwrap()
            .then((updatedTicket) => {
                setSelectedTicket(updatedTicket);
            })
            .catch((err) => toast.error(err || 'Ce ticket a déjà été pris en charge.'));
    } else {
        setSelectedTicket(ticket);
    }
  };

  const handleHide = (ticketId) => {
      toast.promise(dispatch(hideTicket(ticketId)).unwrap(), {
          pending: 'Masquage...',
          success: 'Ticket masqué !',
          error: 'Erreur lors du masquage.'
      });
  };

  if (loading && (!tickets || tickets.length === 0)) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Gestion des Tickets de Support</Typography>
        {tickets && tickets.map((ticket) => {
            const isAssigned = !!ticket.assignedAdmin;
            const isAssignedToMe = isAssigned && ticket.assignedAdmin._id === user._id;
            // Un superAdmin peut toujours interagir, même si le ticket est assigné à quelqu'un d'autre
            const canInteract = !isAssigned || isAssignedToMe || user.role === 'superAdmin';
            
            return (
              <Paper key={ticket._id} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6">
                    <Badge color="error" variant="dot" invisible={ticket.isReadByAdmin} sx={{ mr: 1.5 }} />
                    Ticket de {ticket.user?.username || 'Utilisateur inconnu'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sujet: {ticket.subject} - {ticket.status} le: {format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </Typography>
                  {isAssigned && (
                    <Chip 
                        label={`Pris en charge par ${isAssignedToMe ? 'vous' : ticket.assignedAdmin.username}`} 
                        size="small" 
                        color={isAssignedToMe ? "success" : "default"} 
                        sx={{ mt: 1 }} 
                    />
                  )}
                </Box>
                <Box>
                    <Button 
                        variant="contained" 
                        size="small" 
                        sx={{ mr: 1 }} 
                        onClick={() => handleReplyClick(ticket)}
                        disabled={!canInteract}
                    >
                        {isAssigned ? 'Continuer' : 'Répondre'}
                    </Button>
                    <IconButton color="error" onClick={() => handleHide(ticket._id)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
              </Paper>
            );
        })}
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

export default AdminTicketsPage;