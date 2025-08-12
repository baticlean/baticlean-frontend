// frontend/src/redux/notificationSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

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

export const markTypeAsRead = createAsyncThunk(
  'notifications/markTypeAsRead',
  async (type, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${API_URL}/api/notifications/${type}/mark-as-read`, null, config);
      return type; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    counts: { users: 0, tickets: 0, bookings: 0, reclamations: 0 },
    // NOUVEL ÉTAT : pour gérer le point rouge sur la cloche du client
    hasNewTicketUpdate: false, 
    loading: false,
    error: null,
  },
  reducers: {
    setCounts: (state, action) => {
      state.counts = action.payload;
    },
    // NOUVELLE ACTION : pour allumer ou éteindre le point rouge
    setNewTicketUpdate: (state, action) => {
      state.hasNewTicketUpdate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationCounts.fulfilled, (state, action) => {
        state.counts = action.payload;
      })
      .addCase(markTypeAsRead.fulfilled, (state, action) => {
        const type = action.payload;
        if (state.counts.hasOwnProperty(type)) {
          state.counts[type] = 0;
        }
      });
  },
});

export const { setCounts, setNewTicketUpdate } = notificationSlice.actions;
export default notificationSlice.reducer;