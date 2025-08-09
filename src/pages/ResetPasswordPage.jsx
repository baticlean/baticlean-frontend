import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, IconButton, InputAdornment } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import PasswordIcon from '@mui/icons-material/Password';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const API_URL = import.meta.env.VITE_API_URL;

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    // Vous pouvez remettre la validation de mot de passe fort ici si vous le souhaitez
    
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
      toast.update(toastId, {
        render: error.response?.data?.message || "Une erreur est survenue.",
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: 'linear-gradient(to top, #f3e5f5, #e1bee7)', p: 2 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: '16px', textAlign: 'center', maxWidth: '500px', border: '1px solid', borderColor: 'primary.main', boxShadow: '0px 10px 30px rgba(138, 43, 226, 0.2)' }}>
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
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, background: 'linear-gradient(45deg, #8A2387 30%, #E94057 90%)', color: 'white' }}>
                    Réinitialiser le mot de passe
                </Button>
            </Box>
        </Paper>
    </Box>
  );
}

export default ResetPasswordPage;