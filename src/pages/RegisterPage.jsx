import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Link, IconButton, InputAdornment } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { registerUser } from '../redux/authSlice';
import CircularLoading from '../components/CircularLoading';
import ReactivatedNotice from '../components/ReactivatedNotice.jsx'; // <-- 1. Importer le nouvel écran

function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', phoneNumber: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // 2. Récupérer l'interrupteur 'justReactivated' depuis Redux
  const { justReactivated } = useSelector((state) => state.auth);

  // 3. Ajouter la condition d'affichage
  if (justReactivated) {
    return <ReactivatedNotice />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber' && !/^\d*$/.test(value)) {
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.promise(
      dispatch(registerUser(formData)).unwrap(),
      {
        pending: { render() { return <CircularLoading message="Inscription en cours..." />; } },
        success: {
          render() {
            setTimeout(() => navigate('/login'), 2000);
            return 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
          }
        },
        error: {
          render({ data }) {
            if (typeof data === 'string') return data;
            return 'Une erreur est survenue. Veuillez vérifier vos informations.';
          }
        }
      }
    );
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
              <TextField name="phoneNumber" required fullWidth label="Numéro de téléphone" value={formData.phoneNumber} onChange={handleChange} />
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
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>S'inscrire</Button>
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