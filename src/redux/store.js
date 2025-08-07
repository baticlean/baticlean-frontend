// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import serviceReducer from './serviceSlice.js';
import adminReducer from './adminSlice.js';
import bookingReducer from './bookingSlice.js';
import ticketReducer from './ticketSlice.js';
import reclamationReducer from './reclamationSlice.js';
import notificationReducer from './notificationSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
    bookings: bookingReducer, // AJOUTER
    tickets: ticketReducer, // AJOUTER
    reclamations: reclamationReducer, // AJOUTER
    notifications: notificationReducer,
    admin: adminReducer,
  },
});