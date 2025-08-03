import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function TermsPage() {
  return (
    <Container sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" gutterBottom>Conditions d'Utilisation</Typography>
        <Typography>
          Contenu des conditions d'utilisation à venir...
        </Typography>
      </Box>
    </Container>
  );
}

export default TermsPage;