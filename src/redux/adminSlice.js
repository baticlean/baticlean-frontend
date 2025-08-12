// src/redux/adminSlice.js (Corrigé)

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { emitWarnUser } from '../socket/socket.js';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (searchTerm = '', { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const url = searchTerm ? `${API_URL}/api/admin/users?search=${searchTerm}` : `${API_URL}/api/admin/users`;
        const response = await axios.get(url, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const updateUser = createAsyncThunk('admin/updateUser', async ({ userId, data }, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const endpoint = data.role ? 'role' : 'status';
        const response = await axios.patch(`${API_URL}/api/admin/users/${userId}/${endpoint}`, data, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

// Cette action est maintenant gérée par le nouveau système d'avertissement,
// mais on la garde au cas où tu en aurais besoin ailleurs.
export const notifyUserRestored = createAsyncThunk('admin/notifyRestored', async (userId, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.post(`${API_URL}/api/admin/users/${userId}/notify-restored`, null, config);
        return userId;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

// ✅ --- DÉBUT DE LA MODIFICATION ---
// L'action `warnUser` est maintenant plus intelligente
export const warnUser = createAsyncThunk(
  'admin/warnUser',
  // Elle attend maintenant un objet contenant userId, message, et les actions
  async ({ userId, message, actions }, { getState, rejectWithValue }) => {
    try {
      // Elle récupère l'admin actuellement connecté depuis le state Redux
      const { user: adminUser } = getState().auth;
      if (!adminUser) {
        throw new Error("Action non autorisée. Administrateur non connecté.");
      }

      // Elle envoie toutes les infos nécessaires au backend via le socket
      emitWarnUser({ 
        userId, 
        message, 
        actions,
        adminId: adminUser._id // On inclut l'ID de l'admin
      });

      return { success: true, userId };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);
// ✅ --- FIN DE LA MODIFICATION ---

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex(user => user._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(warnUser.fulfilled, (state, action) => {
                console.log('Avertissement envoyé avec succès via socket à', action.payload.userId);
            });
    },
});

export default adminSlice.reducer;