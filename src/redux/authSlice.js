// src/redux/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;

const getUserFromToken = (token) => {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    localStorage.removeItem('authToken');
    return null;
  }
};

export const loginUser = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/api/login`, userData);
        // On sauvegarde le token ici pour être sûr qu'il est présent avant la redirection
        localStorage.setItem('authToken', response.data.authToken);
        return response.data;
    } catch (error) {
        if (error.response) {
            const errorPayload = { 
                message: error.response.data.message || 'Erreur de connexion', 
                status: error.response.status,
                authToken: error.response.data.authToken 
            };
            return rejectWithValue(errorPayload);
        }
        return rejectWithValue({ message: 'Erreur réseau ou serveur indisponible.' });
    }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/api/register`, userData);
        // On sauvegarde aussi le token ici pour la connexion automatique
        if (response.data.authToken) {
            localStorage.setItem('authToken', response.data.authToken);
        }
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Erreur d'inscription");
    }
});

const initialToken = localStorage.getItem('authToken') || null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getUserFromToken(initialToken),
    token: initialToken,
    loading: false,
    error: null,
    justReactivated: false,
    isNewUser: false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('authToken');
      state.user = null;
      state.token = null;
      state.justReactivated = false;
      state.isNewUser = false;
      state.error = null;
    },
    // ✅ --- DÉBUT DE LA CORRECTION ---
    updateUserFromSocket: (state, action) => {
      const { user: updatedUser, newToken } = action.payload;
      // On vérifie que la mise à jour concerne bien l'utilisateur actuel
      if (state.user && state.user._id === updatedUser._id) {
        state.user = updatedUser; // On met à jour les infos de l'utilisateur
        
        // C'est la partie la plus importante : on met à jour le token !
        if (newToken) {
          state.token = newToken;
          localStorage.setItem('authToken', newToken);
        }
      }
    },
    // ✅ --- FIN DE LA CORRECTION ---
    setJustReactivated: (state, action) => {
      state.justReactivated = action.payload;
    },
    setToken: (state, action) => {
      const token = action.payload;
      state.token = token;
      localStorage.setItem('authToken', token);
      state.user = getUserFromToken(token);
      state.justReactivated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { 
        state.loading = true;
        state.error = null; 
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.authToken;
        state.user = getUserFromToken(action.payload.authToken);
        state.isNewUser = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message; 
        if (action.payload.authToken) {
            state.token = action.payload.authToken;
            state.user = getUserFromToken(action.payload.authToken);
        }
      })
      .addCase(registerUser.pending, (state) => { 
        state.loading = true;
        state.error = null; 
      })
      .addCase(registerUser.fulfilled, (state, action) => { 
        state.loading = false;
        const { authToken, isNewUser } = action.payload;
        state.token = authToken;
        state.user = getUserFromToken(authToken);
        state.isNewUser = isNewUser;
      })
      .addCase(registerUser.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      });
  },
});

export const { logout, updateUserFromSocket, setJustReactivated, setToken } = authSlice.actions;
export default authSlice.reducer;