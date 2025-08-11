// src/components/UserDetailsModal.jsx

import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, Typography, List,
    ListItem, ListItemText, IconButton, DialogActions, Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function UserDetailsModal({ open, onClose, user }) {
    if (!user) {
        return null;
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Détails de l'utilisateur
                <IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <List>
                    <ListItem>
                        <ListItemText primary="Nom d'utilisateur" secondary={user.username || 'Non fourni'} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Email" secondary={user.email || 'Non fourni'} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Numéro de téléphone" secondary={user.phoneNumber || 'Non fourni'} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Rôle" secondary={user.role || 'Non fourni'} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Statut" secondary={user.status || 'Non fourni'} />
                    </ListItem>
                     <ListItem>
                        <ListItemText primary="Inscrit le" secondary={new Date(user.createdAt).toLocaleDateString('fr-FR')} />
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fermer</Button>
            </DialogActions>
        </Dialog>
    );
}

export default UserDetailsModal;