// src/components/ReclamationModal.jsx
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Box, CircularProgress, IconButton
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function ReclamationModal({ open, onClose, onSubmit }) {
  const [message, setMessage] = useState('');
  const [screenshots, setScreenshots] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
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
    setScreenshots(prev => [...prev, ...uploadedImages]);
    setIsUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ message, screenshots });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Faire une réclamation</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Votre message"
            multiline
            rows={8}
            fullWidth
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            helperText="Veuillez expliquer en détail la raison de votre réclamation."
          />
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
              disabled={isUploading}
            >
              Ajouter des captures d'écran
              <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
            </Button>
            {isUploading && <CircularProgress size={24} sx={{ ml: 2 }} />}
          </Box>
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {screenshots.map(img => <img key={img} src={img} alt="preview" width="100" height="100" style={{ objectFit: 'cover', borderRadius: '8px' }} />)}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained">Envoyer la réclamation</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ReclamationModal;