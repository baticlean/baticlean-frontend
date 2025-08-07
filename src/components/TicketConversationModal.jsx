import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Paper, Typography, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { addMessageToTicket, markTicketAsRead } from '../redux/ticketSlice';

function TicketConversationModal({ ticketId, open, onClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { adminTickets, userTickets } = useSelector((state) => state.tickets);
  const ticket = user.role.includes('admin') ? adminTickets.find(t => t._id === ticketId) : userTickets.find(t => t._id === ticketId);
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && ticket) {
      if (user.role.includes('admin') && !ticket.isReadByAdmin) {
        dispatch(markTicketAsRead(ticketId));
      } else if (user.role === 'user' && !ticket.isReadByUser) {
        dispatch(markTicketAsRead(ticketId));
      }
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, ticket, user, dispatch, ticketId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch(addMessageToTicket({ ticketId, text: input }));
      setInput('');
    }
  };

  if (!ticket) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{ticket.subject}</DialogTitle>
      <DialogContent dividers sx={{ height: '60vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
          {ticket.messages.map((msg) => (
            <Box key={msg._id} sx={{ display: 'flex', justifyContent: msg.sender?._id === user._id ? 'flex-end' : 'flex-start', mb: 1 }}>
                <Paper sx={{ p: 1.5, maxWidth: '70%', bgcolor: msg.sender?._id === user._id ? 'primary.main' : 'white', color: msg.sender?._id === user._id ? 'white' : 'black' }}>
                    <Typography variant="caption" display="block" sx={{ fontWeight: 'bold' }}>
                        {msg.sender?.username || 'Assistant IA'}
                    </Typography>
                    <Typography variant="body1">{msg.text}</Typography>
                </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', mt: 1 }}>
          <TextField fullWidth variant="outlined" placeholder="Votre message..." value={input} onChange={(e) => setInput(e.target.value)} />
          <IconButton type="submit" color="primary"><SendIcon /></IconButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TicketConversationModal;