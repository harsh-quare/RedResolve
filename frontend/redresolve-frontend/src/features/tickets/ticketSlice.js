import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ticketService from './ticketService';

const initialState = {
  tickets: [],
  ticket: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Create new ticket
export const createTicket = createAsyncThunk('tickets/create', async (ticketData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await ticketService.createTicket(ticketData, token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get user tickets
export const getGuestTickets = createAsyncThunk('tickets/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await ticketService.getGuestTickets(token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get all tickets for a hotel
export const getHotelTickets = createAsyncThunk(
  'tickets/getHotelAll',
  async (_, thunkAPI) => {
    try {
      // Get the token from the auth state
      const token = thunkAPI.getState().auth.user.token;
      return await ticketService.getHotelTickets(token);
    } catch (error) {
      const message =
        (error.response?.data?.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update ticket status
export const updateTicketStatus = createAsyncThunk(
  'tickets/updateStatus',
  async ({ ticketId, status }, thunkAPI) => {
    try {
      // Get the token from the auth state
      const token = thunkAPI.getState().auth.user.token;
      return await ticketService.updateTicketStatus(ticketId, status, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// Get single ticket
export const getTicket = createAsyncThunk('tickets/get', async (ticketId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await ticketService.getTicket(ticketId, token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Add a message
export const addMessage = createAsyncThunk('tickets/addMessage', async ({ ticketId, text, media }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await ticketService.addMessage({ ticketId, text, media }, token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
   reducers: {
    reset: (state) => initialState,
    // Action to update the entire ticket object (for status changes)
    setTicket: (state, action) => {
      state.ticket = action.payload;
    },
    // Action to add a single new message to the existing array
    addNewMessage: (state, action) => {
      state.ticket.messages.push(action.payload);
    },
    // Action to add a ticket to the top of the list
    addNewTicketToList: (state, action) => {
      state.tickets.unshift(action.payload);
    },
    // Reducer to update a ticket in the main list
    updateTicketInList: (state, action) => {
      state.tickets = state.tickets.map((ticket) =>
        ticket._id === action.payload._id ? action.payload : ticket
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => { state.isLoading = true; })
      .addCase(createTicket.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getGuestTickets.pending, (state) => { state.isLoading = true; })
      .addCase(getGuestTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tickets = action.payload;
      })
      .addCase(getGuestTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTicket.pending, (state) => { state.isLoading = true; })
      .addCase(getTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ticket = action.payload;
      })
      .addCase(getTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addMessage.fulfilled, (state, action) => {
        state.ticket.messages = action.payload;
        })
      .addCase(getHotelTickets.fulfilled, (state, action) => {
        state.tickets = action.payload;
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Replace the ticket in the state with the updated one from the server
        state.ticket = action.payload;
      });
  },
});

export const { reset, setTicket, addNewMessage, addNewTicketToList, updateTicketInList } = ticketSlice.actions;
export default ticketSlice.reducer;