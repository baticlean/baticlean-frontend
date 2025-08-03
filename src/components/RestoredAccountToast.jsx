// src/components/RestoredAccountToast.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { logout } from '../redux/authSlice.js';
import { toast } from 'react-toastify';

function RestoredAccountToast({ closeToast }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleReconnect = () => {
    dispatch(logout());
    navigate('/login');
    closeToast(); // Ferme la notification
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="body1">
        Votre compte a été réactivé.
      </Typography>
      <Button 
        variant="contained" 
        color="success" 
        size="small"
        onClick={handleReconnect} 
        sx={{ mt: 2 }}
      >
        Se reconnecter
      </Button>
    </Box>
  );
}

export default RestoredAccountToast;