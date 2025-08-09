
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// --- THUNKS ASYNCHRONES POUR LES APPELS API ---

export const fetchServices = createAsyncThunk(
  'services/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/services`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des services.');
    }
  }
);

export const createService = createAsyncThunk(
  'services/create',
  async (serviceData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(`${API_URL}/api/services`, serviceData, config);
      return response.data; // Le backend émettra un socket, donc la mise à jour sera globale
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateService = createAsyncThunk(
  'services/update',
  async ({ id, serviceData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(`${API_URL}/api/services/${id}`, serviceData, config);
      return response.data; // Le backend émettra un socket
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/api/services/${id}`, config);
      return id; // Le backend émettra un socket
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const likeService = createAsyncThunk(
  'services/like',
  async (serviceId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.patch(`${API_URL}/api/services/${serviceId}/like`, null, config);
      return response.data; // Le backend émettra un socket
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'services/addComment',
  async ({ serviceId, text }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(`${API_URL}/api/services/${serviceId}/comment`, { text }, config);
      return response.data; // Le backend émettra un socket
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ... (les autres thunks comme updateComment, deleteComment, likeComment sont parfaits et n'ont pas besoin de changer)
export const updateComment = createAsyncThunk('services/updateComment', async ({ serviceId, commentId, text }, { getState, rejectWithValue }) => { try { const { token } = getState().auth; const config = { headers: { Authorization: `Bearer ${token}` } }; const response = await axios.put(`${API_URL}/api/services/${serviceId}/comments/${commentId}`, { text }, config); return response.data; } catch (error) { return rejectWithValue(error.response?.data?.message); } });
export const deleteComment = createAsyncThunk('services/deleteComment', async ({ serviceId, commentId }, { getState, rejectWithValue }) => { try { const { token } = getState().auth; const config = { headers: { Authorization: `Bearer ${token}` } }; const response = await axios.delete(`${API_URL}/api/services/${serviceId}/comments/${commentId}`, config); return response.data; } catch (error) { return rejectWithValue(error.response?.data?.message); } });
export const likeComment = createAsyncThunk('services/likeComment', async ({ serviceId, commentId }, { getState, rejectWithValue }) => { try { const { token } = getState().auth; const config = { headers: { Authorization: `Bearer ${token}` } }; const response = await axios.patch(`${API_URL}/api/services/${serviceId}/comments/${commentId}/like`, null, config); return response.data; } catch (error) { return rejectWithValue(error.response?.data?.message); } });


const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  // Reducers pour les mises à jour en temps réel reçues par Socket.IO
  reducers: {
    updateServiceFromSocket: (state, action) => {
      const updatedService = action.payload;
      const index = state.items.findIndex(item => item._id === updatedService._id);
      if (index !== -1) {
        // Si le service existe, on le met à jour
        state.items[index] = updatedService;
      } else {
        // S'il est nouveau, on l'ajoute au début de la liste
        state.items.unshift(updatedService);
      }
    },
    // --- AJOUTÉ ICI ---
    // Reducer pour supprimer un service de la liste en temps réel
    removeServiceFromSocket: (state, action) => {
      const { _id: serviceId } = action.payload;
      state.items = state.items.filter(item => item._id !== serviceId);
    }
  },
  extraReducers: (builder) => {
    // Gère la mise à jour de l'état pour l'utilisateur qui a initié l'action
    const updateOneService = (state, action) => {
      const index = state.items.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    };

    builder
      .addCase(fetchServices.pending, (state) => { state.loading = true; })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Note: Les actions create/update/delete ne modifient plus directement l'état ici
      // car la mise à jour se fera via le reducer de socket pour tout le monde,
      // y compris l'initiateur, assurant une source unique de vérité.
      // On garde les thunks pour faire l'appel API, mais on peut retirer les `fulfilled` cases.
      // Pour la simplicité, on les laisse, ça ne cause pas de problème.
      .addCase(createService.fulfilled, (state, action) => {
        // Optionnel: peut être géré par `updateServiceFromSocket`
      })
      .addCase(updateService.fulfilled, (state, action) => {
        // Optionnel: peut être géré par `updateServiceFromSocket`
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        // Optionnel: peut être géré par `removeServiceFromSocket`
      })

      // Les actions sur les likes et commentaires doivent mettre à jour l'état immédiatement
      // pour une meilleure réactivité de l'interface utilisateur.
      .addCase(likeService.fulfilled, updateOneService)
      .addCase(addComment.fulfilled, updateOneService)
      .addCase(updateComment.fulfilled, updateOneService)
      .addCase(deleteComment.fulfilled, updateOneService)
      .addCase(likeComment.fulfilled, updateOneService);
  },
});

// Exporter les nouvelles actions pour les sockets
export const { updateServiceFromSocket, removeServiceFromSocket } = serviceSlice.actions;

export default serviceSlice.reducer;
