// src/redux/notificationSlice.js (Version Ultra-Robuste)

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Thunk pour récupérer les compteurs de notifications
export const fetchNotificationCounts = createAsyncThunk(
  'notifications/fetchCounts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${API_URL}/api/notifications/counts`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Thunk pour marquer un type de notification comme lu
export const markTypeAsRead = createAsyncThunk(
  'notifications/markTypeAsRead',
  async (type, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${API_URL}/api/notifications/${type}/mark-as-read`, null, config);
      return type; // On renvoie le type qui a été marqué comme lu
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    // ✅ On s'assure que counts est TOUJOURS un objet
    counts: {},
    hasNewTicketUpdate: false,
    loading: false,
    error: null,
  },
  reducers: {
    setCounts: (state, action) => {
      // ✅ SÉCURITÉ : Si on reçoit null, on le transforme en objet vide
      state.counts = action.payload || {};
    },
    setNewTicketUpdate: (state, action) => {
      state.hasNewTicketUpdate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationCounts.fulfilled, (state, action) => {
        // ✅ SÉCURITÉ : On s'assure que counts est toujours un objet
        state.counts = action.payload || {};
      })
      .addCase(markTypeAsRead.fulfilled, (state, action) => {
        const type = action.payload;
        // ✅ SÉCURITÉ : On vérifie que counts existe avant de le modifier
        if (state.counts) {
          state.counts[type] = 0;
        }
      });
  },
});

export const { setCounts, setNewTicketUpdate } = notificationSlice.actions;
export default notificationSlice.reducer;