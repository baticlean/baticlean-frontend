import React from 'react';
import { Container, Typography, Box, Paper, List, ListItem, ListItemText, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function TermsPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
       <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        &larr; Retour
      </Button>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          ✅ CONDITIONS D’UTILISATION – BATIClean 🧼
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>1. 🔐 Compte Utilisateur</Typography>
          <Typography paragraph>Pour réserver un service ou demander un devis, tu dois créer un compte.</Typography>
          <Typography paragraph>Garde tes identifiants 🔒 secrets – ta sécurité, c’est notre priorité !</Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>2. 🧾 Services proposés</Typography>
          <Typography paragraph>BATIClean offre des services de nettoyage professionnel.</Typography>
          <Typography paragraph>Toute réservation implique ton accord avec le tarif et les modalités affichés.</Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>3. 🕒 Annulation & modification</Typography>
          <Typography paragraph>Tu peux modifier ou annuler une réservation 24h à l’avance.</Typography>
          <Typography paragraph>Passé ce délai, des frais peuvent s’appliquer.</Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>4. 🚫 Comportement interdit</Typography>
          <Typography paragraph>Tu t’engages à ne pas :</Typography>
          <List>
            <ListItem><ListItemText primary="Poster de fausses informations ❌" /></ListItem>
            <ListItem><ListItemText primary="Usurper l’identité d’autrui 🎭" /></ListItem>
            <ListItem><ListItemText primary="Tenter de pirater le site 🛑" /></ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>5. 👮 Sanctions</Typography>
          <Typography paragraph>En cas d’abus, nous pouvons suspendre ou bannir ton compte (temporairement ou définitivement).</Typography>
          <Typography paragraph>En cas de litige, l’équipe de BATIClean reste disponible pour trouver une solution équitable 🤝</Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>6. 📲 Plateforme évolutive</Typography>
          <Typography paragraph>BATIClean peut ajouter ou modifier des fonctionnalités sans préavis pour améliorer l’expérience utilisateur 🚀</Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>7. 💬 Contact</Typography>
          <Typography paragraph>Une question ? Un souci ? 👉 Clique sur le bouton Service Client ou écris-nous à : contact@baticlean.com</Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default TermsPage;