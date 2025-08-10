import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { motion } from 'framer-motion';

function TemporaryLockPage() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
                p: 2
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: { xs: 2, sm: 4 }, // Padding adaptatif
                    borderRadius: '16px',
                    textAlign: 'center',
                    maxWidth: '500px',
                    overflow: 'hidden'
                }}
            >
                <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ marginBottom: '16px' }}
                >
                    <motion.div
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    >
                        <LockIcon color="primary" sx={{ fontSize: { xs: 40, sm: 60 } }} />
                    </motion.div>
                    <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        style={{ marginTop: '-60px' }}
                    >
                        <LockOpenIcon color="primary" sx={{ fontSize: { xs: 40, sm: 60 }, mt: {xs: '-20px', sm: 0} }} />
                    </motion.div>
                </motion.div>

                <Typography 
                  variant="h4" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'primary.main',
                    fontSize: { xs: '1.5rem', sm: '2.125rem' } // Taille de police adaptative
                  }}
                >
                    Accès Bloqué Temporairement
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Vous avez effectué trop de tentatives de connexion. Pour des raisons de sécurité, votre accès est bloqué pour les 15 prochaines minutes.
                </Typography>

                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Button
                        variant="contained"
                        onClick={() => navigate('/home')}
                        sx={{
                            background: 'linear-gradient(45deg, #8A2387 30%, #E94057 90%)',
                            color: 'white',
                            fontWeight: 'bold',
                            width: '100%'
                        }}
                    >
                        Retour à l'accueil
                    </Button>
                </motion.div>
            </Paper>
        </Box>
    );
}

export default TemporaryLockPage;