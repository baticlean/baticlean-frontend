// src/pages/AdminTicketsPage.jsx

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllTickets, claimTicket, markTicketAsRead, archiveTicket } from '../redux/ticketSlice.js';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Switch, FormControlLabel, Stack } from '@mui/material';
import { toast } from 'react-toastify';
import TicketConversationModal from '../components/TicketConversationModal.jsx';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

const UnreadIcon = () => <>⛔</>;

function AdminTicketsPage() {
    const dispatch = useDispatch();
    const { user: currentUser } = useSelector((state) => state.auth);
    // ✅ On récupère les tickets actifs ET archivés
    const { adminTickets, archivedAdminTickets, loading, error } = useSelector((state) => state.tickets);

    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showArchived, setShowArchived] = useState(false); // ✅ État pour afficher les archives

    // ✅ On charge les bons tickets quand le composant se monte ou que l'on bascule la vue
    useEffect(() => {
        dispatch(fetchAllTickets(showArchived));
    }, [dispatch, showArchived]);

    const handleClaim = (ticketId) => {
        toast.promise(dispatch(claimTicket(ticketId)).unwrap(), {
            pending: 'Prise en charge du ticket...',
            success: 'Vous avez pris le ticket en charge !',
            error: 'Ce ticket est déjà pris en charge.'
        });
    };
    
    // ✅ Nouvelle fonction pour archiver/désarchiver
    const handleArchiveToggle = (ticketId, isArchived) => {
        const action = isArchived ? 'Désarchivage' : 'Archivage';
        toast.promise(
            dispatch(archiveTicket({ ticketId, archive: !isArchived })).unwrap(),
            {
                pending: `${action} en cours...`,
                success: `Ticket ${isArchived ? 'désarchivé' : 'archivé'} !`,
                error: `Erreur lors de l'${action.toLowerCase()}`
            }
        );
    };

    const handleOpenModal = (ticket) => {
        setSelectedTicketId(ticket._id);
        setIsModalOpen(true);
        const isUnreadForCurrentAdmin = !ticket.readByAdmins.includes(currentUser?._id);
        if (isUnreadForCurrentAdmin) {
            dispatch(markTicketAsRead(ticket._id));
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTicketId(null);
    };
    
    // ✅ On choisit la bonne liste de tickets à afficher
    const ticketsToDisplay = showArchived ? archivedAdminTickets : adminTickets;

    if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
    if (error) return <Alert severity="error">Erreur: {error}</Alert>;

    return (
        <Box sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                 <Typography variant="h4" gutterBottom>
                    {showArchived ? 'Tickets Archivés' : 'Gestion des Tickets'}
                 </Typography>
                 <FormControlLabel
                    control={<Switch checked={showArchived} onChange={() => setShowArchived(!showArchived)} />}
                    label="Voir les archives"
                />
            </Stack>

            {ticketsToDisplay.map((ticket) => {
                const isUnreadForCurrentAdmin = !ticket.readByAdmins.includes(currentUser?._id);
                
                return (
                    <Paper 
                        key={ticket._id} 
                        elevation={2} 
                        sx={{ 
                            p: 2, 
                            mb: 2, 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            border: isUnreadForCurrentAdmin && !showArchived ? '2px solid #007BFF' : '1px solid #ddd',
                            boxShadow: isUnreadForCurrentAdmin && !showArchived ? '0 0 10px rgba(0, 123, 255, 0.5)' : 'none'
                        }}
                    >
                        <Box>
                            <Typography variant="h6">Ticket de {ticket.user?.username || 'Utilisateur inconnu'}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Sujet: {ticket.messages[0]?.text.substring(0, 50)}... - Statut: {ticket.status}
                            </Typography>
                            {ticket.assignedAdmin && (
                                <Typography component="div" variant="body2" sx={{ mt: 1, color: ticket.assignedAdmin._id === currentUser._id ? 'success.main' : 'primary.main', fontWeight: 'bold' }}>
                                    Pris en charge par: {ticket.assignedAdmin._id === currentUser._id ? 'vous' : ticket.assignedAdmin.username}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            {isUnreadForCurrentAdmin && !showArchived && <UnreadIcon />}
                            
                            {/* Bouton Archiver/Désarchiver */}
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleArchiveToggle(ticket._id, showArchived)}
                                startIcon={showArchived ? <UnarchiveIcon /> : <ArchiveIcon />}
                            >
                                {showArchived ? 'Sortir' : 'Archiver'}
                            </Button>

                            {!ticket.assignedAdmin && !showArchived ? (
                                <Button variant="contained" color="primary" onClick={() => handleClaim(ticket._id)}>Répondre</Button>
                            ) : (
                                <Button 
                                    variant="contained" 
                                    color={isUnreadForCurrentAdmin ? "primary" : "secondary"}
                                    onClick={() => handleOpenModal(ticket)}
                                >
                                    {isUnreadForCurrentAdmin ? "Voir la réponse" : "Continuer"}
                                </Button>
                            )}
                        </Box>
                    </Paper>
                )
            })}

            {isModalOpen && (
                <TicketConversationModal
                    ticketId={selectedTicketId}
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    isAdmin={true}
                />
            )}
        </Box>
    );
}

export default AdminTicketsPage;