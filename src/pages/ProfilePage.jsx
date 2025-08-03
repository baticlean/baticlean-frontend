// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Paper, Typography, Box, Avatar, Button, TextField, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { setToken } from '../redux/authSlice.js';

const API_URL = import.meta.env.VITE_API_URL;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function ProfilePage() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const handleApiResponse = (response) => {
    // Met à jour le token dans Redux et localStorage
    dispatch(setToken(response.data.authToken));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', UPLOAD_PRESET);

    const uploadPromise = axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, uploadData)
      .then(response => {
        const profilePictureUrl = response.data.secure_url;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        return axios.put(`${API_URL}/api/user/profile-picture`, { profilePictureUrl }, config);
      })
      .then(handleApiResponse);

    toast.promise(uploadPromise, {
      pending: 'Mise à jour de la photo...',
      success: 'Photo de profil mise à jour !',
      error: 'Erreur lors de la mise à jour.',
    });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const updatePromise = axios.put(`${API_URL}/api/user/profile`, formData, config)
                               .then(handleApiResponse);
    
    toast.promise(updatePromise, {
        pending: 'Mise à jour du profil...',
        success: 'Profil mis à jour !',
        error: 'Erreur lors de la mise à jour.'
    });
    setIsEditing(false);
  };

  if (!user) return <Typography>Chargement...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar src={user.profilePicture} sx={{ width: 100, height: 100, mr: 3 }} />
          <Box>
            <Typography variant="h4">{user.username}</Typography>
            <Button component="label" size="small">
              Changer la photo
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>
          </Box>
        </Box>
        <form onSubmit={handleUpdateProfile}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField label="Nom d'utilisateur" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} fullWidth disabled={!isEditing} /></Grid>
            <Grid item xs={12}><TextField label="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} fullWidth disabled={!isEditing} /></Grid>
            <Grid item xs={12}><TextField label="Téléphone" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} fullWidth disabled={!isEditing} /></Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {isEditing ? (
              <>
                <Button onClick={() => setIsEditing(false)}>Annuler</Button>
                <Button type="submit" variant="contained">Sauvegarder</Button>
              </>
            ) : (
              <Button variant="contained" onClick={() => setIsEditing(true)}>Modifier les informations</Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default ProfilePage;