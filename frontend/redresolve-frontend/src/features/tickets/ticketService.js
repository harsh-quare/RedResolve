import axios from 'axios';

const API_URL = '/api/tickets/';

// Create new ticket
const createTicket = async (ticketData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  };
  const formData = new FormData();
  formData.append('hotel', ticketData.hotel);
  formData.append('roomNumber', ticketData.roomNumber);
  formData.append('category', ticketData.category);
  formData.append('description', ticketData.description);
  if (ticketData.media && ticketData.media.length > 0) {
    for (let i = 0; i < ticketData.media.length; i++) {
      formData.append('media', ticketData.media[i]);
    }
  }
  const response = await axios.post(API_URL, formData, config);
  return response.data;
};

// Get all tickets for a guest
const getGuestTickets = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + 'guest', config);
  return response.data;
};

// Get a single ticket
const getTicket = async (ticketId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + ticketId, config); // Assuming backend route is /api/tickets/:id
  return response.data;
};

// Add a message to a ticket
const addMessage = async ({ ticketId, text, media }, token) => {
  const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
  const formData = new FormData();
  formData.append('text', text);
  if (media) {
    formData.append('media', media);
  }
  const response = await axios.post(`${API_URL}${ticketId}/messages`, formData, config);
  return response.data;
};

// Update ticket status (for hotel staff)
const updateStatus = async ({ ticketId, status }, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}${ticketId}/status`, { status }, config);
  return response.data;
};

// Get all tickets for a hotel
const getHotelTickets = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + 'hotel', config);
  return response.data;
};

// Update ticket status
const updateTicketStatus = async (ticketId, status, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(API_URL + ticketId + '/status', { status }, config);
  return response.data;
};

const ticketService = {
  createTicket,
  getGuestTickets,
  getTicket,
  addMessage,
  updateStatus,
  getHotelTickets,
  updateTicketStatus,
};

export default ticketService;