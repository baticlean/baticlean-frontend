// src/components/GlobalSocketListener.jsx (Version Complète et Corrigée)

import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateUserFromSocket, setJustReactivated } from '../redux/authSlice.js';
import { updateServiceFromSocket, removeServiceFromSocket } from '../redux/serviceSlice.js';
import { updateBookingFromSocket, addBooking, removeBooking, fetchUserBookings } from '../redux/bookingSlice.js';
import { addAdminTicket, removeAdminTicket, updateTicket } from '../redux/ticketSlice.js';
import { addReclamation, removeReclamation } from '../redux/reclamationSlice.js';
import { setCounts, setNewTicketUpdate } from '../redux/notificationSlice.js';

import {
  connectSocket, disconnectSocket,
  onUserUpdate, offUserUpdate,
  onNewUserRegistered, offNewUserRegistered,
  onNewBooking, offNewBooking, onBookingDeleted, offBookingDeleted,
  onNewTicket, offNewTicket, onTicketDeleted, offTicketDeleted,
  onNewReclamation, offNewReclamation, onReclamationDeleted, offReclamationDeleted,
  onNotificationCountsUpdated, offNotificationCountsUpdated,
  onTicketUpdated, offTicketUpdated,
  onServiceUpdate, offServiceUpdate,
  onServiceDeleted, offServiceDeleted, // Assurez-vous que cet import est bien là
  onBookingStatusChanged, offBookingStatusChanged
} from '../socket/socket.js';

const GlobalSocketListener = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userStateRef = useRef(user);

  useEffect(() => {
    userStateRef.current = user;
  }, [user]);

  useEffect(() => {
    if (!token || !user?._id) {
      disconnectSocket();
      return;
    }
    
    connectSocket(user._id);

    const isAdmin = ['admin', 'superAdmin'].includes(userStateRef.current?.role);

    // --- ÉCOUTEURS GÉNÉRAUX (POUR TOUS LES UTILISATEURS) ---
    
    onUserUpdate((data) => {
      if (!data || !data.user) return;
      const { user: updatedUser, newToken } = data;
      const currentUser = userStateRef.current;
      if (currentUser && updatedUser._id === currentUser._id) {
        const oldState = currentUser;
        dispatch(updateUserFromSocket({ user: updatedUser, newToken }));
        if (['banned', 'suspended'].includes(updatedUser.status) && location.pathname !== '/banned') {
          toast.error("Votre compte a été suspendu ou banni.");
          navigate('/banned');
        }
        if (updatedUser.status === 'active' && oldState && ['banned', 'suspended'].includes(oldState.status)) {
          dispatch(setJustReactivated(true));
        }
        if (oldState && updatedUser.role !== oldState.role) {
          if (updatedUser.role.includes('admin')) {
            toast.success('🎉 Vous avez été promu Administrateur !');
          } else {
            toast.error('🔒 Vos droits administrateur ont été révoqués.');
            if (location.pathname.startsWith('/admin')) navigate('/home');
          }
        }
      }
    });

    onTicketUpdated((updatedTicket) => {
      const currentUser = userStateRef.current;
      if (!currentUser) return;
      dispatch(updateTicket(updatedTicket));
      if (currentUser.role === 'user' && (updatedTicket.user === currentUser._id || updatedTicket.user?._id === currentUser._id) && !updatedTicket.isReadByUser) {
        dispatch(setNewTicketUpdate(true));
      }
    });
    
    // ✅ ÉCOUTEURS DE SERVICES POUR TOUT LE MONDE (CLIENTS ET ADMINS)
    onServiceUpdate((data) => dispatch(updateServiceFromSocket(data)));
    onServiceDeleted((data) => dispatch(removeServiceFromSocket(data)));


    // --- ÉCOUTEURS SPÉCIFIQUES ---

    if (isAdmin) {
      // Écouteurs pour les admins uniquement
      onNewUserRegistered((data) => toast.info(`👋 ${data.username} a rejoint BATIClean !`));
      onNewBooking((data) => dispatch(addBooking(data)));
      onBookingDeleted((data) => dispatch(removeBooking(data)));
      onNewTicket((data) => dispatch(addAdminTicket(data)));
      onTicketDeleted((data) => dispatch(removeAdminTicket(data)));
      onNewReclamation((data) => dispatch(addReclamation(data)));
      onReclamationDeleted((data) => dispatch(removeReclamation(data)));
      onNotificationCountsUpdated((newCounts) => dispatch(setCounts(newCounts)));
    } else {
      // Écouteurs pour les clients uniquement
      onBookingStatusChanged((payload) => {
        toast.info(payload.message);
        dispatch(fetchUserBookings());
      });
    }

    // --- FONCTION DE NETTOYAGE ---
    return () => {
      offUserUpdate();
      offTicketUpdated();
      offServiceUpdate(); // On nettoie les écouteurs de service
      offServiceDeleted(); // On nettoie les écouteurs de service

      if (isAdmin) {
        offNewUserRegistered();
        offNewBooking();
        offBookingDeleted();
        offNewTicket();
        offTicketDeleted();
        offNewReclamation();
        offReclamationDeleted();
        offNotificationCountsUpdated();
      } else {
        offBookingStatusChanged();
      }
      disconnectSocket();
    };
  }, [token, user, dispatch, navigate, location]);

  return null;
};

export default GlobalSocketListener;