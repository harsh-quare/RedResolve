import { configureStore } from '@reduxjs/toolkit';
// We will create these reducer files next
import authReducer from '../features/auth/authSlice';
import ticketReducer from '../features/tickets/ticketSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
  },
});