// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;
const initialToken = localStorage.getItem('authToken') || null;

const getUserFromToken = (token) => {
  if (token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Token invalide ou expiré');
      localStorage.removeItem('authToken');
      return null;
    }
  }
  return null;
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/login`, userData);
      localStorage.setItem('authToken', response.data.authToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de connexion');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/register`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur d\'inscription');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getUserFromToken(initialToken),
    token: initialToken,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('authToken');
    },
    updateUserFromSocket: (state, action) => {
      const { user: updatedUser, newToken } = action.payload;
      if (state.user && state.user._id === updatedUser._id) {
        state.user = { ...state.user, ...updatedUser };
        if (newToken) {
          state.token = newToken;
          localStorage.setItem('authToken', newToken);
        }
      }
    },
    setToken: (state, action) => {
      const token = action.payload;
      state.token = token;
      localStorage.setItem('authToken', token);
      state.user = getUserFromToken(token);
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, updateUserFromSocket, setToken } = authSlice.actions;
export default authSlice.reducer;