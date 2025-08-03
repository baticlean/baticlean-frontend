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
  if (socket) {
    socket.emit('addUser', userId);
  }
};

export const onUserUpdate = (callback) => {
  if (socket) {
    socket.on('userUpdated', callback);
  }
};

export const offUserUpdate = () => {
  if (socket) {
    socket.off('userUpdated');
  }
};

// --- Fonctions pour les services ---
export const onServiceUpdate = (callback) => {
  if (socket) {
    socket.on('serviceUpdated', callback);
  }
};

export const offServiceUpdate = () => {
  if (socket) {
    socket.off('serviceUpdated');
  }
};

// --- NOUVELLES FONCTIONS POUR LES RÉSERVATIONS ---
export const onBookingUpdate = (callback) => {
  if (socket) {
    socket.on('bookingUpdated', callback);
  }
};

export const offBookingUpdate = () => {
  if (socket) {
    socket.off('bookingUpdated');
  }
};