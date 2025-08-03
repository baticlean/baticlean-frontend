// src/pages/AdminReclamationsPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReclamations } from '../redux/reclamationSlice.js';
import {
  Container, Typography, Box, Paper, Accordion, AccordionSummary,
  AccordionDetails, Chip, CircularProgress, Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function AdminReclamationsPage() {
  const dispatch = useDispatch();
  const { items: reclamations, loading, error } = useSelector((state) => state.reclamations);

  useEffect(() => {
    dispatch(fetchAllReclamations());
  }, [dispatch]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Réclamations des Utilisateurs
      </Typography>
      {reclamations.length === 0 ? (
        <Typography>Aucune réclamation pour le moment.</Typography>
      ) : (
        <Box>
          {reclamations.map(reclamation => (
            <Accordion key={reclamation._id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <Typography>
                    De: **{reclamation.user.username}** (Statut du compte: {reclamation.user.status})
                  </Typography>
                  <Chip label={reclamation.status} color={reclamation.status === 'Nouvelle' ? 'warning' : 'default'} />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                  {reclamation.message}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {reclamation.screenshots.map(img => (
                    <a href={img} target="_blank" rel="noopener noreferrer" key={img}>
                      <img src={img} alt="screenshot" width="150" style={{ borderRadius: '8px' }} />
                    </a>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default AdminReclamationsPage;