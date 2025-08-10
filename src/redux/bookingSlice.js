import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// --- THUNKS ---

export const fetchUserBookings = createAsyncThunk('bookings/fetchUser', async (hidden = false, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/api/bookings/my-bookings?hidden=${hidden}`, config);
        return { bookings: response.data, hidden };
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

export const toggleHideBooking = createAsyncThunk('bookings/toggleHide', async ({ bookingId, hide }, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.patch(`${API_URL}/api/bookings/${bookingId}/toggle-hide`, { hide }, config);
        return { bookingId, hide };
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

export const createBooking = createAsyncThunk('bookings/create', async (bookingData, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(`${API_URL}/api/bookings`, bookingData, config);
        return response.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

export const fetchAllBookings = createAsyncThunk('bookings/fetchAll', async (hidden = false, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/api/bookings?hidden=${hidden}`, config);
        return { bookings: response.data, hidden };
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

export const updateBookingStatus = createAsyncThunk('bookings/updateStatus', async ({ bookingId, status }, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.patch(`${API_URL}/api/bookings/${bookingId}/status`, { status }, config);
        return response.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

export const cancelBooking = createAsyncThunk('bookings/cancel', async (bookingId, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.patch(`${API_URL}/api/bookings/${bookingId}/cancel`, null, config);
        return response.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

export const hideBooking = createAsyncThunk('bookings/hide', async (bookingId, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.patch(`${API_URL}/api/bookings/${bookingId}/hide`, null, config);
        return bookingId;
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

export const unhideBooking = createAsyncThunk('bookings/unhide', async (bookingId, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.patch(`${API_URL}/api/bookings/${bookingId}/unhide`, null, config);
        return bookingId;
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

export const fetchUnreadBookingCount = createAsyncThunk('bookings/fetchUnreadCount', async (_, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/api/bookings/my-unread-count`, config);
        return response.data.count;
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

// ✅ NOUVELLE ACTION
export const markOneBookingAsRead = createAsyncThunk('bookings/markOneAsRead', async (bookingId, { getState, rejectWithValue }) => {
    try {
        const { token } = getState().auth;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        // On ne se soucie pas de la réponse, on veut juste que le backend fasse le travail
        await axios.patch(`${API_URL}/api/bookings/${bookingId}/mark-as-read-by-user`, null, config);
        return bookingId; // On retourne l'ID pour savoir quelle réservation mettre à jour dans le state
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});


// --- SLICE ---

const bookingSlice = createSlice({
    name: 'bookings',
    initialState: {
        userBookings: [],
        hiddenUserBookings: [],
        allBookings: [],
        hiddenAdminBookings: [],
        loading: false,
        error: null,
        unreadCount: 0,
    },
    reducers: {
        updateBookingFromSocket: (state, action) => {
            const updatedBooking = action.payload;
            const updateUserList = (list) => list.map(b => b._id === updatedBooking._id ? updatedBooking : b);
            state.userBookings = updateUserList(state.userBookings);
            state.hiddenUserBookings = updateUserList(state.hiddenUserBookings);
            state.allBookings = updateUserList(state.allBookings);
            state.hiddenAdminBookings = updateUserList(state.hiddenAdminBookings);
        },
        addBooking: (state, action) => {
            state.allBookings.unshift(action.payload);
        },
        removeBooking: (state, action) => {
            state.allBookings = state.allBookings.filter(b => b._id !== action.payload._id);
            state.hiddenAdminBookings = state.hiddenAdminBookings.filter(b => b._id !== action.payload._id);
        },
        resetUnreadBookingCount: (state) => {
            state.unreadCount = 0;
        }
    },
    extraReducers: (builder) => {
        const updateOneUserBooking = (state, action) => {
            const bookingId = action.payload._id || action.payload;
            const list = state.userBookings.find(b => b._id === bookingId) ? state.userBookings : state.hiddenUserBookings;
            const index = list.findIndex(b => b._id === bookingId);
            if (index !== -1) {
                // Pour markOneBookingAsRead, on met juste à jour le champ `isReadByUser`
                if (action.type === markOneBookingAsRead.fulfilled.type) {
                    list[index].isReadByUser = true;
                } else {
                    list[index] = action.payload;
                }
            }
        };
        builder
            .addCase(createBooking.fulfilled, (state, action) => {
                state.userBookings.unshift(action.payload);
            })
            .addCase(fetchUserBookings.pending, (state) => { state.loading = true; })
            .addCase(fetchUserBookings.fulfilled, (state, action) => {
                state.loading = false;
                const { bookings, hidden } = action.payload;
                if (hidden) {
                    state.hiddenUserBookings = bookings;
                } else {
                    state.userBookings = bookings;
                }
                state.unreadCount = state.userBookings.filter(b => !b.isReadByUser).length;
            })
            .addCase(fetchUserBookings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            
            .addCase(fetchAllBookings.pending, (state) => { state.loading = true; })
            .addCase(fetchAllBookings.fulfilled, (state, action) => {
                state.loading = false;
                const { bookings, hidden } = action.payload;
                if (hidden) {
                    state.hiddenAdminBookings = bookings;
                } else {
                    state.allBookings = bookings;
                }
            })
            .addCase(fetchAllBookings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            
            .addCase(updateBookingStatus.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.allBookings.findIndex(b => b._id === updated._id);
                if (index !== -1) state.allBookings[index] = updated;
            })
            .addCase(cancelBooking.fulfilled, updateOneUserBooking)
            
            // ✅ ACTION LORSQUE LA NOUVELLE ACTION RÉUSSIT
            .addCase(markOneBookingAsRead.fulfilled, updateOneUserBooking)

            .addCase(hideBooking.fulfilled, (state, action) => {
                const bookingId = action.payload;
                const index = state.allBookings.findIndex(b => b._id === bookingId);
                if (index > -1) {
                    const [bookingToHide] = state.allBookings.splice(index, 1);
                    state.hiddenAdminBookings.unshift(bookingToHide);
                }
            })
            .addCase(unhideBooking.fulfilled, (state, action) => {
                const bookingId = action.payload;
                const index = state.hiddenAdminBookings.findIndex(b => b._id === bookingId);
                if (index > -1) {
                    const [bookingToRestore] = state.hiddenAdminBookings.splice(index, 1);
                    state.allBookings.unshift(bookingToRestore);
                }
            })
            
            .addCase(toggleHideBooking.fulfilled, (state, action) => {
                const { bookingId, hide } = action.payload;
                if (hide) {
                    const index = state.userBookings.findIndex(b => b._id === bookingId);
                    if (index > -1) {
                        const [bookingToHide] = state.userBookings.splice(index, 1);
                        state.hiddenUserBookings.unshift(bookingToHide);
                    }
                } else {
                    const index = state.hiddenUserBookings.findIndex(b => b._id === bookingId);
                    if (index > -1) {
                        const [bookingToShow] = state.hiddenUserBookings.splice(index, 1);
                        state.userBookings.unshift(bookingToShow);
                    }
                }
            })
            .addCase(fetchUnreadBookingCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload;
            });
    },
});

export const { updateBookingFromSocket, addBooking, removeBooking, resetUnreadBookingCount } = bookingSlice.actions;
export default bookingSlice.reducer;