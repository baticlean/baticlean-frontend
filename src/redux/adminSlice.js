import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

import { emitWarnUser } from '../socket/socket.js'; // Assurez-vous que cet import est correct



const API_URL = import.meta.env.VITE_API_URL;



// On modifie fetchUsers pour accepter un terme de recherche

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



// Cette action peut être supprimée si "Avertir" la remplace complètement

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



// NOUVELLE ACTION POUR ENVOYER UN AVERTISSEMENT

export const warnUser = createAsyncThunk(

  'admin/warnUser',

  async ({ userId, message }, { rejectWithValue }) => {

    try {

      emitWarnUser({ userId, message });

      return { success: true, userId, message };

    } catch (error) {

      return rejectWithValue(error.toString());

    }

  }

);



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

            // On peut ajouter ici la gestion de l'action warnUser si nécessaire

            // Par exemple, pour afficher un indicateur de chargement.

            // Pour l'instant, nous le gérons avec toast.promise directement.

            .addCase(warnUser.fulfilled, (state, action) => {

                // Optionnel: faire quelque chose quand l'avertissement est envoyé avec succès

                console.log('Avertissement envoyé avec succès à', action.payload.userId);

            });

    },

});



export default adminSlice.reducer;