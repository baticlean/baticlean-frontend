// src/components/CookieConsent.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CookieIcon from '@mui/icons-material/Cookie';

function CookieConsent() {
    // On vérifie si l'utilisateur a déjà accepté les cookies
    const [isVisible, setIsVisible] = useState(!localStorage.getItem('cookieConsent'));

    const handleAccept = () => {
        // On sauvegarde le consentement dans le localStorage du navigateur
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 200, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 50 }}
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1500, // Pour s'assurer qu'elle est au-dessus de tout
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Paper 
                        elevation={8} 
                        sx={{
                            m: 2,
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            maxWidth: '600px',
                            borderRadius: '12px',
                        }}
                    >
                        <CookieIcon color="primary" sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="body2">
                                Nous utilisons des cookies pour améliorer votre expérience sur notre site. En continuant, vous acceptez notre utilisation des cookies.
                            </Typography>
                        </Box>
                        <Button variant="contained" onClick={handleAccept}>
                            Accepter
                        </Button>
                    </Paper>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default CookieConsent;