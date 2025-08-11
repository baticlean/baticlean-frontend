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

// L'icône peut être personnalisée ici
const UnreadIcon = () => (
    <Box 
        component="span" 
        sx={{ 
            width: 10, 
            height: 10, 
            borderRadius: '50%', 
            bgcolor: 'primary.main', 
            ml: 1, 
            flexShrink: 0 
        }} 
    />
);


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
        {/* RESPONSIVE: Marges et padding ajustés */}
        <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: 4, px: { xs: 2, sm: 3 } }}>
            {/* RESPONSIVE: En-tête de page flexible */}
            <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                justifyContent="space-between" 
                alignItems={{ xs: 'flex-start', sm: 'center' }} 
                mb={3}
            >
                <Typography variant={{ xs: 'h5', sm: 'h4' }} gutterBottom>
                    {showArchived ? 'Conversations Archivées' : 'Mes Conversations'}
                    {!showArchived && unreadCount > 0 && (
                        <Badge badgeContent={unreadCount} color="error" sx={{ ml: 2 }} />
                    )}
                </Typography>
                <FormControlLabel
                    control={<Switch checked={showArchived} onChange={() => setShowArchived(!showArchived)} />}
                    label="Voir les archives"
                    sx={{ ml: { xs: 0, sm: 1 } }}
                />
            </Stack>
            
            <Paper>
                <List>
                {ticketsToDisplay && ticketsToDisplay.length > 0 ? ticketsToDisplay.map(ticket => {
                    const isUnread = !ticket.isReadByUser;
                    return (
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
                            borderLeft: isUnread && !showArchived ? `4px solid` : 'none', 
                            borderLeftColor: 'primary.main',
                            mb: 1
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
                                // RESPONSIVE: Le texte secondaire est maintenant un composant Stack pour s'afficher sur deux lignes
                                secondary={
                                    <Stack component="span" sx={{ mt: 0.5 }}>
                                        <Typography component="span" variant="body2" color="text.secondary">
                                            {`Statut: ${ticket.status}`}
                                        </Typography>
                                        <Typography component="span" variant="caption" color="text.secondary">
                                            {`Dernière MàJ: ${new Date(ticket.updatedAt).toLocaleString('fr-FR')}`}
                                        </Typography>
                                    </Stack>
                                }
                                // RESPONSIVE: Empêche le titre de déborder s'il est trop long
                                primaryTypographyProps={{ noWrap: true, textOverflow: 'ellipsis' }}
                            />
                            {isUnread && !showArchived && <UnreadIcon />}
                        </ListItemButton>
                    </ListItem>
                    )}) : (
                    <Typography sx={{ p: 2, textAlign: 'center' }}>
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