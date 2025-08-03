// src/redux/reclamationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createReclamation = createAsyncThunk(
  'reclamations/create',
  async (reclamationData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(`${API_URL}/api/reclamations`, reclamationData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchAllReclamations = createAsyncThunk(
  'reclamations/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${API_URL}/api/reclamations`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const reclamationSlice = createSlice({
  name: 'reclamations',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createReclamation.pending, (state) => { state.loading = true; })
      .addCase(createReclamation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createReclamation.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchAllReclamations.pending, (state) => { state.loading = true; })
      .addCase(fetchAllReclamations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllReclamations.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default reclamationSlice.reducer;