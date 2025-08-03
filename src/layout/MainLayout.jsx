import React, { useState } from 'react';
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice.js';
import { disconnectSocket } from '../socket/socket.js';
import {
  AppBar, Toolbar, Typography, Box, Button, Fab,
  IconButton, Menu, MenuItem, Avatar
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { motion } from 'framer-motion';
import Footer from '../components/Footer.jsx';

function MainLayout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    disconnectSocket();
    navigate('/login');
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #8A2387 30%, #E94057 90%)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BATIClean
          </Typography>
          {(user?.role === 'admin' || user?.role === 'superAdmin') && (
            <>
              <Button color="inherit" component={RouterLink} to="/admin/users">Utilisateurs</Button>
              <Button color="inherit" component={RouterLink} to="/admin/services">Services</Button>
              <Button color="inherit" component={RouterLink} to="/admin/tickets">Tickets</Button>
              <Button color="inherit" component={RouterLink} to="/admin/bookings">Réservations</Button>
              {/* --- LIEN AJOUTÉ ICI --- */}
              <Button color="inherit" component={RouterLink} to="/admin/reclamations">Réclamations</Button>
            </>
          )}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" component={RouterLink} to="/support-chat" sx={{ mr: 1 }}>
              <SupportAgentIcon />
            </IconButton>
            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              <Avatar src={user?.profilePicture} alt={user?.username} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              sx={{ mt: '45px' }}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>Profil</MenuItem>
              <MenuItem component={RouterLink} to="/my-bookings" onClick={handleClose}>Mes Réservations</MenuItem>
              <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Box sx={{ position: 'fixed', bottom: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Fab color="secondary" aria-label="home" onClick={() => navigate('/home')}><HomeIcon /></Fab>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Fab color="primary" aria-label="back" onClick={() => navigate(-1)}><ArrowBackIcon /></Fab>
        </motion.div>
      </Box>
      <Footer />
    </Box>
  );
}

export default MainLayout;