import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
// ✅ On importe la nouvelle action pour ajouter un avertissement
import { updateUserFromSocket, setJustReactivated, addWarningFromSocket } from '../redux/authSlice.js';
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
  onServiceDeleted, offServiceDeleted,
  onBookingStatusChanged, offBookingStatusChanged,
  onUserWarning, offUserWarning
} from '../socket/socket.js';

// ❌ On retire l'import de SpecialWarning ici. Il sera dans App.jsx ou MainLayout.jsx

const GlobalSocketListener = () => {
    const { user, token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const userStateRef = useRef(user);

    // ❌ On supprime l'état local pour le message d'avertissement
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

        // --- ÉCOUTEURS GÉNÉRAUX ---
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
        
        onServiceUpdate((data) => dispatch(updateServiceFromSocket(data)));
        onServiceDeleted((data) => dispatch(removeServiceFromSocket(data)));

        // --- ÉCOUTEURS SPÉCIFIQUES ---
        if (isAdmin) {
            // Écouteurs pour les admins
            onNewUserRegistered((data) => toast.info(`👋 ${data.username} a rejoint BATIClean !`));
            onNewBooking((data) => dispatch(addBooking(data)));
            onBookingDeleted((data) => dispatch(removeBooking(data)));
            onNewTicket((data) => dispatch(addAdminTicket(data)));
            onTicketDeleted((data) => dispatch(removeAdminTicket(data)));
            onNewReclamation((data) => dispatch(addReclamation(data)));
            onReclamationDeleted((data) => dispatch(removeReclamation(data)));
            onNotificationCountsUpdated((newCounts) => dispatch(setCounts(newCounts)));
        } else {
            // Écouteurs pour les clients
            onBookingStatusChanged((payload) => {
                toast.info(payload.message);
                dispatch(fetchUserBookings());
            });

            // ✅ On écoute les avertissements et on met à jour l'état Redux
            onUserWarning((data) => {
                if (data && data.warning) {
                    dispatch(addWarningFromSocket(data.warning));
                }
            });
        }

        // --- FONCTION DE NETTOYAGE ---
        return () => {
            offUserUpdate();
            offTicketUpdated();
            offServiceUpdate();
            offServiceDeleted();

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
                offUserWarning();
            }
            disconnectSocket();
        };
    }, [token, user, dispatch, navigate, location]);

    // ✅ Ce composant n'affiche plus rien, il ne fait qu'écouter.
    return null;
};

export default GlobalSocketListener;
