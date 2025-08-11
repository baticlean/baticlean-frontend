// src/components/LoginTransition.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import './LoginTransition.css'; // Nous allons créer ce fichier pour les styles

function LoginTransition() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    // Ce hook se déclenche une seule fois au chargement du composant
    useEffect(() => {
        // On définit un minuteur pour rediriger après 5 secondes (5000 millisecondes)
        const timer = setTimeout(() => {
            navigate('/home', { replace: true }); // Redirige vers la page d'accueil
        }, 3000);

        // On nettoie le minuteur si le composant est "démonté" avant la fin
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Box className="transition-container">
            <motion.div
                className="expanding-circle"
                initial={{ scale: 0 }}
                animate={{ scale: 200 }} // Agrandit le cercle pour couvrir l'écran
                transition={{ duration: 1.5, ease: "easeIn" }}
            />
            <Box className="text-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                >
                    <Typography variant="h2" className="welcome-text">
                        Heureux de te revoir chez BATIClean 😁😀🎆🎊🎉!
                    </Typography>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.5 }}
                >
                    <Typography variant="h4" className="username-text">
                        {user ? user.username : ''}
                    </Typography>
                </motion.div>
            </Box>
        </Box>
    );
}

export default LoginTransition;