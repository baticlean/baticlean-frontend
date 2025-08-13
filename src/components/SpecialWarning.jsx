// src/components/SpecialWarning.jsx

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button, Paper } from '@mui/material';
import { keyframes } from '@emotion/react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ContactSupportModal from './ContactSupportModal.jsx';
import { dismissWarning } from '../redux/warningSlice.js';
import { toast } from 'react-toastify'; // Déjà importé, c'est parfait

const pulseAnimation = keyframes`
  0% { transform: scale(1.0); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1.0); }
`;

function SpecialWarning() {
    const dispatch = useDispatch();
    const { items: warnings } = useSelector((state) => state.warnings);

    const [contactModalOpen, setContactModalOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const currentWarning = warnings?.[0];

    const handleDismiss = () => {
        if (!currentWarning) return;
        dispatch(dismissWarning(currentWarning._id))
            .unwrap()
            .catch(() => {
                toast.error("Erreur, impossible de fermer l'avertissement.");
            });
    };

    // ✅ MODIFICATION ICI : On ajoute la logique pour la vérification de profil
    const handleActionClick = (actionType) => {
        if (actionType === 'contact_support') {
            setContactModalOpen(true);
        } else if (actionType === 'review_profile') { // Assurez-vous que ce type correspond à votre action
            // 1. Affiche le toast de succès
            toast.success("Profil vérifié avec succès. Faites plus attention !");
            // 2. Ferme l'avertissement
            handleDismiss();
        }
    };

    if (!currentWarning) {
        return null;
    }

    const TRUNCATE_LENGTH = 120;
    const isLongMessage = currentWarning.message.length > TRUNCATE_LENGTH;

    const displayText = isLongMessage && !isExpanded
        ? `${currentWarning.message.substring(0, TRUNCATE_LENGTH)}...`
        : currentWarning.message;

    return (
        <>
            <Paper
                elevation={8}
                sx={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: { xs: '95%', sm: 'auto' },
                    maxWidth: '600px',
                    bgcolor: 'error.main',
                    color: 'white',
                    p: 2.5,
                    borderRadius: 2,
                    zIndex: 1250,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textAlign: 'left', mb: 2 }}>
                    <WarningAmberIcon sx={{
                        fontSize: '2rem',
                        animation: `${pulseAnimation} 2s infinite ease-in-out`
                    }} />
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {displayText}
                    </Typography>
                </Box>

                <Box>
                    {isLongMessage && (
                        <Button
                            size="small"
                            onClick={() => setIsExpanded(!isExpanded)}
                            sx={{ color: 'white', textDecoration: 'underline', mb: 1, p: 0.5, display: 'inline-block' }}
                        >
                            {isExpanded ? 'Voir moins' : 'Voir plus'}
                        </Button>
                    )}
                </Box>
                <Box>
                    <Typography variant="caption" sx={{ fontStyle: 'italic', opacity: 0.8, fontSize: '1rem' }}>
                        Cette notification restera visible jusqu'à ce que vous cliquez sur "Fermer" ou que vous contactiez le support. Vous pouvez également envoyez une vérification de profil.
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                    {currentWarning.actions?.map(action => (
                        <Button
                            key={action.type}
                            variant="contained"
                            sx={{ bgcolor: 'rgba(0,0,0,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.4)' } }}
                            onClick={() => handleActionClick(action.type)}
                        >
                            {action.label}
                        </Button>
                    ))}
                    <Button variant="outlined" color="inherit" onClick={handleDismiss}>
                        Fermer
                    </Button>
                </Box>
            </Paper>

            <ContactSupportModal
                open={contactModalOpen}
                onClose={() => setContactModalOpen(false)}
                onIconClick={handleDismiss}
            />
        </>
    );
}

export default SpecialWarning;