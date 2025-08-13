// src/components/GlobalSocketListener.jsx

import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { updateUserFromSocket, setJustReactivated } from '../redux/authSlice.js';
import { updateServiceFromSocket, removeServiceFromSocket } from '../redux/serviceSlice.js';
// ✅ On importe la bonne action depuis le slice
import { addBooking, removeBooking, updateBookingFromSocket, fetchUserBookings } from '../redux/bookingSlice.js';
import { addAdminTicket, removeAdminTicket, updateTicket } from '../redux/ticketSlice.js';
import { addReclamation, removeReclamation } from '../redux/reclamationSlice.js';
import { setCounts } from '../redux/notificationSlice.js';
import { fetchMyWarnings } from '../redux/warningSlice.js';

import {
  connectSocket, disconnectSocket,
  onUserUpdate, offUserUpdate,
  onNewUserRegistered, offNewUserRegistered,
  // ✅ On importe les fonctions de mise à jour de réservation
  onNewBooking, offNewBooking, onBookingDeleted, offBookingDeleted, onBookingUpdate, offBookingUpdate,
  onNewTicket, offNewTicket, onTicketDeleted, offTicketDeleted,
  onNewReclamation, offNewReclamation, onReclamationDeleted, offReclamationDeleted,
  onNotificationCountsUpdated, offNotificationCountsUpdated,
  onTicketUpdated, offTicketUpdated,
  onServiceUpdate, offServiceUpdate,
  onServiceDeleted, offServiceDeleted,
  onBookingStatusChanged, offBookingStatusChanged,
  onNewWarningReceived, offNewWarningReceived
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

    const isAdmin = user && ['admin', 'superAdmin'].includes(user.role);

    dispatch(fetchMyWarnings());

    onUserUpdate((data) => {
      if (!data || !data.user) return;
      const { user: updatedUser, newToken } = data;
      const currentUser = userStateRef.current;

      if (currentUser && updatedUser._id === currentUser._id) {
        const oldRole = currentUser.role;
        const oldStatus = currentUser.status;
        
        dispatch(updateUserFromSocket({ user: updatedUser, newToken }));

        if (['banned', 'suspended'].includes(updatedUser.status) && oldStatus !== updatedUser.status) {
          toast.error("Votre compte a été suspendu ou banni.");
          if (location.pathname !== '/banned') navigate('/banned');
        }
        
        if (updatedUser.status === 'active' && ['banned', 'suspended'].includes(oldStatus)) {
          dispatch(setJustReactivated(true));
        }

        if (updatedUser.role !== oldRole) {
          if (['admin', 'superAdmin'].includes(updatedUser.role)) {
            toast.success('🎉 Vous avez été promu Administrateur !');
          } else {
            toast.error('🔒 Vos droits administrateur ont été révoqués.');
            if (location.pathname.startsWith('/admin')) navigate('/home');
          }
        }
      }
    });
    
    onTicketUpdated((updatedTicket) => {
      dispatch(updateTicket(updatedTicket));
    });
    
    onServiceUpdate((data) => dispatch(updateServiceFromSocket(data)));
    onServiceDeleted((data) => dispatch(removeServiceFromSocket(data)));

    if (isAdmin) {
      onNewUserRegistered((data) => toast.info(`👋 ${data.username} a rejoint BATIClean !`));
      onNewBooking((data) => dispatch(addBooking(data)));
      onBookingDeleted((data) => dispatch(removeBooking(data)));
      onNewTicket((data) => dispatch(addAdminTicket(data)));
      onTicketDeleted((data) => dispatch(removeAdminTicket(data)));
      onNewReclamation((data) => dispatch(addReclamation(data)));
      onReclamationDeleted((data) => dispatch(removeReclamation(data)));
      onNotificationCountsUpdated((newCounts) => dispatch(setCounts(newCounts)));

      // ✅ CORRECTION APPORTÉE ICI : On place l'écouteur dans la section ADMIN
      onBookingUpdate((updatedBooking) => {
        dispatch(updateBookingFromSocket(updatedBooking));
      });

    } else {
      onBookingStatusChanged((payload) => {
        toast.info(payload.message);
        dispatch(fetchUserBookings());
      });

      onNewWarningReceived(() => {
        console.log("🔔 Signal de nouvel avertissement reçu, on met à jour la liste.");
        dispatch(fetchMyWarnings());
      });
    }

    return () => {
      // Nettoyage complet des listeners
      offUserUpdate();
      offTicketUpdated();
      offServiceUpdate();
      offServiceDeleted();
      offNewUserRegistered();
      offNewBooking();
      offBookingDeleted();
      // ✅ On nettoie le nouvel écouteur
      offBookingUpdate(); 
      offNewTicket();
      offTicketDeleted();
      offNewReclamation();
      offReclamationDeleted();
      offNotificationCountsUpdated();
      offBookingStatusChanged();
      offNewWarningReceived();
    };
  }, [token, user, dispatch, navigate, location]);

  return null;
};

export default GlobalSocketListener;