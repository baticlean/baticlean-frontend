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
                background: 'linear-gradient(to top, #f3e5f5, #e1bee7)',
                p: 2
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    borderRadius: '16px',
                    textAlign: 'center',
                    maxWidth: '500px',
                    border: '1px solid',
                    borderColor: 'primary.main',
                    boxShadow: '0px 10px 30px rgba(138, 43, 226, 0.2)',
                    overflow: 'hidden' // Pour que les animations ne dépassent pas
                }}
            >
                {/* ✅ 1. ANIMATION DU CADENAS */}
                <motion.div
                    animate={{ rotateY: [0, 360] }} // Fait tourner l'icône sur elle-même
                    transition={{
                        duration: 2.5,
                        repeat: Infinity, // Répète l'animation à l'infini
                        ease: "easeInOut"
                    }}
                    style={{ marginBottom: '16px' }}
                >
                    {/* On alterne entre les deux icônes pour l'effet d'ouverture/fermeture */}
                    <motion.div
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    >
                        <LockIcon color="primary" sx={{ fontSize: 60 }} />
                    </motion.div>
                    <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        style={{ marginTop: '-60px' }} // Superpose les icônes
                    >
                        <LockOpenIcon color="primary" sx={{ fontSize: 60 }} />
                    </motion.div>
                </motion.div>

                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Accès Bloqué Temporairement
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Vous avez effectué trop de tentatives de connexion. Pour des raisons de sécurité, votre accès est bloqué pour les 15 prochaines minutes.
                </Typography>

                {/* ✅ 2. ANIMATION DU BOUTON */}
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }} // Effet de "respiration"
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => navigate('/home')}
                        sx={{
                            background: 'linear-gradient(45deg, #8A2387 30%, #E94057 90%)',
                            color: 'white',
                            fontWeight: 'bold',
                            width: '100%' // Pour que l'animation soit bien centrée
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