// baticlean-frontend/src/components/Footer.jsx

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import { motion, AnimatePresence } from 'framer-motion';

const initialIcons = [
   { id: 'whatsapp', href: import.meta.env.VITE_WHATSAPP_URL || '#', icon: <WhatsAppIcon /> },
   { id: 'facebook', href: import.meta.env.VITE_FACEBOOK_URL || '#', icon: <FacebookIcon /> },
   { id: 'email', href: `mailto:${import.meta.env.VITE_EMAIL_ADDRESS || ''}`, icon: <EmailIcon /> },
];

function Footer() {
  // ✅ Restauration de toute la logique d'état pour l'animation complexe
  const [icons, setIcons] = useState(initialIcons);
  const [isHovered, setIsHovered] = useState(false);
  const [animationState, setAnimationState] = useState('spinning');

  useEffect(() => {
    if (isHovered) return; // On met en pause si l'utilisateur survole

    let timer;
    // Cycle d'animation : Rotation -> Échange -> Retour -> Pause
    if (animationState === 'spinning') {
      timer = setTimeout(() => setAnimationState('swapping'), 5000);
    } else if (animationState === 'swapping') {
      // On échange les positions (le dernier devient premier, etc.)
      setIcons((prevIcons) => [prevIcons[2], prevIcons[0], prevIcons[1]]);
      timer = setTimeout(() => setAnimationState('returning'), 3000);
    } else if (animationState === 'returning') {
      // Retour à l'ordre initial
      setIcons(initialIcons);
      timer = setTimeout(() => setAnimationState('paused'), 3000);
    } else if (animationState === 'paused') {
      timer = setTimeout(() => setAnimationState('spinning'), 3000);
    }
    return () => clearTimeout(timer);
  }, [animationState, isHovered]);

  return (
    <Box
      component="footer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        py: { xs: 2, sm: 3 },
        px: 2,
        color: 'white',
        // ✅ Le dégradé original conservé
        background: 'linear-gradient(45deg, #8A2387 30%, #E94057 90%)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: 2 
        }}>
          <Typography variant="body2" sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            BATIClean © {new Date().getFullYear()}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link component={RouterLink} to="/terms" color="inherit" sx={{ fontSize: '0.8rem' }}>
              Conditions
            </Link>
            <Link component={RouterLink} to="/privacy" color="inherit" sx={{ fontSize: '0.8rem' }}>
              Confidentialité
            </Link>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* ✅ AnimatePresence est crucial pour l'animation de swap */}
            <AnimatePresence mode='popLayout'>
              {icons.map((item) => (
                <motion.div
                  key={item.id}
                  layout // ✅ Permet à Framer Motion d'animer le changement de position
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    // Rotation seulement pendant la phase 'spinning' si non survolé
                    rotate: animationState === 'spinning' && !isHovered ? 360 : 0 
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    rotate: { duration: 5, repeat: isHovered ? 0 : Infinity, ease: "linear" },
                    layout: { type: 'spring', stiffness: 300, damping: 30 }, // Animation fluide du déplacement
                  }}
                >
                  <IconButton color="inherit" href={item.href} target="_blank" size="small" sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
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