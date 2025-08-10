// src/pages/ResetPasswordPage.jsx

import React, { useState } from 'react';
import { 
    Box, Typography, TextField, Button, Paper, IconButton, 
    InputAdornment, Alert, AlertTitle, List, ListItem, ListItemIcon, ListItemText 
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Password as PasswordIcon, Visibility, VisibilityOff, ArrowBack as ArrowBackIcon, ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';

const API_URL = import.meta.env.VITE_API_URL;

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // NOUVEAU : Un état pour gérer l'affichage de l'erreur sur la page
    const [errorState, setErrorState] = useState(false);

    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas.");
            return;
        }
        
        const toastId = toast.loading("Réinitialisation en cours...");
        try {
            const response = await axios.post(`${API_URL}/api/reset-password/${token}`, { password });
            toast.update(toastId, {
                render: response.data.message,
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            });
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            toast.dismiss(toastId); // On ferme le toast de chargement
            
            // NOUVEAU : On active l'état d'erreur pour changer l'affichage
            setErrorState(true); 
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', p: 2 }}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: '16px', textAlign: 'center', maxWidth: '500px' }}>
                
                {/* MODIFIÉ : On affiche soit le formulaire, soit le message d'erreur */}
                {!errorState ? (
                    // --- VUE NORMALE : Formulaire pour changer le mot de passe ---
                    <>
                        <PasswordIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
                            Choisissez un nouveau mot de passe
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                            <TextField
                                margin="normal" required fullWidth name="password" label="Nouveau mot de passe"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                margin="normal" required fullWidth name="confirmPassword" label="Confirmer le mot de passe"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                Réinitialiser le mot de passe
                            </Button>
                        </Box>
                    </>
                ) : (
                    // --- NOUVELLE VUE : Message d'erreur détaillé ---
                    <>
                        <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
                        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                            Échec de la réinitialisation
                        </Typography>
                        <Box sx={{ textAlign: 'left', mt: 2, mb: 3 }}>
                            <Typography variant="body1">Raisons possibles :</Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon sx={{minWidth: '30px'}}>1.</ListItemIcon>
                                    <ListItemText primary="Ce lien a peut-être déjà été utilisé." />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon sx={{minWidth: '30px'}}>2.</ListItemIcon>
                                    <ListItemText primary="Ce lien a expiré (il n'est valide que pour une durée limitée)." />
                                </ListItem>
                                <ListItem>
                                   
                                    <ListItemIcon sx={{minWidth: '30px'}}>3.</ListItemIcon>
                                    <ListItemText primary="Le mot de passe ne respecte pas la forme acceptée de 9 caractères dont 3 chiffres et 1 caractère spécial comme @." />
                                </ListItem>
                            </List>
                        </Box>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/forgot-password')}
                        >
                            Demander un nouveau lien
                        </Button>
                    </>
                )}
            </Paper>
        </Box>
    );
}

export default ResetPasswordPage;