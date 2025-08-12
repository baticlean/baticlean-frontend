import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import ContactSupportModal from './ContactSupportModal.jsx';
import { clearWarning } from '../redux/authSlice.js'; // On importe l'action

function SpecialWarning() {
    const dispatch = useDispatch();
    
    // ✅ On récupère le tableau complet des avertissements depuis Redux
    const warnings = useSelector((state) => state.auth.user?.warnings || []);
    
    // On affiche toujours l'avertissement le plus récent (le premier du tableau)
    const latestWarning = warnings.length > 0 ? warnings[0] : null;
    
    const [modalOpen, setModalOpen] = useState(false);

    // Si pas de message, on n'affiche rien
    if (!latestWarning) {
        return null;
    }

    // ✅ Cette fonction supprime l'avertissement actuellement affiché
    const handleDismissWarning = () => {
        dispatch(clearWarning(latestWarning._id));
    };

    const handleSolveProblemClick = () => {
        setModalOpen(true);
        // On considère que cliquer sur "régler" résout le problème, donc on supprime aussi l'avertissement
        handleDismissWarning(); 
    };

    return (
        <>
            <Paper 
                elevation={12} 
                sx={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: { xs: '95%', sm: 'auto' },
                    maxWidth: '600px',
                    bgcolor: 'error.dark',
                    color: 'white',
                    p: 2,
                    borderRadius: 2,
                    zIndex: 9999,
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="div">
                        Message Important
                    </Typography>
                    {/* ✅ On affiche le compteur s'il y a plus d'un avertissement */}
                    {warnings.length > 1 && (
                        <Chip label={`${warnings.indexOf(latestWarning) + 1} sur ${warnings.length}`} color="default" size="small" />
                    )}
                </Box>

                <Typography variant="body1" sx={{ my: 2, textAlign: 'center' }}>
                    {latestWarning.message}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Button variant="contained" color="inherit" onClick={handleSolveProblemClick}>
                        Régler le problème
                    </Button>
                    <Button variant="outlined" color="inherit" onClick={handleDismissWarning}>
                        Fermer
                    </Button>
                </Box>
                
                {/* ✅ Le petit texte informatif */}
                <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.7, textAlign: 'center' }}>
                    Cette notification restera visible jusqu'à ce qu'une action soit prise.
                </Typography>
            </Paper>

            {/* La modale de contact s'ouvre indépendamment */}
            <ContactSupportModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
}

export default SpecialWarning;
