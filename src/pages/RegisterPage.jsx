// src/pages/RegisterPage.jsx (Version finale et correcte)

import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Link, IconButton, InputAdornment, FormControlLabel, Checkbox } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { registerUser } from '../redux/authSlice.js';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input/min';
import 'react-phone-number-input/style.css';
import './PhoneNumber.css';
import FullScreenLoader from '../components/FullScreenLoader.jsx';

function RegisterPage() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false); // Nouvel état pour la case à cocher
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // ✅ LOGIQUE SIMPLIFIÉE QUI CORRESPOND AU BACKEND
    const handleSubmit = (e) => {
        e.preventDefault();

        // Nouvelle validation pour la case à cocher
        if (!termsAccepted) {
            toast.error("Veuillez accepter les conditions d'utilisation et la politique de confidentialité pour continuer.");
            return;
        }

        // Validations existantes
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Veuillez entrer une adresse email valide.");
            return;
        }
        if (!phoneNumber || !isPossiblePhoneNumber(phoneNumber)) {
            toast.error("Veuillez entrer un numéro de téléphone valide.");
            return;
        }
        
        const finalFormData = { ...formData, phoneNumber };
        setLoading(true);

        // On ne fait plus qu'UN SEUL appel. Le backend s'occupe de la connexion.
        dispatch(registerUser(finalFormData))
            .unwrap()
            .then(() => {
                // Si ça réussit, le slice Redux a déjà reçu le token. On peut rediriger.
                toast.success('Inscription réussie !');
                navigate('/welcome');
            })
            .catch((error) => {
                // La gestion d'erreur reste la même
                toast.error(error || "Une erreur est survenue lors de l'inscription.");
            })
            .finally(() => {
                // On arrête toujours le chargement à la fin
                setLoading(false);
            });
    };

    return (
        <>
            <FullScreenLoader open={loading} message="Finalisation de l'inscription..." />

            <Container component="main" maxWidth="xs">
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5">Inscription</Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField name="username" required fullWidth label="Nom d'utilisateur" value={formData.username} onChange={handleChange} disabled={loading}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="email" type="email" required fullWidth label="Adresse Email" value={formData.email} onChange={handleChange} disabled={loading}/>
                            </Grid>
                            <Grid item xs={12}>
                                <PhoneInput
                                    placeholder="Numéro de téléphone"
                                    value={phoneNumber}
                                    onChange={setPhoneNumber}
                                    defaultCountry="CI"
                                    international
                                    countryCallingCodeEditable={true}
                                    className="phone-input-container"
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="password"
                                    required
                                    fullWidth
                                    label="Mot de passe"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    helperText="Doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
                                    disabled={loading}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" disabled={loading}>
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            {/* Début de l'ajout de la case à cocher */}
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={termsAccepted}
                                            onChange={(e) => setTermsAccepted(e.target.checked)}
                                            name="termsAccepted"
                                            color="primary"
                                            disabled={loading}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" color="text.secondary">
                                            J'accepte les <Link component={RouterLink} to="/TermsPage" target="_blank">Conditions d'utilisation</Link> et la <Link component={RouterLink} to="/PrivacyPolicyPage" target="_blank">Politique de confidentialité</Link>.
                                        </Typography>
                                    }
                                />
                            </Grid>
                             {/* Fin de l'ajout */}
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 1 }}
                            disabled={loading || (phoneNumber ? !isPossiblePhoneNumber(phoneNumber) : true)}
                        >
                            S'inscrire
                        </Button>
                        <Button
                            type="button"
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2 }}
                            onClick={() => navigate(-1)}
                            startIcon={<ArrowBackIcon />}
                            disabled={loading}
                        >
                            Retour
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link component={RouterLink} to="/login" variant="body2">
                                    Déjà un compte ? Connectez-vous
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
}

export default RegisterPage;