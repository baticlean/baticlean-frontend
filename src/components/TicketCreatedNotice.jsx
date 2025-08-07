import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';

const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

function TicketCreatedNotice() {
  const navigate = useNavigate();

  return (
    <>
      <style>{keyframes}</style>
      <Container component="main" maxWidth="sm">
        <Box 
          sx={{ 
            marginTop: 8, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center', 
            backgroundColor: '#e8f5e9', 
            padding: 4, 
            borderRadius: 3, 
            border: '1px solid #66bb6a',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            animation: 'fadeIn 0.8s ease-out forwards',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            sx={{ color: '#2e7d32', mb: 2, fontWeight: '700' }}
          >
            ✅ Ticket Créé avec Succès !
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, mb: 3, fontWeight: '400' }}>
            Un membre de notre équipe a été notifié. Vous pouvez suivre votre conversation et voir nos réponses en cliquant sur la cloche de notification 🔔 en haut de la page.
          </Typography>
          <Button 
            variant="contained" 
            color="success" 
            onClick={() => navigate('/my-tickets')}
          >
            Voir mes conversations
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default TicketCreatedNotice;