// src/components/ServiceFormModal.jsx (Corrigé)

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Grid, Select, MenuItem, InputLabel, FormControl, Box, CircularProgress, IconButton
} from '@mui/material';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify'; // ✅ AJOUT : Pour afficher les erreurs

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function ServiceFormModal({ open, onClose, onSubmit, serviceToEdit }) {
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', category: 'Ménage', images: []
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (serviceToEdit) {
      // On s'assure que serviceToEdit et serviceToEdit.images existent
      setFormData({ ...serviceToEdit, images: serviceToEdit.images || [] });
    } else {
      setFormData({ title: '', description: '', price: '', category: 'Ménage', images: [] });
    }
  }, [serviceToEdit, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ CORRECTION : Logique d'upload plus robuste
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadedImages = [];

    // On utilise Promise.all pour gérer tous les uploads en parallèle
    const uploadPromises = Array.from(files).map(file => {
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('upload_preset', UPLOAD_PRESET);
        return axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, uploadData);
    });

    try {
        const responses = await Promise.all(uploadPromises);
        responses.forEach(response => {
            uploadedImages.push(response.data.secure_url);
        });
        setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedImages] }));
        toast.success(`${uploadedImages.length} image(s) téléversée(s) !`);
    } catch (error) {
        console.error("Erreur d'upload sur Cloudinary", error);
        // Affiche une erreur claire à l'utilisateur
        toast.error("Échec du téléversement d'une ou plusieurs images. Vérifiez votre configuration Cloudinary.");
    } finally {
        // Le plus important : on réactive toujours le bouton, même en cas d'erreur
        setIsUploading(false);
    }
  };

  const handleRemoveImage = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageUrl)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{serviceToEdit ? 'Modifier le Service' : 'Ajouter un Service'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            {/* ... (le reste du formulaire est inchangé) ... */}
            <Grid item xs={12}>
              <TextField name="title" label="Titre" value={formData.title} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField name="description" label="Description" value={formData.description} onChange={handleChange} fullWidth required multiline rows={4} />
            </Grid>
            <Grid item xs={6}>
              <TextField name="price" label="Prix (FCFA)" type="number" value={formData.price} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select name="category" value={formData.category} label="Catégorie" onChange={handleChange}>
                  <MenuItem value="Ménage">Ménage</MenuItem>
                  <MenuItem value="Entretien">Entretien</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="Autre">Autre</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label" disabled={isUploading}>
                Téléverser des Images
                <input type="file" hidden multiple onChange={handleImageUpload} accept="image/*" />
              </Button>
              {isUploading && <CircularProgress size={24} sx={{ ml: 2 }} />}
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {formData.images.map(img => (
                <Box key={img} sx={{ position: 'relative' }}>
                  <img src={img} alt="preview" width="80" height="80" style={{ objectFit: 'cover', borderRadius: '8px' }} />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(img)}
                    sx={{
                      position: 'absolute', top: -5, right: -5,
                      bgcolor: 'white', color: 'black',
                      '&:hover': { bgcolor: '#f1f1f1' }
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained">Sauvegarder</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ServiceFormModal;