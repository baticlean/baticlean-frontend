import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import './LoginTransition.css';

function LoginTransition() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/home', { replace: true });
        }, 3000);
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                >
                    {/* RESPONSIVE: La taille du texte s'adapte maintenant à l'écran */}
                    <Typography variant={{ xs: 'h5', sm: 'h3' }} className="welcome-text">
                        Heureux de te revoir chez BATIClean 😁😀🎆🎊🎉!
                    </Typography>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.5 }}
                >
                    {/* RESPONSIVE: La taille du nom d'utilisateur s'adapte aussi */}
                    <Typography variant={{ xs: 'h6', sm: 'h4' }} className="username-text">
                        {user ? user.username : ''}
                    </Typography>
                </motion.div>
            </Box>
        </Box>
    );
}

export default LoginTransition;