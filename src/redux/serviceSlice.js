import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// --- ACTIONS EXISTANTES ---
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

// --- NOUVELLES ACTIONS ---

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

export const addComment = createAsyncThunk(
  'services/addComment',
  async ({ serviceId, text }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(`${API_URL}/api/services/${serviceId}/comment`, { text }, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateComment = createAsyncThunk(
  'services/updateComment',
  async ({ serviceId, commentId, text }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(`${API_URL}/api/services/${serviceId}/comments/${commentId}`, { text }, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'services/deleteComment',
  async ({ serviceId, commentId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.delete(`${API_URL}/api/services/${serviceId}/comments/${commentId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const likeComment = createAsyncThunk(
  'services/likeComment',
  async ({ serviceId, commentId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.patch(`${API_URL}/api/services/${serviceId}/comments/${commentId}/like`, null, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateServiceFromSocket: (state, action) => {
      const updatedService = action.payload;
      const index = state.items.findIndex(item => item._id === updatedService._id);
      if (index !== -1) {
        state.items[index] = updatedService;
      } else {
        state.items.unshift(updatedService);
      }
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
      .addCase(fetchServices.pending, (state) => { state.loading = true; })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createService.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateService.fulfilled, updateOneService)
      .addCase(deleteService.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(likeService.fulfilled, updateOneService)
      .addCase(addComment.fulfilled, updateOneService)
      .addCase(updateComment.fulfilled, updateOneService)
      .addCase(deleteComment.fulfilled, updateOneService)
      .addCase(likeComment.fulfilled, updateOneService);
  },
});

export const { updateServiceFromSocket } = serviceSlice.actions;
export default serviceSlice.reducer;