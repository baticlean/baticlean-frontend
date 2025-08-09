// src/pages/UserTicketsPage.jsx (Version Corrigée et Améliorée)

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserTickets, markTicketAsRead, archiveTicket } from '../redux/ticketSlice.js';
import { 
    Container, Typography, Box, Paper, CircularProgress, Alert, List, ListItem, 
    ListItemButton, ListItemText, ListItemAvatar, Avatar, Badge, Stack, 
    FormControlLabel, Switch, IconButton 
} from '@mui/material';
import { toast } from 'react-toastify';
import TicketConversationModal from '../components/TicketConversationModal.jsx';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

const UnreadIcon = () => <>⛔</>;

function UserTicketsPage() {
    const dispatch = useDispatch();
    const { userTickets, archivedUserTickets, loading, error } = useSelector((state) => state.tickets);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showArchived, setShowArchived] = useState(false);

    useEffect(() => {
        dispatch(fetchUserTickets(showArchived));
    }, [dispatch, showArchived]);
    
    const handleOpenTicket = (ticket) => {
        setSelectedTicket(ticket);
        if (!ticket.isReadByUser) {
            dispatch(markTicketAsRead(ticket._id));
        }
    };

    // La fonction d'archivage n'a plus besoin de "e.stopPropagation()"
    const handleArchiveToggle = (ticketId, isArchived) => {
        const action = isArchived ? 'Désarchivage' : 'Archivage';
        toast.promise(
            dispatch(archiveTicket({ ticketId, archive: !isArchived })).unwrap(),
            {
                pending: `${action} en cours...`,
                success: `Conversation ${isArchived ? 'sortie des archives' : 'archivée'} !`,
                error: `Erreur lors de l'${action.toLowerCase()}`
            }
        );
    };
    
    const ticketsToDisplay = showArchived ? archivedUserTickets : userTickets;
    const unreadCount = useMemo(() => userTickets.filter(t => !t.isReadByUser).length, [userTickets]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

    return (
    <>
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" gutterBottom>
                    {showArchived ? 'Conversations Archivées' : 'Mes Conversations'}
                    {!showArchived && (
                        <Badge badgeContent={unreadCount} color="error" sx={{ ml: 2 }}>
                            💬
                        </Badge>
                    )}
                </Typography>
                <FormControlLabel
                    control={<Switch checked={showArchived} onChange={() => setShowArchived(!showArchived)} />}
                    label="Voir les archives"
                />
            </Stack>
            
            <Paper>
                <List>
                {ticketsToDisplay && ticketsToDisplay.length > 0 ? ticketsToDisplay.map(ticket => {
                    const isUnread = !ticket.isReadByUser;
                    return (
                    // On utilise ListItem avec la prop secondaryAction
                    <ListItem
                        key={ticket._id}
                        secondaryAction={
                            <IconButton 
                                edge="end" 
                                aria-label="archive" 
                                onClick={() => handleArchiveToggle(ticket._id, showArchived)}
                            >
                                {showArchived ? <UnarchiveIcon /> : <ArchiveIcon />}
                            </IconButton>
                        }
                        disablePadding
                        sx={{ 
                            border: isUnread && !showArchived ? '2px solid #007BFF' : '1px solid #ddd', 
                            m: 1, 
                            borderRadius: 2,
                            boxShadow: isUnread && !showArchived ? '0 0 10px rgba(0, 123, 255, 0.5)' : 'none',
                        }}
                    >
                        <ListItemButton onClick={() => handleOpenTicket(ticket)}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: isUnread && !showArchived ? 'primary.main' : 'grey.500' }}>
                                    💬
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={ticket.subject || "Conversation avec le support"} 
                                secondary={`Statut: ${ticket.status} - Dernière MàJ: ${new Date(ticket.updatedAt).toLocaleString('fr-FR')}`} 
                            />
                            {isUnread && !showArchived && <UnreadIcon />}
                        </ListItemButton>
                    </ListItem>
                    )}) : (
                    <Typography sx={{ p: 2 }}>
                        {showArchived ? "Vous n'avez aucune conversation archivée." : "Vous n'avez aucune conversation pour le moment."}
                    </Typography>
                    )}
                </List>
            </Paper>
        </Container>
        {selectedTicket && (
            <TicketConversationModal 
                ticketId={selectedTicket._id} 
                open={!!selectedTicket} 
                onClose={() => setSelectedTicket(null)}
                isAdmin={false}
            />
        )}
    </>
    );
}

export default UserTicketsPage;