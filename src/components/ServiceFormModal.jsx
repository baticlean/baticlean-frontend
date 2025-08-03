// src/components/ServiceFormModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Grid, Select, MenuItem, InputLabel, FormControl, Box, CircularProgress
} from '@mui/material';
import axios from 'axios';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function ServiceFormModal({ open, onClose, onSubmit, serviceToEdit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Ménage',
    images: []
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (serviceToEdit) {
      setFormData(serviceToEdit);
    } else {
      setFormData({ title: '', description: '', price: '', category: 'Ménage', images: [] });
    }
  }, [serviceToEdit, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    setIsUploading(true);
    const uploadedImages = [];
    for (const file of files) {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', UPLOAD_PRESET);
      try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, uploadData);
        uploadedImages.push(response.data.secure_url);
      } catch (error) {
        console.error("Erreur d'upload sur Cloudinary", error);
      }
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedImages] }));
    setIsUploading(false);
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
            <Grid item xs={12}>
              <TextField name="title" label="Titre" value={formData.title} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField name="description" label="Description" value={formData.description} onChange={handleChange} fullWidth required multiline rows={4} />
            </Grid>
            <Grid item xs={6}>
              <TextField name="price" label="Prix (€)" type="number" value={formData.price} onChange={handleChange} fullWidth required />
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
                <input type="file" hidden multiple onChange={handleImageUpload} />
              </Button>
              {isUploading && <CircularProgress size={24} sx={{ ml: 2 }} />}
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {formData.images.map(img => <img key={img} src={img} alt="preview" width="80" height="80" style={{ objectFit: 'cover' }} />)}
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