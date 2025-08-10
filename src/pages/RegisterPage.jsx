// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Link, IconButton, InputAdornment } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, ArrowBack as ArrowBackIcon } from '@mui/icons-material'; // AJOUT : ArrowBackIcon
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { registerUser } from '../redux/authSlice.js';
import CircularLoading from '../components/CircularLoading.jsx';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input/min';
import 'react-phone-number-input/style.css';
import './PhoneNumber.css';

function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
    const toastId = toast.loading(<CircularLoading message="Inscription en cours..." />);
    dispatch(registerUser(finalFormData))
      .unwrap()
      .then(() => {
        toast.update(toastId, {
          render: 'Inscription réussie ! Vous pouvez maintenant vous connecter.',
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });
        setTimeout(() => navigate('/login'), 2000);
      })
      .catch((error) => {
        toast.update(toastId, {
          render: error || "Une erreur est survenue.",
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Inscription</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField name="username" required fullWidth label="Nom d'utilisateur" value={formData.username} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="email" type="email" required fullWidth label="Adresse Email" value={formData.email} onChange={handleChange} />
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
                helperText="Doit contenir 9 caractères (3 chiffres, et 1 caractère spécial)."
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
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 1 }} // MODIFIÉ : mb: 1
            disabled={phoneNumber ? !isPossiblePhoneNumber(phoneNumber) : true}
          >
            S'inscrire
          </Button>

          {/* AJOUT : Bouton Retour */}
          <Button
            type="button"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
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
  );
}

export default RegisterPage;