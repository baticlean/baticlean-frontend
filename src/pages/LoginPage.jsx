// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import {
  Container, Box, Typography, TextField, Button, Grid,
  Link, IconButton, InputAdornment
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, setToken } from '../redux/authSlice.js';
import { toast } from 'react-toastify';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import ReactivatedNotice from '../components/ReactivatedNotice.jsx';
import FullScreenLoader from '../components/FullScreenLoader.jsx'; // ✅ IMPORT

function LoginPage() {
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Cet état contrôle maintenant notre loader

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { justReactivated } = useSelector((state) => state.auth);

  if (justReactivated) {
    return <ReactivatedNotice />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    dispatch(loginUser(formData))
      .unwrap()
      .then(() => {
        navigate('/welcome');
      })
      .catch((error) => {
        if (error && error.status === 429) {
          navigate('/temporary-lock');
        } else if (error && error.authToken) {
          dispatch(setToken(error.authToken));
          navigate('/banned');
        } else {
          toast.error(error.message || "Identifiant ou mot de passe incorrect.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {/* ✅ Le loader est ici, en dehors du formulaire */}
      <FullScreenLoader open={loading} message="Connexion en cours..." />

      <Container component="main" maxWidth="xs">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Connexion
          </Typography>
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
              disabled={loading}
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
              disabled={loading}
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 1 }}
              disabled={loading}
            >
              {/* ✅ Le bouton n'affiche plus le spinner */}
              Se Connecter
            </Button>

            <Button
              type="button"
              fullWidth
              variant="outlined"
              onClick={() => navigate('/')}
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 2 }}
              disabled={loading}
            >
              Retour
            </Button>

            <Grid container sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Grid item xs={12} sm>
                <Link component={RouterLink} to="/forgot-password" variant="body2">
                  Mot de passe oublié ?
                </Link>
              </Grid>
              <Grid item xs={12} sm="auto">
                <Link component={RouterLink} to="/register" variant="body2">
                  Pas encore de compte ? S'inscrire
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default LoginPage;