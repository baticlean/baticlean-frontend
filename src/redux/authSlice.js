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
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('authToken');
      state.user = null;
      state.token = null;
      state.justReactivated = false;
      state.error = null;
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
        // ==========================================================
        // LA CORRECTION EST ICI : CETTE LIGNE EST DÉSACTIVÉE
        // state.loading = true; //
        // ==========================================================
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
        if (action.payload.authToken) {
            state.token = action.payload.authToken;
            state.user = getUserFromToken(action.payload.authToken);
        }
      })
      .addCase(registerUser.pending, (state) => { 
        // On le désactive aussi pour l'inscription par cohérence
        // state.loading = true; //
        state.error = null; 
      })
      .addCase(registerUser.fulfilled, (state) => { state.loading = false; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logout, updateUserFromSocket, setJustReactivated, setToken } = authSlice.actions;
export default authSlice.reducer;