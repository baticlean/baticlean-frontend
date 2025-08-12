// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import serviceReducer from './serviceSlice.js';
import adminReducer from './adminSlice.js';
import bookingReducer from './bookingSlice.js';
import ticketReducer from './ticketSlice.js';
import reclamationReducer from './reclamationSlice.js';
import notificationReducer from './notificationSlice.js';
import warningReducer from './warningSlice.js'; // ✅ 1. On importe notre nouveau reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
    bookings: bookingReducer,
    tickets: ticketReducer,
    reclamations: reclamationReducer,
    notifications: notificationReducer,
    admin: adminReducer,
    warnings: warningReducer, // ✅ 2. On l'ajoute à la liste
  },
});