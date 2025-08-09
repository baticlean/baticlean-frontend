// src/components/ReviewModal.jsx

import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack, Rating } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function ReviewModal({ open, onClose, booking, token }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async () => {
        if (rating === 0 || !comment.trim()) {
            toast.error("Veuillez donner une note et un commentaire.");
            return;
        }

        const toastId = toast.loading("Envoi de votre avis...");
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`${API_URL}/api/bookings/${booking._id}/review`, { rating, comment }, config);
            
            toast.update(toastId, {
                render: "Merci ! Votre avis a été publié.",
                type: 'success',
                isLoading: false,
                autoClose: 2000,
            });
            onClose(true); // Indique que l'avis a été soumis avec succès
        } catch (error) {
            toast.update(toastId, {
                render: error.response?.data?.message || "Une erreur est survenue.",
                type: 'error',
                isLoading: false,
                autoClose: 3000,
            });
            onClose(false);
        }
    };

    return (
        <Modal open={open} onClose={() => onClose(false)}>
            <Box sx={style}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    Évaluer le service "{booking?.service?.title}"
                </Typography>
                <Stack spacing={2}>
                    <Typography component="legend">Votre note</Typography>
                    <Rating
                        name="service-rating"
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                        size="large"
                    />
                    <TextField
                        label="Votre commentaire"
                        multiline
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                        <Button onClick={() => onClose(false)}>Annuler</Button>
                        <Button variant="contained" onClick={handleSubmit}>Envoyer</Button>
                    </Box>
                </Stack>
            </Box>
        </Modal>
    );
}

export default ReviewModal;