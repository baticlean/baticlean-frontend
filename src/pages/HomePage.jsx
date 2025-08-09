// src/pages/HomePage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Box, CircularProgress, Alert, TextField, InputAdornment, ButtonGroup, Button, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServices } from '../redux/serviceSlice.js';
import ResponsiveServiceGrid from '../components/ResponsiveServiceGrid.jsx';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash/debounce';

const CATEGORIES = ['Tous', 'Ménage', 'Entretien', 'Maintenance', 'Autre'];
const SORT_OPTIONS = {
    createdAt: 'Plus récents',
    popularity: 'Popularité'
};

function HomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: services, loading, error } = useSelector((state) => state.services);

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Tous');
  const [sortBy, setSortBy] = useState('createdAt');

  const loadServices = useCallback((filters) => {
    dispatch(fetchServices(filters));
  }, [dispatch]);
  
  const debouncedLoadServices = useCallback(debounce(loadServices, 500), [loadServices]);

  useEffect(() => {
    const filters = {};
    if (searchTerm) filters.search = searchTerm;
    if (category !== 'Tous') filters.category = category;
    if (sortBy !== 'createdAt') filters.sortBy = sortBy;
    
    // Si l'utilisateur tape, on attend. S'il clique, on charge immédiatement.
    if (Object.keys(filters).includes('search')) {
        debouncedLoadServices(filters);
    } else {
        loadServices(filters);
    }
  }, [searchTerm, category, sortBy, debouncedLoadServices, loadServices]);

  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom>Bienvenue, {user?.username} !</Typography>
      
      {/* Barre de recherche et filtres */}
      <Paper sx={{ p: 2, mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
              fullWidth
              placeholder="Rechercher un service (ex: nettoyage de vitres, réparation...)"
              variant="outlined"
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                  startAdornment: ( <InputAdornment position="start"><SearchIcon /></InputAdornment> ),
              }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <ButtonGroup variant="outlined" aria-label="Catégories de service">
                  {CATEGORIES.map(cat => (
                      <Button key={cat} variant={category === cat ? "contained" : "outlined"} onClick={() => setCategory(cat)}>
                          {cat}
                      </Button>
                  ))}
              </ButtonGroup>
              <ButtonGroup variant="outlined" aria-label="Options de tri">
                  {Object.entries(SORT_OPTIONS).map(([key, value]) => (
                      <Button key={key} variant={sortBy === key ? "contained" : "outlined"} onClick={() => setSortBy(key)}>
                          {value}
                      </Button>
                  ))}
              </ButtonGroup>
          </Box>
      </Paper>

      <Typography variant="h5" sx={{ mb: 3 }}>Nos Services</Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : (
        <ResponsiveServiceGrid services={services} />
      )}
    </Box>
  );
}

export default HomePage;