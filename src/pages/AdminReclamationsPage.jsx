// src/pages/AdminReclamationsPage.jsx

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

    // ✅ On s'assure que la liste est bien un tableau avant de faire quoi que ce soit
    const validReclamations = Array.isArray(reclamationsToDisplay) ? reclamationsToDisplay.filter(Boolean) : [];

    if (loading && validReclamations.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
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

                {validReclamations.length === 0 ? (
                    <Typography>{showArchived ? 'Aucune réclamation archivée.' : 'Aucune réclamation pour le moment.'}</Typography>
                ) : (
                    validReclamations.map((reclamation) => (
                        <Paper 
                            key={reclamation._id} 
                            // ✅ BONUS : Amélioration pour l'affichage sur mobile
                            sx={{ 
                                p: 2, 
                                mb: 2, 
                                display: 'flex', 
                                flexDirection: { xs: 'column', sm: 'row' }, // Empile verticalement sur mobile
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                gap: { xs: 2, sm: 1 } // Ajoute de l'espace sur mobile
                            }}
                        >
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="h6">Réclamation de {reclamation.user?.username || 'Utilisateur inconnu'}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {/* ✅ SÉCURITÉ : On vérifie que la date existe avant de la formater */}
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