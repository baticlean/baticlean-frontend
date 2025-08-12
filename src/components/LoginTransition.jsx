// src/components/LoginTransition.jsx

import React, { useEffect } from 'react';
// ✅ On retire useLocation qui n'est plus nécessaire ici
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';
import './LoginTransition.css';

function LoginTransition() {
    const navigate = useNavigate();
    
    // ✅ On récupère 'user' ET 'isNewUser' directement depuis le state Redux
    const { user, isNewUser } = useSelector((state) => state.auth);

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

                {/* Ce bloc fonctionnera maintenant correctement */}
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

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.8 }}
                >
                    <Typography variant="h2" className="username-text">
                        {user ? user.username : ''}
                    </Typography>
                </motion.div>
                
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