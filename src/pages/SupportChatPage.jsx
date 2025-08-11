import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Paper, Typography, List, ListItem, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useSelector, useDispatch } from 'react-redux';
import { createTicket } from '../redux/ticketSlice.js';
import { toast } from 'react-toastify';
import TicketCreatedNotice from '../components/TicketCreatedNotice.jsx';

// La logique du bot reste inchangée
const getBotResponse = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes('prix') || msg.includes('tarif')) {
        return { text: "Tous nos tarifs sont disponibles sur la page des services. Pour un devis personnalisé, veuillez nous contacter." };
    }
    if (msg.includes('devis')) {
        return { text: "Pour obtenir un devis, veuillez remplir le formulaire sur notre page 'Demander un devis'. Un de nos agents vous répondra sous 24h." };
    }
    if (msg.includes('problème') || msg.includes('aide')) {
        return { text: "Je suis désolé d'apprendre que vous rencontrez un problème. Si je ne peux pas vous aider, je peux créer un ticket pour notre support humain." };
    }
    if (msg.includes('bonjour') || msg.includes('salut')) {
        return { text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?" };
    }
    return { 
        text: "Je ne suis pas sûr de comprendre. Voulez-vous que je crée un ticket pour qu'un membre de notre équipe vous contacte ?",
        showCreateTicket: true
    };
};

function SupportChatPage() {
    // Toute la logique (useState, useEffect, handlers) reste inchangée
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Bonjour ! Je suis l\'assistant virtuel de BATIClean. Comment puis-je vous aider ?' }
    ]);
    const [input, setInput] = useState('');
    const [ticketCreated, setTicketCreated] = useState(false);
    const messagesEndRef = useRef(null);
    const dispatch = useDispatch();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim()) {
            const userMessage = { sender: 'user', text: input };
            const cleanedMessages = messages.map(msg => ({ ...msg, showCreateTicket: false }));
            setMessages([...cleanedMessages, userMessage]);
            setInput('');

            setTimeout(() => {
                const botResponse = { sender: 'bot', ...getBotResponse(input) };
                setMessages(prev => [...prev, botResponse]);
            }, 1000);
        }
    };

    const handleCreateTicket = () => {
        toast.promise(
            dispatch(createTicket({ messages })).unwrap(),
            {
                pending: 'Création du ticket...',
                success: 'Ticket créé avec succès !',
                error: 'Erreur lors de la création du ticket.'
            }
        ).then(() => {
            setTicketCreated(true);
        });
    };

    if (ticketCreated) {
        return <TicketCreatedNotice />;
    }

    return (
        // RESPONSIVE: Ajustement de la hauteur et du padding
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: { xs: 'calc(100vh - 140px)', sm: 'calc(100vh - 120px)' }, 
            p: { xs: 1.5, sm: 2 } 
        }}>
            {/* RESPONSIVE: Titre de page adaptable */}
            <Typography variant={{ xs: 'h5', sm: 'h4' }} gutterBottom>Service Client</Typography>
            <Paper elevation={3} sx={{ flexGrow: 1, overflow: 'auto', p: 2, mb: 2, display: 'flex', flexDirection: 'column' }}>
                <List sx={{ flexGrow: 1 }}>
                    {messages.map((msg, index) => (
                        <ListItem key={index} sx={{ flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                            <Box sx={{
                                bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.300',
                                color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                                p: 1.5,
                                borderRadius: '16px', // Arrondi plus prononcé
                                maxWidth: '80%', // Légèrement plus large
                                // CORRECTION: Permet au texte de se couper pour éviter le débordement
                                overflowWrap: 'break-word',
                                wordBreak: 'break-word',
                            }}>
                                <Typography variant="body1">{msg.text}</Typography>
                            </Box>
                            {msg.showCreateTicket && !ticketCreated && (
                                <Button variant="contained" size="small" onClick={handleCreateTicket} sx={{ mt: 1, alignSelf: 'flex-start' }}>
                                    Créer un ticket
                                </Button>
                            )}
                        </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                </List>
            </Paper>
            <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Posez votre question ici..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoFocus
                />
                <IconButton type="submit" color="primary" aria-label="send">
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
}

export default SupportChatPage;