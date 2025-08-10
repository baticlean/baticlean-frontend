// src/redux/ticketSlice.js (Mis à jour)

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// --- THUNKS ---

export const createTicket = createAsyncThunk('tickets/create', async (ticketData, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(`${API_URL}/api/tickets`, ticketData, config);
        return response.data;
    } catch (error) { return rejectWithValue(error.response.data.message); }
});

export const fetchAllTickets = createAsyncThunk('tickets/fetchAll', async (archived = false, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/api/tickets?archived=${archived}`, config);
        return { tickets: response.data, archived };
    } catch (error) { return rejectWithValue(error.response.data.message); }
});

export const fetchUserTickets = createAsyncThunk('tickets/fetchUser', async (archived = false, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/api/tickets/my-tickets?archived=${archived}`, config);
        return { tickets: response.data, archived };
    } catch (error) { return rejectWithValue(error.response.data.message); }
});

export const addMessageToTicket = createAsyncThunk('tickets/addMessage', async ({ ticketId, formData }, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(`${API_URL}/api/tickets/${ticketId}/messages`, formData, config);
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

// ✅ MODIFICATION ICI : Gérer la nouvelle réponse du backend
export const claimTicket = createAsyncThunk('tickets/claim', async (ticketId, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.patch(`${API_URL}/api/tickets/${ticketId}/claim`, null, config);
        
        // Le backend renvoie soit { ticket, overrideMessage }, soit le ticket seul.
        // On normalise la réponse pour avoir une structure constante.
        if (response.data.ticket) {
            return { ticket: response.data.ticket, overrideMessage: response.data.overrideMessage };
        } else {
            return { ticket: response.data, overrideMessage: undefined };
        }
    } catch (error) { 
        // L'erreur contient déjà le bon message ("Déjà pris par...")
        return rejectWithValue(error.response.data.message); 
    }
});


export const hideTicket = createAsyncThunk('tickets/hide', async (ticketId, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.patch(`${API_URL}/api/tickets/${ticketId}/hide`, null, config);
        return ticketId;
    } catch (error) { return rejectWithValue(error.response.data.message); }
});

export const archiveTicket = createAsyncThunk('tickets/archive', async ({ ticketId, archive }, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.patch(`${API_URL}/api/tickets/${ticketId}/archive`, { archive }, config);
        return { ticketId, archive };
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const editMessage = createAsyncThunk('tickets/editMessage', async ({ ticketId, messageId, text }, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.patch(`${API_URL}/api/tickets/${ticketId}/messages/${messageId}/edit`, { text }, config);
        return response.data;
    } catch (error) { return rejectWithValue(error.response.data.message); }
});

export const deleteMessage = createAsyncThunk('tickets/deleteMessage', async ({ ticketId, messageId }, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.delete(`${API_URL}/api/tickets/${ticketId}/messages/${messageId}`, config);
        return response.data;
    } catch (error) { return rejectWithValue(error.response.data.message); }
});

export const reactToMessage = createAsyncThunk('tickets/reactToMessage', async ({ ticketId, messageId, emoji }, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.patch(`${API_URL}/api/tickets/${ticketId}/messages/${messageId}/react`, { emoji }, config);
        return response.data;
    } catch (error) { return rejectWithValue(error.response.data.message); }
});

const ticketSlice = createSlice({
    name: 'tickets',
    initialState: {
        adminTickets: [],
        userTickets: [],
        archivedAdminTickets: [],
        archivedUserTickets: [],
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
            const updateList = (list) => list.map(t => t._id === updatedTicket._id ? updatedTicket : t);
            state.adminTickets = updateList(state.adminTickets);
            state.userTickets = updateList(state.userTickets);
            state.archivedAdminTickets = updateList(state.archivedAdminTickets);
            state.archivedUserTickets = updateList(state.archivedUserTickets);
        },
        processTicketArchive: (state, action) => {
            const { _id, archivedByUser, archivedByAdmin } = action.payload;
            const moveTicket = (source, destination, ticketId) => {
                const ticketIndex = source.findIndex(t => t._id === ticketId);
                if (ticketIndex > -1) {
                    const [ticket] = source.splice(ticketIndex, 1);
                    destination.unshift(ticket);
                }
            };
            
            if (archivedByAdmin !== undefined) {
                 if (archivedByAdmin) moveTicket(state.adminTickets, state.archivedAdminTickets, _id);
                 else moveTicket(state.archivedAdminTickets, state.adminTickets, _id);
            }
            if (archivedByUser !== undefined) {
                 if (archivedByUser) moveTicket(state.userTickets, state.archivedUserTickets, _id);
                 else moveTicket(state.archivedUserTickets, state.userTickets, _id);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTicket.fulfilled, (state, action) => {
                state.userTickets.unshift(action.payload);
            })
            .addCase(fetchAllTickets.fulfilled, (state, action) => {
                const { tickets, archived } = action.payload;
                if (archived) {
                    state.archivedAdminTickets = tickets;
                } else {
                    state.adminTickets = tickets;
                }
            })
            .addCase(fetchUserTickets.fulfilled, (state, action) => {
                const { tickets, archived } = action.payload;
                if (archived) {
                    state.archivedUserTickets = tickets;
                } else {
                    state.userTickets = tickets;
                }
            })
            .addCase(hideTicket.fulfilled, (state, action) => {
                state.adminTickets = state.adminTickets.filter(t => t._id !== action.payload);
            })
            .addCase(archiveTicket.fulfilled, (state, action) => {
                const { ticketId, archive } = action.payload;
                const moveTicket = (source, destination) => {
                    const ticketIndex = source.findIndex(t => t._id === ticketId);
                    if (ticketIndex > -1) {
                        const [ticketToMove] = source.splice(ticketIndex, 1);
                        destination.unshift(ticketToMove);
                    }
                };
                if (archive) {
                    moveTicket(state.adminTickets, state.archivedAdminTickets);
                    moveTicket(state.userTickets, state.archivedUserTickets);
                } else {
                    moveTicket(state.archivedAdminTickets, state.adminTickets);
                    moveTicket(state.archivedUserTickets, state.userTickets);
                }
            })
            .addMatcher(
                (action) => [
                    addMessageToTicket.fulfilled.type, 
                    claimTicket.fulfilled.type, // Action incluse ici
                    markTicketAsRead.fulfilled.type, 
                    editMessage.fulfilled.type, 
                    deleteMessage.fulfilled.type,
                    reactToMessage.fulfilled.type
                ].includes(action.type),
                (state, action) => {
                    // ✅ MODIFICATION ICI : Gérer le payload qui peut être { ticket } ou juste un ticket
                    const updatedTicket = action.payload.ticket || action.payload;
                    
                    const updateList = (list) => list.map(t => {
                        return t._id === updatedTicket._id ? { ...t, ...updatedTicket } : t;
                    });
                    state.adminTickets = updateList(state.adminTickets);
                    state.userTickets = updateList(state.userTickets);
                    state.archivedAdminTickets = updateList(state.archivedAdminTickets);
                    state.archivedUserTickets = updateList(state.archivedUserTickets);
                }
            );
    },
});

export const { addAdminTicket, removeAdminTicket, updateTicket, processTicketArchive } = ticketSlice.actions;
export default ticketSlice.reducer;