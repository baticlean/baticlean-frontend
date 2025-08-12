// src/components/GlobalSocketListener.jsx (Corrigé)

import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { updateUserFromSocket, setJustReactivated } from '../redux/authSlice.js';
import { updateServiceFromSocket, removeServiceFromSocket } from '../redux/serviceSlice.js';
import { updateBookingFromSocket, addBooking, removeBooking, fetchUserBookings } from '../redux/bookingSlice.js';
import { addAdminTicket, removeAdminTicket, updateTicket } from '../redux/ticketSlice.js';
import { addReclamation, removeReclamation } from '../redux/reclamationSlice.js';
import { setCounts } from '../redux/notificationSlice.js';
// ✅ 1. On importe l'action pour récupérer nos avertissements
import { fetchMyWarnings } from '../redux/warningSlice.js';

import {
  connectSocket, disconnectSocket, addUserSocket,
  onUserUpdate, offUserUpdate,
  onNewUserRegistered, offNewUserRegistered,
  onNewBooking, offNewBooking, onBookingDeleted, offBookingDeleted,
  onNewTicket, offNewTicket, onTicketDeleted, offTicketDeleted,
  onNewReclamation, offNewReclamation, onReclamationDeleted, offReclamationDeleted,
  onNotificationCountsUpdated, offNotificationCountsUpdated,
  onTicketUpdated, offTicketUpdated,
  onServiceUpdate, offServiceUpdate,
  onServiceDeleted, offServiceDeleted,
  onBookingStatusChanged, offBookingStatusChanged,
  // ✅ 2. On importe le nouvel écouteur pour les avertissements
  onNewWarningReceived, offNewWarningReceived
} from '../socket/socket.js';

// Ce composant ne gère plus l'affichage, donc on peut retirer SpecialWarning
// import SpecialWarning from './SpecialWarning.jsx';

const GlobalSocketListener = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userStateRef = useRef(user);
  
  // ✅ On retire le state local, tout sera géré par Redux
  // const [warningMessage, setWarningMessage] = useState(null);

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

    // ✅ 3. On charge les avertissements existants dès que l'utilisateur est connecté
    dispatch(fetchMyWarnings());

    // --- ÉCOUTEURS GÉNÉRAUX (POUR TOUS LES UTILISATEURS) ---
    
    // ... (onUserUpdate, onTicketUpdated, etc. restent identiques)
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
      // ...
    });
    onServiceUpdate((data) => dispatch(updateServiceFromSocket(data)));
    onServiceDeleted((data) => dispatch(removeServiceFromSocket(data)));
    
    // --- ÉCOUTEURS SPÉCIFIQUES ---
    if (isAdmin) {
      // ... (Tous les écouteurs admin restent identiques)
    } else {
      // Écouteurs pour les clients uniquement
      onBookingStatusChanged((payload) => {
        toast.info(payload.message);
        dispatch(fetchUserBookings());
      });

      // ✅ 4. On écoute le signal du serveur pour les nouveaux avertissements
      // Quand on reçoit le signal, on redemande la liste complète à jour
      onNewWarningReceived(() => {
        console.log("🔔 Signal de nouvel avertissement reçu, on met à jour la liste.");
        dispatch(fetchMyWarnings());
      });
    }

    // --- FONCTION DE NETTOYAGE ---
    return () => {
      offUserUpdate();
      offTicketUpdated();
      offServiceUpdate();
      offServiceDeleted();

      if (isAdmin) {
        // ... (Tous les off... admin restent identiques)
      } else {
        offBookingStatusChanged();
        // ✅ 5. On nettoie notre nouvel écouteur
        offNewWarningReceived();
      }
      disconnectSocket();
    };
  }, [token, user, dispatch, navigate, location]);

  // ✅ 6. Ce composant devient invisible. Son seul rôle est d'écouter.
  return null;
};

export default GlobalSocketListener;