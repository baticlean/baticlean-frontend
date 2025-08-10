import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import { motion, AnimatePresence } from 'framer-motion';

// On définit nos icônes dans un tableau pour pouvoir les manipuler
const initialIcons = [
   { id: 'whatsapp', href: import.meta.env.VITE_WHATSAPP_URL, icon: <WhatsAppIcon /> },
  { id: 'facebook', href: import.meta.env.VITE_FACEBOOK_URL, icon: <FacebookIcon /> },
  { id: 'email', href: import.meta.env.VITE_EMAIL_ADDRESS, icon: <EmailIcon /> },
];

function Footer() {
  const [icons, setIcons] = useState(initialIcons);
  const [isHovered, setIsHovered] = useState(false);
  const [animationState, setAnimationState] = useState('spinning');

  useEffect(() => {
    // Si l'utilisateur survole le footer, on arrête tout
    if (isHovered) {
      return;
    }

    let timer;

    // Le cycle d'animation
    if (animationState === 'spinning') {
      timer = setTimeout(() => setAnimationState('swapping'), 5000); // Après 5s de spin, on passe au swap
    } else if (animationState === 'swapping') {
      // On échange les positions (ex: le 1er va à la place du 3ème)
      setIcons([icons[2], icons[0], icons[1]]);
      timer = setTimeout(() => setAnimationState('returning'), 3000); // On garde la position 3s
    } else if (animationState === 'returning') {
      setIcons(initialIcons); // On revient à la position initiale
      timer = setTimeout(() => setAnimationState('paused'), 3000); // On attend 3s
    } else if (animationState === 'paused') {
      timer = setTimeout(() => setAnimationState('spinning'), 3000); // On attend 3s et on recommence
    }

    return () => clearTimeout(timer); // Nettoyage du timer
  }, [animationState, isHovered]);


  return (
    <Box
      component="footer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        py: 3,
        px: 2,
        color: 'white',
        background: 'linear-gradient(45deg, #8A2387 30%, #E94057 90%)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
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
          <Box sx={{ display: 'flex' }}>
            <AnimatePresence>
              {icons.map((item) => (
                <motion.div
                  key={item.id}
                  layout // C'est la magie qui anime le changement de position
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotate: animationState === 'spinning' && !isHovered ? 360 : 0 
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{
                    // Transition pour le spin
                    rotate: { duration: 5, repeat: isHovered ? 0 : 1 },
                    // Transition pour le reste
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <IconButton color="inherit" href={item.href} target="_blank">
                    {item.icon}
                  </IconButton>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;