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

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
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
    counts: { users: 0, tickets: 0, bookings: 0, reclamations: 0 },
  },
  reducers: {
    setCounts: (state, action) => {
      state.counts = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationCounts.fulfilled, (state, action) => {
        state.counts = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const type = action.payload;
        if (state.counts[type]) {
          state.counts[type] = 0;
        }
      });
  },
});

export const { setCounts } = notificationSlice.actions;
export default notificationSlice.reducer;