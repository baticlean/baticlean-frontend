import React from 'react';
import { Container, Typography, Box, Paper, List, ListItem, ListItemText, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        &larr; Retour
      </Button>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          🔐 POLITIQUE DE CONFIDENTIALITÉ – BATIClean 🧼
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>1. 📦 Données collectées</Typography>
          <Typography paragraph>
            On collecte uniquement les infos nécessaires pour te servir :
          </Typography>
          <List>
            <ListItem><ListItemText primary="Nom & prénom" /></ListItem>
            <ListItem><ListItemText primary="E-mail 📧" /></ListItem>
            <ListItem><ListItemText primary="Numéro de téléphone 📱" /></ListItem>
            <ListItem><ListItemText primary="Adresse (pour les prestations sur place) 🏡" /></ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>2. 🛡️ Sécurité des données</Typography>
          <Typography paragraph>
            Tes données sont stockées de manière sécurisée 🔒. On ne les vend jamais à des tiers. Jamais. Promis. ✋
          </Typography>
        </Box>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>3. 🍪 Cookies</Typography>
          <Typography paragraph>
            Oui, on utilise des cookies (mais pas ceux qui se mangent 😄) pour :
          </Typography>
          <List>
            <ListItem><ListItemText primary="Te connecter automatiquement" /></ListItem>
            <ListItem><ListItemText primary="Améliorer ton expérience utilisateur" /></ListItem>
          </List>
          <Typography paragraph>Tu peux les désactiver dans ton navigateur.</Typography>
        </Box>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>4. 👁️‍🗨️ Accès à tes données</Typography>
          <Typography paragraph>
            Tu peux demander à consulter, modifier ou supprimer tes infos à tout moment via ton profil ou en nous écrivant.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>5. 👨‍⚖️ Partage légal</Typography>
          <Typography paragraph>
            On ne partage tes infos que si la loi l’exige (par exemple, en cas de réquisition judiciaire).
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>6. 🔄 Mise à jour</Typography>
          <Typography paragraph>
            La présente politique peut être modifiée à tout moment. Tu seras informé via une notification ou un message sur le site.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default PrivacyPolicyPage;