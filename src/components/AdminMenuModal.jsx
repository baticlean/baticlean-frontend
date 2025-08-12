// src/components/AdminMenuModal.jsx (Version Ultra-Robuste)

import React from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Badge, IconButton } from '@mui/material';
import { PeopleAlt, DesignServices, Message, BookOnline, Report, Dashboard, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
};

function AdminMenuModal({ open, onClose, counts, handleNavClick }) {
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Tableau de Bord', icon: <Dashboard />, path: '/admin/dashboard', type: 'dashboard' },
        { text: 'Utilisateurs', icon: <PeopleAlt />, path: '/admin/users', type: 'users' },
        { text: 'Services', icon: <DesignServices />, path: '/admin/services', type: 'services' },
        { text: 'Tickets', icon: <Message />, path: '/admin/tickets', type: 'tickets' },
        { text: 'Réservations', icon: <BookOnline />, path: '/admin/bookings', type: 'bookings' },
        { text: 'Réclamations', icon: <Report />, path: '/admin/reclamations', type: 'reclamations' },
    ];

    const onMenuItemClick = (path, type) => {
        if (type !== 'services' && type !== 'dashboard') {
            handleNavClick(type);
        }
        navigate(path);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" sx={{ mb: 2 }}>Menu Administrateur</Typography>
                <List>
                    {menuItems.map((item) => {
                        // ✅ LA CORRECTION CLÉ EST ICI : On utilise `counts?.` (optional chaining)
                        // Si `counts` est null, l'expression renvoie 0 sans planter.
                        const count = counts?.[item.type] ?? 0;

                        return (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton onClick={() => onMenuItemClick(item.path, item.type)}>
                                    <ListItemIcon>
                                        <Badge badgeContent={count} color="error">
                                            {item.icon}
                                        </Badge>
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </Modal>
    );
}

export default AdminMenuModal;