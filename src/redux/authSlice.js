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

        return response.data; // Renvoie { authToken }

    } catch (error) {

        // ... (ta gestion d'erreur est bonne, on la garde)

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

    isNewUser: false, // ✅ On ajoute ce champ important

  },

  reducers: {

    logout: (state) => {

      localStorage.removeItem('authToken');

      state.user = null;

      state.token = null;

      state.justReactivated = false;

      state.isNewUser = false; // On le réinitialise aussi

      state.error = null;

    },

    updateUserFromSocket: (state, action) => {

      // ... (ta logique est bonne, on la garde)

    },

    setJustReactivated: (state, action) => {

      state.justReactivated = action.payload;

    },

    setToken: (state, action) => {

      // ... (ta logique est bonne, on la garde)

    },

  },

  extraReducers: (builder) => {

    builder

      // Cas Pending (commun)

      .addCase(loginUser.pending, (state) => {

        state.loading = true;

        state.error = null;

      })

      .addCase(registerUser.pending, (state) => {

        state.loading = true;

        state.error = null;

      })



      // Cas Login Réussi

      .addCase(loginUser.fulfilled, (state, action) => {

        const { authToken } = action.payload;

        localStorage.setItem('authToken', authToken); // On sauvegarde le token

        state.loading = false;

        state.token = authToken;

        state.user = getUserFromToken(authToken);

        state.isNewUser = false; // Ce n'est pas un nouvel utilisateur

      })

     

      // ✅ LA CORRECTION PRINCIPALE EST ICI

      // Cas Inscription Réussie

      .addCase(registerUser.fulfilled, (state, action) => {

        const { authToken, isNewUser } = action.payload;

        localStorage.setItem('authToken', authToken); // On sauvegarde le token

        state.loading = false;

        state.token = authToken;

        state.user = getUserFromToken(authToken);

        state.isNewUser = isNewUser; // On note que c'est un nouvel utilisateur

      })

     

      // Cas Échec (commun)

      .addCase(loginUser.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload.message; // On stocke juste le message

        // Le reste de ta logique pour le cas "banni" est bonne

        if (action.payload.authToken) {

            state.token = action.payload.authToken;

            state.user = getUserFromToken(action.payload.authToken);

        }

      })

      .addCase(registerUser.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;

      });

  },

});



export const { logout, updateUserFromSocket, setJustReactivated, setToken } = authSlice.actions;

export default authSlice.reducer;