// baticlean-frontend/src/pages/RegisterPage.jsx

import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, TextField, Button, 
  Paper, InputAdornment, IconButton, CircularProgress 
} from '@mui/material';
import { 
  Visibility, VisibilityOff, Email, Person, 
  Lock, Phone, CheckCircle, RadioButtonUnchecked 
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './PhoneNumber.css';
import axios from 'axios';
import { setCredentials } from '../redux/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // État pour la validation dynamique du mot de passe
  const [passwordValidation, setPasswordValidation] = useState({
    hasLetter: false,
    hasThreeNumbers: false,
    hasSpecialChar: false,
    hasMinLength: false
  });

  useEffect(() => {
    const p = formData.password;
    setPasswordValidation({
      hasLetter: /[a-zA-Z]/.test(p),
      hasThreeNumbers: (p.match(/\d/g) || []).length >= 3,
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(p),
      hasMinLength: p.length >= 9
    });
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phoneNumber: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isPasswordValid = Object.values(passwordValidation).every(v => v);
    
    if (!isPasswordValid) {
      toast.error("Le mot de passe ne respecte pas les critères de sécurité.");
      return;
    }

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await axios.post(`${API_URL}/api/register`, formData);
      dispatch(setCredentials({ 
        token: res.data.authToken, 
        user: res.data.user || null 
      }));
      toast.success("Bienvenue chez BATIClean !");
      navigate('/welcome');
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const ValidationItem = ({ label, isMet }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
      {isMet ? 
        <CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} /> : 
        <RadioButtonUnchecked sx={{ fontSize: 16, color: '#bdbdbd' }} />
      }
      <Typography variant="caption" sx={{ color: isMet ? '#2e7d32' : '#757575', fontWeight: isMet ? 600 : 400 }}>
        {label}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      p: 2
    }}>
      <Container maxWidth="xs">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, color: '#3f51b5' }}>
              Créer un compte
            </Typography>
            <Typography variant="body2" align="center" sx={{ mb: 3, color: '#666' }}>
              Rejoignez BATIClean pour vos services de nettoyage
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth label="Nom d'utilisateur" name="username" margin="normal"
                required value={formData.username} onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment> }}
              />
              <TextField
                fullWidth label="Email" name="email" type="email" margin="normal"
                required value={formData.email} onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment> }}
              />
              
              <Box sx={{ mt: 2, mb: 1 }}>
                <PhoneInput
                  placeholder="Numéro de téléphone"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  defaultCountry="FR"
                  className="my-phone-input"
                />
              </Box>

              <TextField
                fullWidth label="Mot de passe" name="password" 
                type={showPassword ? 'text' : 'password'} margin="normal"
                required value={formData.password} onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {/* Checklist de sécurité dynamique */}
              <Box sx={{ mt: 1, mb: 2, p: 1.5, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700, color: '#3f51b5' }}>
                  SÉCURITÉ DU MOT DE PASSE :
                </Typography>
                <ValidationItem label="Au moins une lettre" isMet={passwordValidation.hasLetter} />
                <ValidationItem label="Au moins 3 chiffres" isMet={passwordValidation.hasThreeNumbers} />
                <ValidationItem label="Un caractère spécial (!@#...)" isMet={passwordValidation.hasSpecialChar} />
                <ValidationItem label="9 caractères minimum" isMet={passwordValidation.hasMinLength} />
              </Box>

              <Button
                fullWidth variant="contained" type="submit" size="large"
                disabled={loading}
                sx={{ mt: 2, py: 1.5, borderRadius: 2, fontWeight: 700, textTransform: 'none', fontSize: '1.1rem' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "S'inscrire"}
              </Button>
            </form>

            <Typography align="center" sx={{ mt: 3, fontSize: '0.9rem' }}>
              Déjà un compte ? <Link to="/login" style={{ color: '#3f51b5', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default RegisterPage;