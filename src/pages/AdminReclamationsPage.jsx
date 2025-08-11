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
    const { items: reclamations, archivedItems, loading, error } = useSelector((state) => state.reclamations);
    const [selectedReclamation, setSelectedReclamation] = useState(null);
    const [showArchived, setShowArchived] = useState(false);

    useEffect(() => {
        dispatch(fetchAllReclamations(showArchived));
    }, [dispatch, showArchived]);

    const handleToggleArchive = (reclamationId) => {
        const action = showArchived ? unhideReclamation : hideReclamation;
        const messages = showArchived 
            ? { pending: 'Restauration...', success: 'Réclamation restaurée !', error: 'Erreur.' }
            : { pending: 'Archivage...', success: 'Réclamation archivée !', error: 'Erreur.' };

        toast.promise(dispatch(action(reclamationId)).unwrap(), messages);
    };
    
    const reclamationsToDisplay = showArchived ? archivedItems : reclamations;
    const validReclamations = Array.isArray(reclamationsToDisplay) ? reclamationsToDisplay.filter(Boolean) : [];

    if (loading && validReclamations.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

    return (
        <>
            {/* RESPONSIVE: Ajustement des marges et du padding */}
            <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 4, px: { xs: 2, sm: 3 } }}>
                {/* RESPONSIVE: La direction et l'alignement du Stack s'adaptent */}
                <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    justifyContent="space-between" 
                    alignItems={{ xs: 'flex-start', sm: 'center' }} 
                    mb={3}
                >
                    {/* RESPONSIVE: La taille de la police du titre est réduite sur xs */}
                    <Typography variant={{ xs: 'h5', sm: 'h4' }} gutterBottom>
                        {showArchived ? 'Réclamations Archivées' : 'Gestion des Réclamations'}
                    </Typography>
                    <FormControlLabel
                        control={<Switch checked={showArchived} onChange={() => setShowArchived(!showArchived)} />}
                        label="Voir les archives"
                        sx={{ ml: { xs: 0, sm: 1 } }} // RESPONSIVE: Marge ajustée
                    />
                </Stack>

                {validReclamations.length === 0 ? (
                    <Typography>{showArchived ? 'Aucune réclamation archivée.' : 'Aucune réclamation pour le moment.'}</Typography>
                ) : (
                    validReclamations.map((reclamation) => (
                        <Paper 
                            key={reclamation._id} 
                            // Le code ci-dessous était déjà excellent pour le responsive, on le conserve !
                            sx={{ 
                                p: 2, 
                                mb: 2, 
                                display: 'flex', 
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                gap: { xs: 2, sm: 1 }
                            }}
                        >
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="h6">Réclamation de {reclamation.user?.username || 'Utilisateur inconnu'}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Statut: {reclamation.status || 'Inconnu'} - Reçue le: {reclamation.createdAt ? format(new Date(reclamation.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr }) : 'Date inconnue'}
                                </Typography>
                            </Box>
                            <Box sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}>
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