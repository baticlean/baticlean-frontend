// src/pages/ForgotPasswordPage.jsx

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MailOutline as MailOutlineIcon, CheckCircleOutline as CheckCircleOutlineIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material'; // AJOUT : ArrowBackIcon

import MaintenancePage from '../components/MaintenancePage.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Envoi de la demande...");
    try {
      const response = await axios.post(`${API_URL}/api/forgot-password`, { email });
      toast.update(toastId, {
        render: response.data.message,
        type: 'success',
        isLoading: false,
        autoClose: 5000,
      });
      setEmailSent(true);
    } catch (error) {
      toast.dismiss(toastId);
      if (error.response && error.response.status === 503) {
        setShowMaintenance(true);
      } else {
        const errorMessage = error.response?.data?.message || "Une erreur est survenue.";
        toast.error(errorMessage);
      }
    }
  };

  if (showMaintenance) {
    return <MaintenancePage />;
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '80vh' }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: '16px',
          textAlign: 'center',
          width: '100%'
        }}
      >
        {!emailSent ? (
          <>
            <MailOutlineIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
              Mot de passe oublié
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, mb: 3 }}>
              Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                required
                fullWidth
                id="email"
                label="Adresse Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1 }}>
                Envoyer le lien
              </Button>
              {/* AJOUT : Bouton Retour */}
              <Button
                type="button"
                fullWidth
                variant="outlined"
                onClick={() => navigate(-1)}
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 2 }}
              >
                Retour
              </Button>
            </Box>
          </>
        ) : (
          <>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
              Vérifiez vos emails
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, mb: 3 }} dangerouslySetInnerHTML={{ __html: `Si un compte est associé à l'adresse <strong>${email}</strong>, un lien de réinitialisation vient de vous être envoyé.` }} />
            <Button onClick={() => navigate('/login')} fullWidth variant="contained">
              Retour à la connexion
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default ForgotPasswordPage;