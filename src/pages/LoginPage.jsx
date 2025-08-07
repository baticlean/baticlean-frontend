import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Link, IconButton, InputAdornment } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, setToken } from '../redux/authSlice.js';
import { toast } from 'react-toastify';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CircularLoading from '../components/CircularLoading.jsx';
import ReactivatedNotice from '../components/ReactivatedNotice.jsx'; // <-- 1. Importer le nouvel écran

function LoginPage() {
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // 2. Récupérer l'interrupteur 'justReactivated' depuis Redux
  const { token, justReactivated } = useSelector((state) => state.auth);

  // 3. Ajouter la condition d'affichage
  if (justReactivated) {
    return <ReactivatedNotice />;
  }

  useEffect(() => {
    if (token && typeof token === 'string' && token.includes('banned')) {
      navigate('/banned', { replace: true });
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const toastId = toast.loading(<CircularLoading message="Connexion en cours..." />);

    dispatch(loginUser(formData))
      .unwrap()
      .then(() => {
        toast.update(toastId, {
          render: 'Connexion réussie !',
          type: 'success',
          isLoading: false,
          autoClose: 1500,
        });
        setTimeout(() => navigate('/home'), 1500);
      })
      .catch((error) => {
        toast.dismiss(toastId);

        if (error && error.authToken) {
          dispatch(setToken(error.authToken));
        } else {
          toast.error(error.message || "Identifiant ou mot de passe incorrect.");
        }
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Connexion</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth label="Email ou Numéro de téléphone" name="login" autoFocus value={formData.login} onChange={handleChange} />
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
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Se Connecter</Button>
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