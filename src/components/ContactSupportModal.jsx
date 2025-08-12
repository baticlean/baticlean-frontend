// src/components/ContactSupportModal.jsx

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    IconButton
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';

// La prop "onIconClick" est conservée pour la logique de fermeture
function ContactSupportModal({ open, onClose, onIconClick }) {

    // Cette fonction sera appelée quand on clique sur une icône
    const handleIconClick = (url) => {
        // Ouvre le lien dans un nouvel onglet
        window.open(url, '_blank');
        // Exécute la fonction pour fermer l'avertissement si elle existe
        if (onIconClick) {
            onIconClick();
        }
        // Ferme cette modale
        onClose();
    };

    return (
        // On utilise Dialog au lieu de Modal
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 2 } }}>
            <DialogTitle>
                Contacter le support
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Choisissez votre méthode de contact préférée.
                </Typography>
                <Box sx={{ mt: 3, mb: 1, display: 'flex', justifyContent: 'space-around' }}>
                    <IconButton
                        color="success"
                        // On appelle notre fonction au clic
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
                        onClick={() => handleIconClick(`mailto:${import.meta.env.VITE_EMAIL_ADDRESS}`)}
                    >
                        <EmailIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default ContactSupportModal;