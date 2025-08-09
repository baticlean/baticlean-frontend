// src/pages/MaintenanceAdminPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, List, ListItem, ListItemText, Switch, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

function MaintenanceAdminPage() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchMaintenanceStatus = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/maintenance/status`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPages(response.data);
            } catch (err) {
                setError('Impossible de charger les statuts de maintenance.');
            } finally {
                setLoading(false);
            }
        };
        fetchMaintenanceStatus();
    }, [token]);

    const handleToggle = async (pageKey) => {
        const originalPages = [...pages];
        setPages(currentPages =>
            currentPages.map(p =>
                p.pageKey === pageKey ? { ...p, isUnderMaintenance: !p.isUnderMaintenance } : p
            )
        );

        try {
            await axios.patch(`${API_URL}/api/maintenance/toggle/${pageKey}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Statut de maintenance mis à jour !');
        } catch (err) {
            toast.error('Erreur lors de la mise à jour.');
            setPages(originalPages);
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }
    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 4 }}>
                <Typography variant="h4" gutterBottom>Gestion de la Maintenance</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Activez ou désactivez la maintenance pour les différentes fonctionnalités du site. Seul le SuperAdmin peut voir cette page.
                </Typography>
                
                {/* MODIFIÉ : On utilise maintenant un Box pour espacer les éléments */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {pages.map((page) => (
                        // MODIFIÉ : Chaque ListItem est maintenant dans son propre Paper avec un contour
                        <Paper 
                            key={page.pageKey} 
                            variant="outlined" 
                            sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                            <ListItemText 
                                id={`switch-list-label-${page.pageKey}`} 
                                primary={page.pageName} 
                                primaryTypographyProps={{ fontWeight: '500' }}
                            />
                            <Switch
                                edge="end"
                                checked={page.isUnderMaintenance}
                                onChange={() => handleToggle(page.pageKey)}
                                inputProps={{ 'aria-labelledby': `switch-list-label-${page.pageKey}` }}
                            />
                        </Paper>
                    ))}
                </Box>

            </Paper>
        </Container>
    );
}

export default MaintenanceAdminPage;