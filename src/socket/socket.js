import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL;
let socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io(API_URL);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
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

// --- AJOUTÉES ICI ---
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