import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createTicket = createAsyncThunk('tickets/create', async (ticketData, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(`${API_URL}/api/tickets`, ticketData, config);
        return response.data;
    } catch (error) { return rejectWithValue(error.response.data.message); }
});

export const fetchAllTickets = createAsyncThunk('tickets/fetchAll', async (_, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/api/tickets`, config);
        return response.data;
    } catch (error) { return rejectWithValue(error.response.data.message); }
});

export const fetchUserTickets = createAsyncThunk('tickets/fetchUser', async (_, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/api/tickets/my-tickets`, config);
        return response.data;
    } catch (error) { return rejectWithValue(error.response.data.message); }
});

export const addMessageToTicket = createAsyncThunk('tickets/addMessage', async ({ ticketId, text }, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(`${API_URL}/api/tickets/${ticketId}/messages`, { text }, config);
        return response.data;
    } catch (error) { return rejectWithValue(error.response.data.message); }
});

export const markTicketAsRead = createAsyncThunk('tickets/markAsRead', async (ticketId, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.patch(`${API_URL}/api/tickets/${ticketId}/mark-as-read`, null, config);
        return response.data;
    } catch (error) { return rejectWithValue(error.response.data.message); }
});

export const claimTicket = createAsyncThunk('tickets/claim', async (ticketId, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.patch(`${API_URL}/api/tickets/${ticketId}/claim`, null, config);
        return response.data;
    } catch (error) { return rejectWithValue(error.response.data.message); }
});

export const hideTicket = createAsyncThunk('tickets/hide', async (ticketId, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.patch(`${API_URL}/api/tickets/${ticketId}/hide`, null, config);
        return ticketId;
    } catch (error) { return rejectWithValue(error.response.data.message); }
});

const ticketSlice = createSlice({
    name: 'tickets',
    initialState: {
        adminTickets: [],
        userTickets: [],
        loading: false,
        error: null,
    },
    reducers: {
        addAdminTicket: (state, action) => {
            state.adminTickets.unshift(action.payload);
        },
        removeAdminTicket: (state, action) => {
            state.adminTickets = state.adminTickets.filter(t => t._id !== action.payload._id);
        },
        updateTicket: (state, action) => {
            const updatedTicket = action.payload;
            const adminIndex = state.adminTickets.findIndex(t => t._id === updatedTicket._id);
            if (adminIndex !== -1) state.adminTickets[adminIndex] = updatedTicket;
            
            const userIndex = state.userTickets.findIndex(t => t._id === updatedTicket._id);
            if (userIndex !== -1) state.userTickets[userIndex] = updatedTicket;
        }
    },
    extraReducers: (builder) => {
        const handlePending = (state) => { state.loading = true; };
        const handleRejected = (state, action) => { state.loading = false; state.error = action.payload; };

        builder
            .addCase(fetchAllTickets.pending, handlePending)
            .addCase(fetchAllTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.adminTickets = action.payload;
            })
            .addCase(fetchAllTickets.rejected, handleRejected)
            
            .addCase(fetchUserTickets.pending, handlePending)
            .addCase(fetchUserTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.userTickets = action.payload;
            })
            .addCase(fetchUserTickets.rejected, handleRejected)
            
            .addCase(hideTicket.fulfilled, (state, action) => {
                state.adminTickets = state.adminTickets.filter(t => t._id !== action.payload);
            })
            .addCase(markTicketAsRead.fulfilled, (state, action) => {
                const updatedTicket = action.payload;
                const userIndex = state.userTickets.findIndex(t => t._id === updatedTicket._id);
                if (userIndex !== -1) state.userTickets[userIndex] = updatedTicket;
            })
            .addCase(addMessageToTicket.fulfilled, (state, action) => {
                const updatedTicket = action.payload;
                const adminIndex = state.adminTickets.findIndex(t => t._id === updatedTicket._id);
                if (adminIndex !== -1) state.adminTickets[adminIndex] = updatedTicket;
                
                const userIndex = state.userTickets.findIndex(t => t._id === updatedTicket._id);
                if (userIndex !== -1) state.userTickets[userIndex] = updatedTicket;
            })
            .addCase(claimTicket.fulfilled, (state, action) => {
                const updatedTicket = action.payload;
                const adminIndex = state.adminTickets.findIndex(t => t._id === updatedTicket._id);
                if (adminIndex !== -1) {
                    state.adminTickets[adminIndex] = updatedTicket;
                }
            });
    },
});

export const { addAdminTicket, removeAdminTicket, updateTicket } = ticketSlice.actions;
export default ticketSlice.reducer;