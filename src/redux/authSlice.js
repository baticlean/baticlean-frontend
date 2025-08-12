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
    console.error("Failed to decode token:", error);
    localStorage.removeItem('authToken');
    return null;
  }
};

export const loginUser = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/login`, userData);
    return response.data; // Renvoie { authToken }
  } catch (error) {
    if (error.response) {
      const errorPayload = {
        message: error.response.data.message || 'Erreur de connexion',
        status: error.response.status,
        authToken: error.response.data.authToken, // Pour le cas 'banni'
      };
      return rejectWithValue(errorPayload);
    }
    return rejectWithValue({ message: 'Erreur réseau ou serveur indisponible.' });
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/register`, userData);
    return response.data; // Renvoie { authToken, isNewUser }
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
      state.loading = false;
      state.error = null;
      state.justReactivated = false;
      state.isNewUser = false;
    },
    updateUserFromSocket: (state, action) => {
      const { user, newToken } = action.payload;
      state.user = user;
      if (newToken) {
        state.token = newToken;
        localStorage.setItem('authToken', newToken);
      }
    },
    setJustReactivated: (state, action) => {
      state.justReactivated = action.payload;
    },
    setToken: (state, action) => {
        state.token = action.payload;
        state.user = getUserFromToken(action.payload);
        localStorage.setItem('authToken', action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Pending
      .addMatcher(
        (action) => [loginUser.pending, registerUser.pending].includes(action.type),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // Rejected
      .addMatcher(
        (action) => [loginUser.rejected, registerUser.rejected].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.error = action.payload.message || action.payload;
          // Gère le cas où un utilisateur banni reçoit un token pour voir la page 'banned'
          if (action.payload?.authToken) {
            state.token = action.payload.authToken;
            state.user = getUserFromToken(action.payload.authToken);
          }
        }
      )
      // Login Fulfilled
      .addCase(loginUser.fulfilled, (state, action) => {
        const { authToken } = action.payload;
        localStorage.setItem('authToken', authToken);
        state.loading = false;
        state.token = authToken;
        state.user = getUserFromToken(authToken);
        state.isNewUser = false;
      })
      // Register Fulfilled
      .addCase(registerUser.fulfilled, (state, action) => {
        const { authToken, isNewUser } = action.payload;
        localStorage.setItem('authToken', authToken);
        state.loading = false;
        state.token = authToken;
        state.user = getUserFromToken(authToken);
        state.isNewUser = isNewUser;
      });
  },
});

export const { logout, updateUserFromSocket, setJustReactivated, setToken } = authSlice.actions;
export default authSlice.reducer;