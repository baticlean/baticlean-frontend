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

// ✅ NOUVELLE ACTION POUR RÉCUPÉRER UN TICKET COMPLET PAR SON ID
export const fetchTicketById = createAsyncThunk('tickets/fetchById', async (ticketId, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/api/tickets/${ticketId}`, config);
        return response.data; // Le backend doit renvoyer les champs 'user' et 'assignedAdmin' remplis (populated)
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
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

export const claimTicket = createAsyncThunk('tickets/claim', async (ticketId, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.patch(`${API_URL}/api/tickets/${ticketId}/claim`, null, config);
        if (response.data.ticket) {
            return { ticket: response.data.ticket, overrideMessage: response.data.overrideMessage };
        } else {
            return { ticket: response.data, overrideMessage: undefined };
        }
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
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
        selectedTicket: null, // ✅ On ajoute un état pour le ticket ouvert
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
            if (state.selectedTicket?._id === updatedTicket._id) {
                state.selectedTicket = updatedTicket;
            }
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
            // ✅ NOUVEAUX REDUCERS POUR GÉRER LE TICKET SÉLECTIONNÉ
            .addCase(fetchTicketById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTicketById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTicket = action.payload;
            })
            .addCase(fetchTicketById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.selectedTicket = null; // En cas d'erreur, on vide le ticket
            })
            .addMatcher(
                (action) => [
                    addMessageToTicket.fulfilled.type, 
                    claimTicket.fulfilled.type,
                    markTicketAsRead.fulfilled.type, 
                    editMessage.fulfilled.type, 
                    deleteMessage.fulfilled.type,
                    reactToMessage.fulfilled.type
                ].includes(action.type),
                (state, action) => {
                    const updatedTicket = action.payload.ticket || action.payload;
                    const updateList = (list) => list.map(t => {
                        return t._id === updatedTicket._id ? updatedTicket : t;
                    });
                    state.adminTickets = updateList(state.adminTickets);
                    state.userTickets = updateList(state.userTickets);
                    state.archivedAdminTickets = updateList(state.archivedAdminTickets);
                    state.archivedUserTickets = updateList(state.archivedUserTickets);
                    
                    // ✅ CORRECTION CRUCIALE : On met aussi à jour le ticket sélectionné
                    if (state.selectedTicket?._id === updatedTicket._id) {
                        state.selectedTicket = updatedTicket;
                    }
                }
            );
    },
});

export const { addAdminTicket, removeAdminTicket, updateTicket, processTicketArchive } = ticketSlice.actions;
export default ticketSlice.reducer; 