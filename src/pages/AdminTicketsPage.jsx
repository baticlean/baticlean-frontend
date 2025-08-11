import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllTickets, claimTicket, markTicketAsRead, archiveTicket } from '../redux/ticketSlice.js';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Switch, FormControlLabel, Stack, Tooltip } from '@mui/material';
import { toast } from 'react-toastify';
import TicketConversationModal from '../components/TicketConversationModal.jsx';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import HandymanIcon from '@mui/icons-material/Handyman';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock'; // Icône pour un ticket verrouillé

const UnreadIcon = () => (
    <Tooltip title="Non lu">
        <Box component="span" sx={{ color: 'primary.main', fontSize: '1.5rem', lineHeight: 1 }}>
            ●
        </Box>
    </Tooltip>
);

function AdminTicketsPage() {
    const dispatch = useDispatch();
    const { user: currentUser } = useSelector((state) => state.auth);
    const { adminTickets, archivedAdminTickets, loading, error } = useSelector((state) => state.tickets);

    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showArchived, setShowArchived] = useState(false);

    useEffect(() => {
        if (currentUser) { // S'assurer que currentUser est chargé avant de fetch
            dispatch(fetchAllTickets(showArchived));
        }
    }, [dispatch, showArchived, currentUser]);

    const handleClaim = (ticketId) => {
        dispatch(claimTicket(ticketId))
            .unwrap()
            .then((result) => {
                if (result.overrideMessage) {
                    toast.info(result.overrideMessage);
                } else {
                    toast.success('Vous avez pris le ticket en charge !');
                }
            })
            .catch((errorMessage) => {
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

    // ✅ MODIFICATION PRINCIPALE ICI
    const handleOpenModal = (ticket) => {
        const isAssignedToOther = ticket.assignedAdmin && ticket.assignedAdmin._id !== currentUser._id;
        const isSuperAdmin = currentUser.role === 'superAdmin';

        // Si le ticket est assigné à un autre et que l'utilisateur n'est pas superAdmin, on bloque.
        if (isAssignedToOther && !isSuperAdmin) {
            toast.warn(`Ce ticket est déjà pris en charge par ${ticket.assignedAdmin.username}.`);
            return; // On arrête l'exécution ici.
        }

        // Si la vérification passe, on continue comme avant.
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
                
                // Logique pour déterminer l'état et les permissions du ticket
                const isAssignedToMe = ticket.assignedAdmin && ticket.assignedAdmin._id === currentUser._id;
                const isAssignedToOther = ticket.assignedAdmin && !isAssignedToMe;
                const isUnassigned = !ticket.assignedAdmin;

                const canTakeOver = isAssignedToOther && currentUser.role === 'superAdmin' && !showArchived;
                const canClaim = isUnassigned && !showArchived;
                
                // ✅ Le ticket est "verrouillé" pour un admin standard s'il est pris par un autre
                const isLockedForCurrentUser = isAssignedToOther && currentUser.role !== 'superAdmin';

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
                            opacity: isLockedForCurrentUser ? 0.6 : 1, // Opacité réduite si verrouillé
                            borderLeft: isAssignedToMe ? '4px solid #4caf50' : (isAssignedToOther ? '4px solid #ff9800' : '4px solid transparent'),
                            transition: 'opacity 0.3s, border-left 0.3s',
                        }}
                    >
                        <Box>
                            <Typography variant="h6">Ticket de {ticket.user?.username || 'Utilisateur inconnu'}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Sujet: {ticket.messages[0]?.text.substring(0, 50)}... - Statut: {ticket.status}
                            </Typography>
                            {ticket.assignedAdmin && (
                                <Typography component="div" variant="body2" sx={{ mt: 1, color: isAssignedToMe ? 'success.main' : 'warning.main', fontWeight: 'bold' }}>
                                    Pris en charge par: {isAssignedToMe ? 'vous' : ticket.assignedAdmin.username}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            {isUnreadForCurrentAdmin && !showArchived && <UnreadIcon />}
                            
                            {/* Bouton Archiver/Désarchiver (toujours visible) */}
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleArchiveToggle(ticket._id, showArchived)}
                                startIcon={showArchived ? <UnarchiveIcon /> : <ArchiveIcon />}
                            >
                                {showArchived ? 'Sortir' : 'Archiver'}
                            </Button>

                            {/* Bouton "Prendre en charge" (si non assigné) */}
                            {canClaim && (
                                <Button variant="contained" color="primary" startIcon={<QuestionAnswerIcon />} onClick={() => handleClaim(ticket._id)}>
                                    Prendre en charge
                                </Button>
                            )}

                             {/* Bouton "Prendre la main" pour Super Admin (si déjà assigné à un autre) */}
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
                                startIcon={isLockedForCurrentUser ? <LockIcon /> : <VisibilityIcon />}
                                // Le bouton est désactivé visuellement et fonctionnellement si le ticket est verrouillé
                                disabled={isLockedForCurrentUser && currentUser.role !== 'superAdmin'}
                            >
                                {isAssignedToMe ? "Traiter" : "Consulter"}
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