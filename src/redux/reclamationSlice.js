import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
export const createReclamation = createAsyncThunk('reclamations/create', async (reclamationData, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(`${API_URL}/api/reclamations`, reclamationData, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});
// ✅ MODIFIÉ : Accepte un paramètre pour charger les archives
export const fetchAllReclamations = createAsyncThunk('reclamations/fetchAll', async (archived = false, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/api/reclamations?archived=${archived}`, config);
        // On retourne les données ET si elles sont archivées ou non
        return { reclamations: response.data, archived };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});
// Action pour archiver (anciennement "masquer")
export const hideReclamation = createAsyncThunk('reclamations/hide', async (reclamationId, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.patch(`${API_URL}/api/reclamations/${reclamationId}/hide`, null, config);
        return reclamationId;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});
// ✅ NOUVEAU : Action pour restaurer une réclamation
export const unhideReclamation = createAsyncThunk('reclamations/unhide', async (reclamationId, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.patch(`${API_URL}/api/reclamations/${reclamationId}/unhide`, null, config);
        return reclamationId;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

const reclamationSlice = createSlice({
    name: 'reclamations',
    initialState: {
        items: [],
        archivedItems: [], // ✅ Ajouté pour stocker les réclamations archivées
        loading: false,
        error: null,
    },
    reducers: {
        addReclamation: (state, action) => {
            state.items.unshift(action.payload);
        },
        removeReclamation: (state, action) => {
            state.items = state.items.filter(r => r._id !== action.payload._id);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createReclamation.pending, (state) => { state.loading = true; })
            .addCase(createReclamation.fulfilled, (state) => { state.loading = false; })
            .addCase(createReclamation.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            
            .addCase(fetchAllReclamations.pending, (state) => { state.loading = true; })
            .addCase(fetchAllReclamations.fulfilled, (state, action) => {
                state.loading = false;
                const { reclamations, archived } = action.payload;
                // On remplit le bon tableau en fonction du flag
                if (archived) {
                    state.archivedItems = reclamations;
                } else {
                    state.items = reclamations;
                }
            })
            .addCase(fetchAllReclamations.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(hideReclamation.fulfilled, (state, action) => {
                // On déplace l'élément de `items` vers `archivedItems`
                const reclamationId = action.payload;
                const index = state.items.findIndex(r => r._id === reclamationId);
                if (index > -1) {
                    const [reclamationToArchive] = state.items.splice(index, 1);
                    state.archivedItems.unshift(reclamationToArchive);
                }
            })
            .addCase(unhideReclamation.fulfilled, (state, action) => {
                // On déplace l'élément de `archivedItems` vers `items`
                const reclamationId = action.payload;
                const index = state.archivedItems.findIndex(r => r._id === reclamationId);
                if (index > -1) {
                    const [reclamationToRestore] = state.archivedItems.splice(index, 1);
                    state.items.unshift(reclamationToRestore);
                }
            });
    },
});
export const { addReclamation, removeReclamation } = reclamationSlice.actions;
export default reclamationSlice.reducer;