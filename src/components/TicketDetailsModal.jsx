import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Paper } from '@mui/material';

function TicketDetailsModal({ ticket, open, onClose }) {
  if (!ticket) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Conversation du Ticket</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom><strong>Client:</strong> {ticket.user?.username}</Typography>
        <Typography gutterBottom><strong>Sujet:</strong> {ticket.subject}</Typography>
        <Box mt={2}>
            {ticket.messages.map((msg, index) => (
                <Paper 
                    key={index} 
                    sx={{ 
                        p: 1.5, 
                        mb: 1, 
                        maxWidth: '80%', 
                        ml: msg.sender === 'bot' ? 0 : 'auto', 
                        mr: msg.sender === 'user' ? 0 : 'auto',
                        bgcolor: msg.sender === 'bot' ? '#f0f0f0' : 'primary.main',
                        color: msg.sender === 'bot' ? 'black' : 'white',
                    }}
                    elevation={2}
                >
                    <Typography variant="body2">{msg.text}</Typography>
                </Paper>
            ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TicketDetailsModal;