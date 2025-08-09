// src/layout/MainLayout.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice.js';
import { fetchNotificationCounts, markTypeAsRead, setNewTicketUpdate } from '../redux/notificationSlice.js';
import { fetchUserTickets } from '../redux/ticketSlice.js';
import { fetchUnreadBookingCount, markUserBookingsAsRead, resetUnreadBookingCount } from '../redux/bookingSlice.js';
import {
    AppBar, Toolbar, Typography, Box, Button, Fab,
    IconButton, Menu, MenuItem, Avatar, Badge
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import BuildIcon from '@mui/icons-material/Build';
import CampaignIcon from '@mui/icons-material/Campaign'; // Icône pour le bouton "Annonces"
import { motion } from 'framer-motion';
import Footer from '../components/Footer.jsx';
import AdminMenuModal from '../components/AdminMenuModal.jsx'; // On importe la nouvelle modale
import logo from '../assets/logo.png';

function MainLayout() {
    const { user } = useSelector((state) => state.auth);
    const { counts, hasNewTicketUpdate } = useSelector((state) => state.notifications);
    const { userTickets } = useSelector((state) => state.tickets);
    const { unreadCount: unreadBookingCount } = useSelector((state) => state.bookings);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [translateVisible, setTranslateVisible] = useState(false);
    
    // État pour la modale du menu admin
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);

    const initGoogleTranslate = () => {
        const container = document.getElementById('google_translate_element');
        if (window.google && container && !container.hasChildNodes()) {
             new window.google.translate.TranslateElement({
                pageLanguage: 'fr',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
            }, 'google_translate_element');
        }
    };

    useEffect(() => {
        window.googleTranslateElementInit = initGoogleTranslate;
        if (!document.getElementById('google-translate-script')) {
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);
    
    useEffect(() => {
        setTimeout(initGoogleTranslate, 150);
    }, [location.pathname]);

    useEffect(() => {
        if (user) {
            if (user.role?.includes('admin') || user.role?.includes('superAdmin')) {
                dispatch(fetchNotificationCounts());
            } else if (user.role === 'user') {
                dispatch(fetchUserTickets());
                dispatch(fetchUnreadBookingCount());
            }
        }
    }, [dispatch, user]);
    
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        handleClose();
    };

    const handleAdminNavClick = (type) => {
        // S'il y a un compteur pour ce type et qu'il est supérieur à 0, on le marque comme lu
        if (counts && counts[type] > 0) {
            dispatch(markTypeAsRead(type));
        }
    };

    const handleAvatarClick = (event) => {
        handleMenu(event);
        if (unreadBookingCount > 0) {
            dispatch(resetUnreadBookingCount());
            dispatch(markUserBookingsAsRead());
        }
    };
    
    const handleBellClick = () => {
        if (hasNewTicketUpdate) {
            dispatch(setNewTicketUpdate(false));
        }
        navigate('/my-tickets');
    };

    const unreadTicketCount = userTickets?.filter(ticket => !ticket.isReadByUser).length || 0;

    // Calcul du total des notifications pour le badge du bouton "📢"
    const totalAdminNotifications = useMemo(() => {
        if (!counts) return 0;
        return Object.values(counts).reduce((sum, count) => sum + (count || 0), 0);
    }, [counts]);

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AppBar position="sticky" sx={{ background: 'linear-gradient(45deg, #8A2387 30%, #E94057 90%)' }}>
                    <Toolbar>
                        <motion.div
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '16px', cursor: 'pointer' }}
                            onClick={() => navigate('/home')}
                            animate={{ rotate: 360 }}
                            transition={{
                                loop: Infinity,
                                duration: 4,
                                ease: "linear"
                            }}
                        >
                            <Avatar 
                                src={logo} 
                                alt="Logo BATIClean"
                                sx={{ width: 40, height: 40, mb: 0.5 }}
                            />
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', lineHeight: 1 }}>
                                BATIClean
                            </Typography>
                        </motion.div>
                        
                        <Box sx={{ flexGrow: 1 }} />

                        {/* On affiche le bouton "📢" qui remplace les autres boutons admin */}
                        {(user?.role === 'admin' || user?.role === 'superAdmin') && (
                            <IconButton color="inherit" onClick={() => setAdminMenuOpen(true)}>
                                <Badge badgeContent={totalAdminNotifications} color="error">
                                    <CampaignIcon />
                                </Badge>
                            </IconButton>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {user?.role === 'superAdmin' && (
                                <IconButton color="inherit" component={RouterLink} to="/admin/maintenance" title="Gérer la maintenance">
                                    <BuildIcon />
                                </IconButton>
                            )}
                            <IconButton sx={{ color: 'lightgreen' }} onClick={() => setTranslateVisible(prev => !prev)}>
                                <LanguageIcon />
                            </IconButton>
                            <Box sx={{ display: translateVisible ? 'block' : 'none', ml: 1 }}>
                                <div id="google_translate_element" />
                            </Box>

                            {user?.role === 'user' && (
                                <IconButton color="inherit" onClick={handleBellClick} sx={{ mr: 1, ml: 1 }}>
                                    <Badge  
                                        variant={hasNewTicketUpdate ? "dot" : "standard"}
                                        badgeContent={unreadTicketCount}  
                                        color={hasNewTicketUpdate ? "success" : "error"}
                                        sx={hasNewTicketUpdate ? { '& .MuiBadge-dot': { height: '12px', minWidth: '12px', borderRadius: '50%', border: '2px solid white' } } : {}}
                                    >
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                            )}

                            <IconButton color="inherit" component={RouterLink} to="/support-chat" sx={{ mr: 1 }}>
                                <SupportAgentIcon />
                            </IconButton>

                            <IconButton onClick={user?.role === 'user' ? handleAvatarClick : handleMenu} sx={{ p: 0 }}>
                                <Badge  
                                    badgeContent={user?.role === 'user' ? unreadBookingCount : 0}  
                                    color="error"  
                                    overlap="circular" 
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                >
                                    <Avatar src={user?.profilePicture} alt={user?.username} />
                                </Badge>
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
                
                <Box component="main" sx={{ flexGrow: 1, p: 3 }} key={location.pathname}>
                    <Outlet/>
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
            
            {/* On s'assure que la modale est bien appelée ici */}
            <AdminMenuModal 
                open={adminMenuOpen}
                onClose={() => setAdminMenuOpen(false)}
                counts={counts}
                handleNavClick={handleAdminNavClick}
            />
        </>
    );
}

export default MainLayout;