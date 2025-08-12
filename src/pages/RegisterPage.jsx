// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Link, IconButton, InputAdornment } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
// ✅ On importe loginUser en plus de registerUser
import { registerUser, loginUser } from '../redux/authSlice.js'; 
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input/min';
import 'react-phone-number-input/style.css';
import './PhoneNumber.css';
import FullScreenLoader from '../components/FullScreenLoader.jsx';

function RegisterPage() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // ✅✅✅ DÉBUT DE LA LOGIQUE CORRIGÉE ✅✅✅
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validations (inchangées)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Veuillez entrer une adresse email valide.");
            return;
        }
        if (!phoneNumber || !isPossiblePhoneNumber(phoneNumber)) {
            toast.error("Veuillez entrer un numéro de téléphone valide.");
            return;
        }
        // Fin des validations

        const finalFormData = { ...formData, phoneNumber };
        setLoading(true);

        // Étape 1 : Inscription
        dispatch(registerUser(finalFormData))
            .unwrap()
            .then(() => {
                // Étape 2 : Si l'inscription réussit, on lance la connexion automatique
                toast.success('Inscription réussie ! Connexion en cours...');
                return dispatch(loginUser({ email: formData.email, password: formData.password })).unwrap();
            })
            .then(() => {
                // Étape 3 : Si la connexion réussit, on redirige vers l'écran de bienvenue
                // On met un petit délai pour que l'utilisateur voie le message de succès
                setTimeout(() => {
                    navigate('/welcome', { state: { isNewUser: true }, replace: true });
                }, 1500);
            })
            .catch((error) => {
                // Si l'une ou l'autre des étapes échoue, on affiche une erreur
                toast.error(error || "Une erreur est survenue lors de l'inscription.");
                setLoading(false); // On arrête le chargement en cas d'erreur
            });
            // Le .finally() n'est plus nécessaire ici car on gère la fin du chargement dans les .then() et .catch()
    };
    // ✅✅✅ FIN DE LA LOGIQUE CORRIGÉE ✅✅✅

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