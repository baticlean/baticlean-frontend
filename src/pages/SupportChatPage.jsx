// src/pages/SupportChatPage.jsx (Corrigé)

import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Paper, Typography, List, ListItem, Button, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useSelector, useDispatch } from 'react-redux';
import { createTicket } from '../redux/ticketSlice.js';
import { toast } from 'react-toastify';
import TicketCreatedNotice from '../components/TicketCreatedNotice.jsx';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function SupportChatPage() {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Bonjour ! Je suis l\'assistant virtuel de BATIClean. Comment puis-je vous aider ?' }
    ]);
    const [input, setInput] = useState('');
    const [ticketCreated, setTicketCreated] = useState(false);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const isInitialMount = useRef(true);
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            scrollToBottom();
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (input.trim() && !isBotTyping) {
            const userMessage = { sender: 'user', text: input };

            // ✅ --- DÉBUT DE LA CORRECTION ---
            // 1. On prépare l'historique pour l'API AVANT de mettre à jour l'affichage.
            //    On retire le tout premier message de bienvenue du bot.
            const historyForApi = messages.slice(1);
            
            // 2. On met à jour l'affichage local immédiatement pour une meilleure UX.
            setMessages(prev => [...prev.map(msg => ({ ...msg, showCreateTicket: false })), userMessage]);
            setInput('');
            setIsBotTyping(true);
            // ✅ --- FIN DE LA CORRECTION ---

            try {
                const response = await axios.post(
                    `${API_URL}/api/chatbot/ask`,
                    {
                        message: input,
                        // 3. On envoie l'historique correct (sans le nouveau message)
                        history: historyForApi
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                
                const botResponse = { sender: 'bot', text: response.data.reply };
                
                if (response.data.reply.toLowerCase().includes('ticket')) {
                    botResponse.showCreateTicket = true;
                }

                setMessages(prev => [...prev, botResponse]);

            } catch (error) {
                toast.error("Désolé, l'assistant est actuellement indisponible.");
                const errorResponse = { sender: 'bot', text: "Oups, je rencontre un problème technique. Veuillez réessayer plus tard." };
                setMessages(prev => [...prev, errorResponse]);
            } finally {
                setIsBotTyping(false);
            }
        }
    };
    
    const handleCreateTicket = () => {
        const cleanedMessages = messages.map(msg => ({ ...msg, showCreateTicket: false }));
        
        toast.promise(
            dispatch(createTicket({ messages: cleanedMessages })).unwrap(),
            {
                pending: 'Création du ticket...',
                success: 'Ticket créé avec succès ! Notre équipe vous répondra bientôt.',
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
        <Box sx={{ display: 'flex', flexDirection: 'column', height: { xs: 'calc(100vh - 140px)', sm: 'calc(100vh - 120px)' }, p: { xs: 1.5, sm: 2 } }}>
            <Typography variant={{ xs: 'h5', sm: 'h4' }} gutterBottom>Service Client</Typography>
            <Paper elevation={3} sx={{ flexGrow: 1, overflow: 'auto', p: 2, mb: 2, display: 'flex', flexDirection: 'column' }}>
                <List sx={{ flexGrow: 1 }}>
                    {messages.map((msg, index) => (
                        <ListItem key={index} sx={{ flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                            <Box sx={{ bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.300', color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary', p: 1.5, borderRadius: '16px', maxWidth: '80%', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                <Typography variant="body1">{msg.text}</Typography>
                            </Box>
                            {msg.showCreateTicket && !ticketCreated && (
                                <Button variant="contained" size="small" onClick={handleCreateTicket} sx={{ mt: 1, alignSelf: 'flex-start' }}>
                                    Créer un ticket
                                </Button>
                            )}
                        </ListItem>
                    ))}
                    {isBotTyping && (
                        <ListItem sx={{ alignItems: 'flex-start' }}>
                            <CircularProgress size={20} />
                        </ListItem>
                    )}
                    <div ref={messagesEndRef} />
                </List>
            </Paper>
            <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', gap: 1 }}>
                <TextField fullWidth variant="outlined" placeholder="Posez votre question ici..." value={input} onChange={(e) => setInput(e.target.value)} autoFocus disabled={isBotTyping} />
                <IconButton type="submit" color="primary" aria-label="send" disabled={isBotTyping}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
}

export default SupportChatPage;
