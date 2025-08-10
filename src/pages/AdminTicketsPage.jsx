// src/pages/AdminTicketsPage.jsx (Mis à jour)

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllTickets, claimTicket, markTicketAsRead, archiveTicket } from '../redux/ticketSlice.js';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Switch, FormControlLabel, Stack } from '@mui/material';
import { toast } from 'react-toastify';
import TicketConversationModal from '../components/TicketConversationModal.jsx';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import HandymanIcon from '@mui/icons-material/Handyman'; // Pour "Prendre la main"
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'; // Pour "Prendre en charge"
import VisibilityIcon from '@mui/icons-material/Visibility'; // Pour "Consulter"
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'; // Pour "Marquer comme lu"


const UnreadIcon = () => <>⛔</>;

function AdminTicketsPage() {
    const dispatch = useDispatch();
    const { user: currentUser } = useSelector((state) => state.auth);
    const { adminTickets, archivedAdminTickets, loading, error } = useSelector((state) => state.tickets);

    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showArchived, setShowArchived] = useState(false);

    useEffect(() => {
        dispatch(fetchAllTickets(showArchived));
    }, [dispatch, showArchived]);

    // ✅ MODIFICATION ICI : Gérer les différents messages de succès/erreur
    const handleClaim = (ticketId) => {
        dispatch(claimTicket(ticketId))
            .unwrap()
            .then((result) => {
                // `result` est la valeur retournée par le thunk : { ticket, overrideMessage }
                if (result.overrideMessage) {
                    // Message d'information pour le super admin qui prend la main
                    toast.info(result.overrideMessage);
                } else {
                    // Message de succès standard
                    toast.success('Vous avez pris le ticket en charge !');
                }
            })
            .catch((errorMessage) => {
                // Affiche le message d'erreur du backend ("Déjà pris en charge par...")
                toast.error(errorMessage);
            });
    };
    
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
                
                // ✅ MODIFICATION ICI : Logique des boutons plus claire
                const isAssignedToOther = ticket.assignedAdmin && ticket.assignedAdmin._id !== currentUser._id;
                const canTakeOver = isAssignedToOther && currentUser.role === 'superAdmin' && !showArchived;
                const canClaim = !ticket.assignedAdmin && !showArchived;
                
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

                            {/* Bouton "Prendre en charge" */}
                            {canClaim && (
                                <Button variant="contained" color="primary" startIcon={<QuestionAnswerIcon />} onClick={() => handleClaim(ticket._id)}>
                                    Prendre en charge
                                </Button>
                            )}

                             {/* Bouton "Prendre la main" pour Super Admin */}
                            {canTakeOver && (
                                <Button variant="contained" color="warning" startIcon={<HandymanIcon />} onClick={() => handleClaim(ticket._id)}>
                                    Prendre la main
                                </Button>
                            )}

                            {/* Bouton "Consulter" / "Voir" */}
                            <Button 
                                variant="contained" 
                                color={isUnreadForCurrentAdmin ? "primary" : "secondary"}
                                onClick={() => handleOpenModal(ticket)}
                                startIcon={<VisibilityIcon />}
                            >
                                {isUnreadForCurrentAdmin ? "Voir la réponse" : "Consulter"}
                            </Button>
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