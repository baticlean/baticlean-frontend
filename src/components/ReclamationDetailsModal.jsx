import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';

function ReclamationDetailsModal({ reclamation, open, onClose }) {
  if (!reclamation) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Détails de la Réclamation</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom><strong>Client:</strong> {reclamation.user?.username} ({reclamation.user?.email})</Typography>
        <Typography gutterBottom><strong>Statut du compte:</strong> {reclamation.user?.status}</Typography>
        <Typography gutterBottom><strong>Date:</strong> {format(new Date(reclamation.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}</Typography>
        <Typography variant="body1" sx={{ p: 2, mt: 2, mb: 2, border: '1px solid #ddd', borderRadius: 1, background: '#f9f9f9' }}>
            {reclamation.message}
        </Typography>
        {reclamation.screenshots && reclamation.screenshots.length > 0 && (
            <>
                <Typography gutterBottom><strong>Captures d'écran:</strong></Typography>
                <Grid container spacing={1}>
                    {reclamation.screenshots.map((url, index) => (
                        <Grid item xs={6} sm={4} key={index}>
                            <a href={url} target="_blank" rel="noopener noreferrer">
                                <img src={url} alt={`Screenshot ${index + 1}`} style={{ width: '100%', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </a>
                        </Grid>
                    ))}
                </Grid>
            </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReclamationDetailsModal;