import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice.js';
import { disconnectSocket } from '../socket/socket.js';
import { fetchNotificationCounts, markAsRead } from '../redux/notificationSlice.js';
// --- AJOUT : On importe la fonction pour récupérer les tickets de l'utilisateur ---
import { fetchUserTickets } from '../redux/ticketSlice.js';
import {
  AppBar, Toolbar, Typography, Box, Button, Fab,
  IconButton, Menu, MenuItem, Avatar, Badge
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { motion } from 'framer-motion';
import Footer from '../components/Footer.jsx';
import NotificationsIcon from '@mui/icons-material/Notifications';

function MainLayout() {
  const { user } = useSelector((state) => state.auth);
  const { counts } = useSelector((state) => state.notifications);
  // --- AJOUT : On récupère les tickets de l'utilisateur depuis le store ---
  const { userTickets } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Si c'est un admin, on charge les compteurs admin
    if (user?.role === 'admin' || user?.role === 'superAdmin') {
      dispatch(fetchNotificationCounts());
    }
    // --- AJOUT : Si c'est un utilisateur normal, on charge ses tickets ---
    if (user?.role === 'user') {
        dispatch(fetchUserTickets());
    }
  }, [dispatch, user]);
  
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

  const handleAdminNavClick = (type) => {
    if (counts[type] > 0) {
      dispatch(markAsRead(type));
    }
  };

  // --- AJOUT : On calcule le nombre de tickets non lus par l'utilisateur ---
  const unreadUserTickets = userTickets?.filter(ticket => !ticket.isReadByUser).length || 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #8A2387 30%, #E94057 90%)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BATIClean
          </Typography>
          {(user?.role === 'admin' || user?.role === 'superAdmin') && (
            <>
              <Button color="inherit" component={RouterLink} to="/admin/users" onClick={() => handleAdminNavClick('users')}>
                <Badge badgeContent={counts?.users} color="success">Utilisateurs</Badge>
              </Button>
              <Button color="inherit" component={RouterLink} to="/admin/services">Services</Button>
              <Button color="inherit" component={RouterLink} to="/admin/tickets" onClick={() => handleAdminNavClick('tickets')}>
                <Badge badgeContent={counts?.tickets} color="success">Tickets</Badge>
              </Button>
              <Button color="inherit" component={RouterLink} to="/admin/bookings" onClick={() => handleAdminNavClick('bookings')}>
                <Badge badgeContent={counts?.bookings} color="success">Réservations</Badge>
              </Button>
              <Button color="inherit" component={RouterLink} to="/admin/reclamations" onClick={() => handleAdminNavClick('reclamations')}>
                  <Badge badgeContent={counts?.reclamations} color="success">Réclamations</Badge>
              </Button>
            </>
          )}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            {/* --- AJOUT : On affiche la cloche de notification pour les utilisateurs normaux --- */}
            {user?.role === 'user' && (
                <IconButton color="inherit" component={RouterLink} to="/my-tickets" sx={{ mr: 1 }}>
                    <Badge badgeContent={unreadUserTickets} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            )}
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
              <MenuItem component={RouterLink} to="/my-tickets" onClick={handleClose}>Mes Tickets</MenuItem>
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