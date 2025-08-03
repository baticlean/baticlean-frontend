// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Link, IconButton, InputAdornment } from '@mui/material';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/authSlice';
import { toast } from 'react-toastify';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CircularLoading from '../components/CircularLoading';

function LoginPage() {
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // On récupère la fonction de navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.promise(
      dispatch(loginUser(formData)).unwrap(),
      {
        pending: {
          render() {
            return <CircularLoading message="Connexion en cours..." />;
          },
        },
        success: {
          render() {
            setTimeout(() => navigate('/home'), 1500);
            return 'Connexion réussie !';
          }
        },
        error: {
          // === LA LOGIQUE DE REDIRECTION EST ICI ===
          render({ data }) {
            // Si le message d'erreur contient "banni" ou "suspendu"
            if (typeof data === 'string' && data.includes('suspendu ou banni')) {
              navigate('/banned'); // On redirige vers la page de bannissement
              return null; // On n'affiche pas de notification, la page suffit
            }
            // Pour toutes les autres erreurs, on affiche la notification
            if (typeof data === 'string') return data;
            return 'Une erreur inattendue est survenue.';
          }
        }
      }
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Connexion</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email ou Numéro de téléphone"
            name="login"
            autoFocus
            value={formData.login}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
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
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Se Connecter
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                Pas encore de compte ? S'inscrire
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;