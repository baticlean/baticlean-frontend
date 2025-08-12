// src/redux/warningSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Thunk pour récupérer les avertissements non lus de l'utilisateur
export const fetchMyWarnings = createAsyncThunk(
  'warnings/fetchMyWarnings',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${API_URL}/api/warnings/my-warnings`, config);
      return response.data; // Renvoie la liste des avertissements
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Thunk pour "fermer" un avertissement
export const dismissWarning = createAsyncThunk(
  'warnings/dismissWarning',
  async (warningId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${API_URL}/api/warnings/${warningId}/dismiss`, null, config);
      return warningId; // On renvoie l'ID de l'avertissement fermé
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const warningSlice = createSlice({
  name: 'warnings',
  initialState: {
    items: [], // La liste de tous les avertissements non lus
    loading: false,
    error: null,
  },
  reducers: {
    // Action pour ajouter un avertissement reçu via WebSocket
    addWarningFromSocket: (state, action) => {
        // On vérifie qu'il n'est pas déjà dans la liste pour éviter les doublons
        if (!state.items.find(w => w._id === action.payload._id)) {
            state.items.unshift(action.payload); // On l'ajoute au début (le plus récent)
        }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyWarnings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyWarnings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // On met à jour la liste avec les avertissements reçus
      })
      .addCase(fetchMyWarnings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(dismissWarning.fulfilled, (state, action) => {
        // Quand un avertissement est fermé, on le retire de notre liste locale
        state.items = state.items.filter(warning => warning._id !== action.payload);
      });
  },
});

export const { addWarningFromSocket } = warningSlice.actions;
export default warningSlice.reducer;