import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function PrivacyPolicyPage() {
  return (
    <Container sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" gutterBottom>Politique de Confidentialité</Typography>
        <Typography>
          Contenu de la politique de confidentialité à venir...
        </Typography>
      </Box>
    </Container>
  );
}

export default PrivacyPolicyPage;