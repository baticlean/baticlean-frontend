// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import serviceReducer from './serviceSlice.js';
import adminReducer from './adminSlice.js';
import bookingReducer from './bookingSlice.js';
import ticketReducer from './ticketSlice.js';
import reclamationReducer from './reclamationSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
    admin: adminReducer,
    bookings: bookingReducer,
    tickets: ticketReducer,
    reclamations: reclamationReducer,
  },
});