import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png'; // Assurez-vous que le chemin est correct
import './LoginTransition.css';

function LoginTransition() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const isNewUser = location.state?.isNewUser || false;

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/home', { replace: true });
        }, 4000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Box className="transition-container">
            <motion.div
                className="expanding-circle"
                initial={{ scale: 0 }}
                animate={{ scale: 200 }}
                transition={{ duration: 1.5, ease: "easeIn" }}
            />
            <Box className="text-container">
                {/* 1. NOUVEAU: Conteneur pour le logo et la main */}
                <motion.div
                    className="logo-container"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
                >
                    <img
                        src={logo}
                        alt="BATIClean Logo"
                        className="transition-logo"
                    />
                    <span className="waving-hand" role="img" aria-label="waving hand">🙋‍♂️</span>
                </motion.div>

                {/* 2. Message de bienvenue conditionnel */}
                {isNewUser ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1.2 }}
                    >
                        <Typography variant="h1" className="welcome-text-new">
                            Bienvenue ! 🚀
                        </Typography>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1.2 }}
                    >
                        <Typography variant="h1" className="welcome-text-existing">
                            Heureux de te revoir
                        </Typography>
                    </motion.div>
                )}

                {/* 3. Nom de l'utilisateur (commun aux deux) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.8 }}
                >
                    <Typography variant="h2" className="username-text">
                        {user ? user.username : ''}
                    </Typography>
                </motion.div>
                
                {/* 4. Message d'aventure (uniquement pour les nouveaux) */}
                 {isNewUser && (
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 2.4 }}
                    >
                        <Typography variant="h6" className="adventure-text">
                            L'aventure BATIClean commence maintenant ! ✨
                        </Typography>
                    </motion.div>
                 )}
            </Box>
        </Box>
    );
}

export default LoginTransition;
