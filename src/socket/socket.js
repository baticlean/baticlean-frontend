// Fichier : frontend/src/socket/socket.js

import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL;
let socket;

export const connectSocket = (userId) => {
  if (socket && socket.connected) {
    return;
  }
  if (socket) {
    socket.disconnect();
  }

  socket = io(API_URL, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('✅ Connecté au serveur WebSocket avec l\'ID:', socket.id);
    if (userId) {
      socket.emit('addUser', userId);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`🔌 Déconnecté du serveur WebSocket. Raison: ${reason}`);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// --- Fonctions génériques pour émettre des événements ---

/**
 * ✅ NOUVELLE FONCTION : Émet un événement pour marquer les messages comme lus.
 * @param {object} data - Contient le ticketId et le readerId.
 */
export const emitMarkMessagesAsRead = (data) => {
    if (socket) socket.emit('markMessagesAsRead', data);
};


// --- Fonctions pour l'utilisateur ---
export const addUserSocket = (userId) => {
  if (socket) socket.emit('addUser', userId);
};

export const onUserUpdate = (callback) => {
  if (socket) socket.on('userUpdated', callback);
};

export const offUserUpdate = () => {
  if (socket) socket.off('userUpdated');
};

export const onNewUserRegistered = (callback) => {
    if (socket) socket.on('newUserRegistered', callback);
};

export const offNewUserRegistered = () => {
    if (socket) socket.off('newUserRegistered');
};


// --- Fonctions pour les services ---
export const onServiceUpdate = (callback) => {
  if (socket) socket.on('serviceUpdated', callback);
};

export const offServiceUpdate = () => {
  if (socket) socket.off('serviceUpdated');
};

export const onNewService = (callback) => {
  if (socket) socket.on('newService', callback);
};

export const offNewService = () => {
  if (socket) socket.off('newService');
};

export const onServiceDeleted = (callback) => {
  if (socket) socket.on('serviceDeleted', callback);
};

export const offServiceDeleted = () => {
  if (socket) socket.off('serviceDeleted');
};


// --- Fonctions pour les réservations ---
export const onBookingUpdate = (callback) => {
  if (socket) socket.on('bookingUpdated', callback);
};

export const offBookingUpdate = () => {
  if (socket) socket.off('bookingUpdated');
};

export const onNewBooking = (callback) => {
  if (socket) socket.on('newBooking', callback);
};

export const offNewBooking = () => {
  if (socket) socket.off('newBooking');
};

export const onBookingDeleted = (callback) => {
  if (socket) socket.on('bookingDeleted', callback);
};

export const offBookingDeleted = () => {
  if (socket) socket.off('bookingDeleted');
};

export const onBookingStatusChanged = (callback) => {
    if (socket) socket.on('bookingStatusChanged', callback);
};

export const offBookingStatusChanged = () => {
    if (socket) socket.off('bookingStatusChanged');
};


// --- Fonctions pour les tickets ---
export const onNewTicket = (callback) => {
  if (socket) socket.on('newTicket', callback);
};

export const offNewTicket = () => {
  if (socket) socket.off('newTicket');
};

export const onTicketDeleted = (callback) => {
  if (socket) socket.on('ticketDeleted', callback);
};

export const offTicketDeleted = () => {
  if (socket) socket.off('ticketDeleted');
};

export const onTicketUpdated = (callback) => {
  if (socket) socket.on('ticketUpdated', callback);
};

export const offTicketUpdated = () => {
  if (socket) socket.off('ticketUpdated');
};


// --- Fonctions pour les réclamations ---
export const onNewReclamation = (callback) => {
  if (socket) socket.on('newReclamation', callback);
};

export const offNewReclamation = () => {
  if (socket) socket.off('newReclamation');
};

export const onReclamationDeleted = (callback) => {
  if (socket) socket.on('reclamationDeleted', callback);
};

export const offReclamationDeleted = () => {
  if (socket) socket.off('reclamationDeleted');
};


// --- Fonctions pour les notifications générales ---
export const onNotificationCountsUpdated = (callback) => {
  if (socket) socket.on('notificationCountsUpdated', callback);
};

export const offNotificationCountsUpdated = () => {
  if (socket) socket.off('notificationCountsUpdated');
};

// ✅ --- NOUVELLES FONCTIONS POUR LES AVERTISSEMENTS ---

/**
 * Émis par l'admin pour envoyer un avertissement à un utilisateur.
 * @param {object} data - Doit contenir { userId, message }
 */
export const emitWarnUser = (data) => {
  if (socket) {
    socket.emit('admin:warn_user', data);
  }
};

/**
 * Écouté par le client pour recevoir un avertissement.
 * @param {function} callback - La fonction à exécuter avec le message reçu.
 */
export const onUserWarning = (callback) => {
    if (socket) {
        socket.on('user:receive_warning', (data) => {
            // On s'assure qu'on a bien un message avant de le passer
            if (data && data.message) {
                callback(data.message);
            }
        });
    }
};

/**
 * Nettoie l'écouteur d'avertissement.
 */
export const offUserWarning = () => {
    if (socket) {
        socket.off('user:receive_warning');
    }
};