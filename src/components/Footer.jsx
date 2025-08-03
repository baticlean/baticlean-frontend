// src/components/Footer.jsx
import React from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        color: 'white',
        background: 'linear-gradient(45deg, #8A2387 30%, #E94057 90%)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body1">
            BATIClean © {new Date().getFullYear()}
          </Typography>
          <Box>
            <Link component={RouterLink} to="/terms" color="inherit" sx={{ mr: 2 }}>
              Conditions d'utilisation
            </Link>
            <Link component={RouterLink} to="/privacy" color="inherit">
              Politique de confidentialité
            </Link>
          </Box>
          <Box>
            <IconButton color="inherit" href="https://wa.me/+2250716896099" target="_blank">
              <WhatsAppIcon />
            </IconButton>
            <IconButton color="inherit" href="https://www.facebook.com/profile.php?id=61578191506365" target="_blank">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit" href="mailto:baticlean225@gmail.com">
              <EmailIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;