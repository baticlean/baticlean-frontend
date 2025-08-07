import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

// Importer les actions des différents slices
import { updateUserFromSocket, setJustReactivated } from '../redux/authSlice.js';
import { updateBookingFromSocket, addBooking, removeBooking } from '../redux/bookingSlice.js';
import { addAdminTicket, removeAdminTicket, updateTicket } from '../redux/ticketSlice.js';
import { addReclamation, removeReclamation } from '../redux/reclamationSlice.js';
import { setCounts } from '../redux/notificationSlice.js';
// --- AJOUTÉ ICI ---
import { updateServiceFromSocket, removeServiceFromSocket } from '../redux/serviceSlice.js';

// Importer toutes les fonctions de connexion socket
import { 
  connectSocket, disconnectSocket, addUserSocket, 
  onUserUpdate, offUserUpdate, 
  onBookingUpdate, offBookingUpdate,
  onNewUserRegistered, offNewUserRegistered,
  onNewBooking, offNewBooking, 
  onBookingDeleted, offBookingDeleted,
  onNewTicket, offNewTicket, 
  onTicketDeleted, offTicketDeleted,
  onTicketUpdated, offTicketUpdated,
  onNewReclamation, offNewReclamation, 
  onReclamationDeleted, offReclamationDeleted,
  onNotificationCountsUpdated, offNotificationCountsUpdated,
  // --- AJOUTÉ ICI ---
  onServiceUpdate, offServiceUpdate,
  onServiceDeleted, offServiceDeleted // Assurez-vous que cette fonction existe dans votre `socket.js`
} from '../socket/socket.js';

const GlobalSocketListener = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const userStateRef = useRef(user);

  useEffect(() => { userStateRef.current = user; }, [user]);

  useEffect(() => {
    if (!token || !user?._id) return;
    
    connectSocket();
    addUserSocket(user._id);

    const isAdmin = userStateRef.current?.role?.includes('admin');

    // --- GESTION DES SERVICES (POUR TOUS LES UTILISATEURS) ---
    
    // Écoute les mises à jour (création, update, like, commentaire)
    const handleServiceUpdate = (updatedService) => {
      console.log('Socket received: serviceUpdated', updatedService);
      dispatch(updateServiceFromSocket(updatedService));
    };

    // Écoute les suppressions
    const handleServiceDelete = (deletedService) => {
      console.log('Socket received: serviceDeleted', deletedService);
      dispatch(removeServiceFromSocket(deletedService));
      toast.warn(`Le service "${deletedService.title || 'un service'}" a été supprimé.`);
    };

    onServiceUpdate(handleServiceUpdate);
    onServiceDeleted(handleServiceDelete);


    // --- AUTRES GESTIONS EXISTANTES ---
    const handleUserUpdate = (data) => { /* ... votre logique existante ... */ };
    const handleBookingUpdate = (data) => { /* ... votre logique existante ... */ };
    const handleNewUserRegistration = (data) => { /* ... votre logique existante ... */ };
    
    onUserUpdate(handleUserUpdate);
    onBookingUpdate(handleBookingUpdate);
    onNewUserRegistered(handleNewUserRegistration);
    onTicketUpdated((updatedTicket) => dispatch(updateTicket(updatedTicket)));
    onNotificationCountsUpdated((newCounts) => { if (isAdmin) { dispatch(setCounts(newCounts)); } });

    if (isAdmin) {
      onNewBooking((data) => dispatch(addBooking(data)));
      onBookingDeleted((data) => dispatch(removeBooking(data)));
      onNewTicket((data) => dispatch(addAdminTicket(data)));
      onTicketDeleted((data) => dispatch(removeAdminTicket(data)));
      onNewReclamation((data) => dispatch(addReclamation(data)));
      onReclamationDeleted((data) => dispatch(removeReclamation(data)));
    }

    // Fonction de nettoyage pour retirer les écouteurs
    return () => {
      // --- AJOUTÉ ICI ---
      offServiceUpdate();
      offServiceDeleted();

      // Nettoyage des autres écouteurs
      offUserUpdate();
      offBookingUpdate();
      offNewUserRegistered();
      offNewBooking();
      offBookingDeleted();
      offNewTicket();
      offTicketDeleted();
      offTicketUpdated();
      offNewReclamation();
      offReclamationDeleted();
      offNotificationCountsUpdated();
    };
  }, [token, user?._id, dispatch]);

  return null; // Ce composant n'affiche rien
};

export default GlobalSocketListener;
