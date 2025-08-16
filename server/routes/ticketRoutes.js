const express = require('express');
const router = express.Router();
const {
  createTicket,
  getGuestTickets,
  getHotelTickets,
  getTicket,
  addMessage,
  updateTicketStatus,
} = require('../controllers/ticketController');
const { protect, isGuest, isHotelStaff } = require('../middleware/authMiddleware');

// Guest specific routes
router.route('/').post(protect, isGuest, createTicket);
router.route('/guest').get(protect, isGuest, getGuestTickets);

// Hotel specific routes
router.route('/hotel').get(protect, isHotelStaff, getHotelTickets);
router.route('/:id/status').put(protect, isHotelStaff, updateTicketStatus);

// Shared routes (must be placed after more specific GET routes)
router.route('/:id').get(protect, getTicket);
router.route('/:id/messages').post(protect, addMessage);

module.exports = router;