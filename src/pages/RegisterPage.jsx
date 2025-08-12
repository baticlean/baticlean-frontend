// src/pages/RegisterPage.jsx (Corrigé et Simplifié)

import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Link, IconButton, InputAdornment } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
// ✅ On n'a plus besoin d'importer loginUser ici
import { registerUser } from '../redux/authSlice.js';
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

    // ✅✅✅ LOGIQUE SIMPLIFIÉE ✅✅✅
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
        
        const finalFormData = { ...formData, phoneNumber };
        setLoading(true);

        // On lance l'inscription. Le backend nous connectera automatiquement.
        dispatch(registerUser(finalFormData))
            .unwrap()
            .then(() => {
                // Si ça réussit, le slice Redux a déjà reçu le token. On peut rediriger.
                toast.success('Inscription réussie !');
                navigate('/welcome');
            })
            .catch((error) => {
                toast.error(error || "Une erreur est survenue lors de l'inscription.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <FullScreenLoader open={loading} message="Finalisation de l'inscription..." />
            {/* Le reste de ton JSX reste identique et n'a pas besoin de changer */}
            <Container component="main" maxWidth="xs">
              {/* ... ton formulaire ... */}
            </Container>
        </>
    );
}

export default RegisterPage; 