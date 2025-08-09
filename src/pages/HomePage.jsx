import React, { useEffect } from 'react';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServices } from '../redux/serviceSlice.js';
import ResponsiveServiceGrid from '../components/ResponsiveServiceGrid.jsx';

function HomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: services, loading, error } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom>Bienvenue, {user?.username} !</Typography>
      <Typography variant="h5" sx={{ mb: 3 }}>Nos Services</Typography>
      <ResponsiveServiceGrid services={services} />
    </Box>
  );
}

export default HomePage;