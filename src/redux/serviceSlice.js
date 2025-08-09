import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// --- THUNKS ASYNCHRONES POUR LES APPELS API ---

export const fetchServices = createAsyncThunk(
  'services/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/services`, { params: filters });
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
      return response.data;
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
      return response.data;
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
      return id;
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
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ====================================================================
// ✅ LA CORRECTION EST ICI
// ====================================================================
export const addComment = createAsyncThunk(
  'services/addComment',
  // 1. On récupère `parentId` depuis l'objet dispatché (avec `null` comme valeur par défaut)
  async ({ serviceId, text, parentId = null }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // 2. On prépare le corps de la requête avec `text` ET `parentId`
      const body = { text, parentId };

      // 3. On envoie le corps complet à l'API. La réponse de l'API doit être 
      //    l'objet SERVICE entièrement mis à jour.
      const response = await axios.post(`${API_URL}/api/services/${serviceId}/comment`, body, config);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
// ====================================================================

export const updateComment = createAsyncThunk('services/updateComment', async ({ serviceId, commentId, text }, { getState, rejectWithValue }) => { try { const { token } = getState().auth; const config = { headers: { Authorization: `Bearer ${token}` } }; const response = await axios.put(`${API_URL}/api/services/${serviceId}/comments/${commentId}`, { text }, config); return response.data; } catch (error) { return rejectWithValue(error.response?.data?.message); } });
export const deleteComment = createAsyncThunk('services/deleteComment', async ({ serviceId, commentId }, { getState, rejectWithValue }) => { try { const { token } = getState().auth; const config = { headers: { Authorization: `Bearer ${token}` } }; const response = await axios.delete(`${API_URL}/api/services/${serviceId}/comments/${commentId}`, config); return response.data; } catch (error) { return rejectWithValue(error.response?.data?.message); } });
export const likeComment = createAsyncThunk('services/likeComment', async ({ serviceId, commentId }, { getState, rejectWithValue }) => { try { const { token } = getState().auth; const config = { headers: { Authorization: `Bearer ${token}` } }; const response = await axios.patch(`${API_URL}/api/services/${serviceId}/comments/${commentId}/like`, null, config); return response.data; } catch (error) { return rejectWithValue(error.response?.data?.message); } });


const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    items: [],
    loading: false,
    error: null,
    filters: {
      search: '',
      category: '',
      sortBy: 'createdAt',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updateServiceFromSocket: (state, action) => {
      const updatedService = action.payload;
      const index = state.items.findIndex(item => item._id === updatedService._id);
      if (index !== -1) {
        state.items[index] = updatedService;
      } else {
        state.items.unshift(updatedService);
      }
    },
    removeServiceFromSocket: (state, action) => {
      const { _id: serviceId } = action.payload;
      state.items = state.items.filter(item => item._id !== serviceId);
    }
  },
  extraReducers: (builder) => {
    const updateOneService = (state, action) => {
      const index = state.items.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    };

    builder
      .addCase(fetchServices.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchServices.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })
      
      .addCase(createService.fulfilled, (state, action) => {
        // Géré par `updateServiceFromSocket`
      })
      .addCase(updateService.fulfilled, (state, action) => {
        // Géré par `updateServiceFromSocket`
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        // Géré par `removeServiceFromSocket`
      })
      
      .addCase(likeService.fulfilled, updateOneService)
      .addCase(addComment.fulfilled, updateOneService) // ✨ Cette ligne fonctionnera maintenant correctement
      .addCase(updateComment.fulfilled, updateOneService)
      .addCase(deleteComment.fulfilled, updateOneService)
      .addCase(likeComment.fulfilled, updateOneService);
  },
});

export const { setFilters, updateServiceFromSocket, removeServiceFromSocket } = serviceSlice.actions;

export default serviceSlice.reducer;

