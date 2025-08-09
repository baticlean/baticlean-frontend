
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReclamations, hideReclamation, unhideReclamation } from '../redux/reclamationSlice.js';
import { Container, Typography, Box, Paper, CircularProgress, Alert, IconButton, Button, Stack, FormControlLabel, Switch } from '@mui/material';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import ReclamationDetailsModal from '../components/ReclamationDetailsModal.jsx';
function AdminReclamationsPage() {
    const dispatch = useDispatch();
    // ✅ On récupère les réclamations actives ET archivées
    const { items: reclamations, archivedItems, loading, error } = useSelector((state) => state.reclamations);
    const [selectedReclamation, setSelectedReclamation] = useState(null);
    const [showArchived, setShowArchived] = useState(false); // ✅ État pour afficher les archives
    // ✅ On charge les bonnes réclamations quand le composant se monte ou que l'on bascule la vue
    useEffect(() => {
        dispatch(fetchAllReclamations(showArchived));
    }, [dispatch, showArchived]);
    // ✅ Gère l'archivage et la restauration
    const handleToggleArchive = (reclamationId) => {
        if (showArchived) {
            toast.promise(
                dispatch(unhideReclamation(reclamationId)).unwrap(),
                {
                    pending: 'Restauration en cours...',
                    success: 'Réclamation restaurée !',
                    error: 'Erreur lors de la restauration.'
                }
            );
        } else {
            toast.promise(
                dispatch(hideReclamation(reclamationId)).unwrap(),
                {
                    pending: 'Archivage en cours...',
                    success: 'Réclamation archivée !',
                    error: 'Erreur lors de l\'archivage.'
                }
            );
        }
    };
    
    // ✅ On choisit la bonne liste à afficher
    const reclamationsToDisplay = showArchived ? archivedItems : reclamations;
    if (loading && reclamationsToDisplay.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" gutterBottom>
                        {showArchived ? 'Réclamations Archivées' : 'Gestion des Réclamations'}
                    </Typography>
                    <FormControlLabel
                        control={<Switch checked={showArchived} onChange={() => setShowArchived(!showArchived)} />}
                        label="Voir les archives"
                    />
                </Stack>
                {reclamationsToDisplay.length === 0 ? (
                    <Typography>{showArchived ? 'Aucune réclamation archivée.' : 'Aucune réclamation pour le moment.'}</Typography>
                ) : (
                    reclamationsToDisplay.map((reclamation) => (
                        <Paper key={reclamation._id} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="h6">Réclamation de {reclamation.user?.username || 'Utilisateur inconnu'}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Statut: {reclamation.status} - Reçue le: {format(new Date(reclamation.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                                </Typography>
                            </Box>
                            <Box>
                                <Button variant="contained" size="small" sx={{ mr: 1 }} onClick={() => setSelectedReclamation(reclamation)}>Consulter</Button>
                                <IconButton color={showArchived ? "default" : "error"} onClick={() => handleToggleArchive(reclamation._id)}>
                                    {showArchived ? <RestoreFromTrashIcon /> : <DeleteIcon />}
                                </IconButton>
                            </Box>
                        </Paper>
                    ))
                )}
            </Container>
            <ReclamationDetailsModal reclamation={selectedReclamation} open={!!selectedReclamation} onClose={() => setSelectedReclamation(null)} />
        </>
    );
}
export default AdminReclamationsPage;
