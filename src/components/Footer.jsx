// baticlean-frontend/src/components/Footer.jsx

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import { motion, AnimatePresence } from 'framer-motion';

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
    if (isHovered) return;

    let timer;
    if (animationState === 'spinning') {
      timer = setTimeout(() => setAnimationState('swapping'), 5000);
    } else if (animationState === 'swapping') {
      setIcons([icons[2], icons[0], icons[1]]);
      timer = setTimeout(() => setAnimationState('returning'), 3000);
    } else if (animationState === 'returning') {
      setIcons(initialIcons);
      timer = setTimeout(() => setAnimationState('paused'), 3000);
    } else if (animationState === 'paused') {
      timer = setTimeout(() => setAnimationState('spinning'), 3000);
    }
    return () => clearTimeout(timer);
  }, [animationState, isHovered, icons]);

  return (
    <Box
      component="footer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        py: { xs: 2, sm: 3 }, // Moins de padding sur mobile
        px: 2,
        color: 'white',
        background: 'linear-gradient(45deg, #8A2387 30%, #E94057 90%)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, // Stack vertical sur mobile
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
          <Box sx={{ display: 'flex' }}>
            <AnimatePresence>
              {icons.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotate: animationState === 'spinning' && !isHovered ? 360 : 0 
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{
                    rotate: { duration: 5, repeat: isHovered ? 0 : 1 },
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <IconButton color="inherit" href={item.href} target="_blank" size="small">
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