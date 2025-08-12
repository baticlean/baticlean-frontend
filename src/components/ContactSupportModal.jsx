// src/components/ContactSupportModal.jsx

import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '80%', sm: 350 },
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 3,
    textAlign: 'center'
};

// ✅ On ajoute la prop "onIconClick"
function ContactSupportModal({ open, onClose, onIconClick }) {

    // ✅ Cette fonction sera appelée quand on clique sur une icône
    const handleIconClick = (url) => {
        // Ouvre le lien dans un nouvel onglet
        window.open(url, '_blank');
        // Exécute la fonction pour fermer l'avertissement
        if (onIconClick) {
            onIconClick();
        }
        // Ferme cette modale
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" component="h2" gutterBottom>
                    Contacter le support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Choisissez votre méthode de contact préférée.
                </Typography>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around' }}>
                    <IconButton 
                        color="success" 
                        // ✅ On appelle notre nouvelle fonction au clic
                        onClick={() => handleIconClick(import.meta.env.VITE_WHATSAPP_URL)}
                    >
                        <WhatsAppIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                    <IconButton 
                        color="primary" 
                        onClick={() => handleIconClick(import.meta.env.VITE_FACEBOOK_URL)}
                    >
                        <FacebookIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                    <IconButton 
                        color="secondary" 
                        onClick={() => handleIconClick(import.meta.env.VITE_EMAIL_ADDRESS)}
                    >
                        <EmailIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                </Box>
            </Box>
        </Modal>
    );
}

export default ContactSupportModal;