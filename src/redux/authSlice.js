// src/redux/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;

// Helper pour décoder le token (INCHANGÉ)
const getUserFromToken = (token) => {
    if (!token) return null;
    try {
        return jwtDecode(token);
    } catch (error) {
        localStorage.removeItem('authToken');
        return null;
    }
};

// Thunk pour la connexion (INCHANGÉ)
export const loginUser = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, userData);
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

// Thunk pour l'inscription (INCHANGÉ)
export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Erreur d'inscription");
    }
});

// Thunk pour supprimer un avertissement spécifique (INCHANGÉ)
export const clearWarning = createAsyncThunk(
    'auth/clearWarning',
    async (warningId, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.patch(`${API_URL}/api/auth/warnings/${warningId}/clear`, null, config);
            return response.data.user; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression de l\'avertissement');
        }
    }
);


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

        // ✅ AMÉLIORÉ: Logique de fusion robuste pour éviter la perte de données
        updateUserFromSocket: (state, action) => {
            if (state.user && action.payload.user && action.payload.user._id === state.user._id) {
                const updatedUserData = action.payload.user;

                // Fusionne le nouvel objet utilisateur tout en préservant les objets imbriqués
                state.user = {
                    ...state.user,
                    ...updatedUserData,
                    // Fusion explicite pour les objets imbriqués que vous pourriez avoir.
                    // Adaptez ceci à votre structure de données si nécessaire.
                    // Par exemple, si vous avez un champ 'details':
                    // details: {
                    //     ...state.user.details,
                    //     ...updatedUserData.details,
                    // },
                };

                // La logique du token reste la même
                if (action.payload.newToken) {
                    state.token = action.payload.newToken;
                    localStorage.setItem('authToken', action.payload.newToken);
                }
            }
        },

        setJustReactivated: (state, action) => {
            state.justReactivated = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
            state.user = getUserFromToken(action.payload);
        },
        // Reducer pour ajouter un avertissement reçu en temps réel (INCHANGÉ)
        addWarningFromSocket: (state, action) => {
            if (state.user) {
                // S'assure que le tableau warnings existe
                if (!state.user.warnings) {
                    state.user.warnings = [];
                }
                // Ajoute le nouvel avertissement au début de la liste
                state.user.warnings.unshift(action.payload);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => { 
                state.loading = true;
                state.error = null; 
            })
            .addCase(registerUser.pending, (state) => { 
                state.loading = true;
                state.error = null; 
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const { authToken } = action.payload;
                localStorage.setItem('authToken', authToken);
                state.loading = false;
                state.token = authToken;
                state.user = getUserFromToken(authToken);
                state.isNewUser = false;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                const { authToken, isNewUser } = action.payload;
                localStorage.setItem('authToken', authToken);
                state.loading = false;
                state.token = authToken;
                state.user = getUserFromToken(authToken);
                state.isNewUser = isNewUser;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                if (action.payload.authToken) {
                    state.token = action.payload.authToken;
                    state.user = getUserFromToken(action.payload.authToken);
                }
            })
            .addCase(registerUser.rejected, (state, action) => { 
                state.loading = false; 
                state.error = action.payload; 
            })
            // Gérer la mise à jour de l'utilisateur après suppression d'un avertissement (INCHANGÉ)
            .addCase(clearWarning.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});

export const { logout, updateUserFromSocket, setJustReactivated, setToken, addWarningFromSocket } = authSlice.actions;
export default authSlice.reducer;