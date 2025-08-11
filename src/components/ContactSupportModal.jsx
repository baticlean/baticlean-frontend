// src/components/ContactSupportModal.jsx

import React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { WhatsApp, Facebook, Email, Telegram, Close } from '@mui/icons-material';

// On récupère les URLs depuis les variables d'environnement
const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL;
const facebookUrl = import.meta.env.VITE_FACEBOOK_URL;
const emailAddress = import.meta.env.VITE_EMAIL_ADDRESS;
const telegramUrl = import.meta.env.VITE_TELEGRAM_URL;

function ContactSupportModal({ open, onClose }) {
  const contactOptions = [
    { name: 'WhatsApp', icon: <WhatsApp />, url: whatsappUrl },
    { name: 'Facebook', icon: <Facebook />, url: facebookUrl },
    { name: 'Telegram', icon: <Telegram />, url: telegramUrl },
    { name: 'Email', icon: <Email />, url: emailAddress },
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Contacter le support
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <List>
          {contactOptions.map((option) => (
            <ListItemButton key={option.name} component="a" href={option.url} target="_blank" rel="noopener noreferrer">
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText primary={option.name} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default ContactSupportModal;