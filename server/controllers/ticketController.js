const asyncHandler = require('express-async-handler');
const Ticket = require('../models/ticketModel');
const User = require('../models/userModel'); // Import User model for checks
const fileUploadCloudinary = require('../utils/fileUploadCloudinary');
const { getIO } = require('../socket'); // Import the getIO function

// @desc    Create a new ticket
// @route   POST /api/tickets
exports.createTicket = asyncHandler(async (req, res) => {
  const { hotel, roomNumber, category, description } = req.body;
  const mediaUrls = [];

  if (req.files && req.files.media) {
    let mediaFiles = req.files.media;
    if (!Array.isArray(mediaFiles)) mediaFiles = [mediaFiles];
    for (const file of mediaFiles) {
      const url = await fileUploadCloudinary(file.tempFilePath, 'redresolve/tickets');
      if (url) mediaUrls.push(url);
    }
  }

  const ticket = await Ticket.create({
    guest: req.user._id,
    hotel,
    roomNumber,
    category,
    description,
    mediaUrls,
  });

  const newTicket = await Ticket.findById(ticket._id).populate('guest', 'name email');
  
  // Use getIO() to safely access the io instance
  const io = getIO();
  io.to(hotel).emit('newTicketCreated', newTicket);

  res.status(201).json(newTicket);
});

// @desc    Get tickets for the logged-in guest
// @route   GET /api/tickets/guest
exports.getGuestTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ guest: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(tickets);
});

// @desc    Get all tickets for a hotel
// @route   GET /api/tickets/hotel
exports.getHotelTickets = asyncHandler(async (req, res) => {
  if (!req.user.hotel) {
    res.status(400);
    throw new Error('User is not associated with a hotel.');
  }
  const tickets = await Ticket.find({ hotel: req.user.hotel })
    .populate('guest', 'name email')
    .sort({ createdAt: -1 });
  res.status(200).json(tickets);
});

// @desc    Get a single ticket
// @route   GET /api/tickets/:id
exports.getTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id).populate('messages.sender', 'name');
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }
  if (ticket.guest.toString() !== req.user.id && (req.user.role !== 'Hotel' || ticket.hotel.toString() !== req.user.hotel.toString())) {
    res.status(401);
    throw new Error('Not Authorized');
  }
  res.status(200).json(ticket);
});

// @desc    Add a message to a ticket
// @route   POST /api/tickets/:id/messages
exports.addMessage = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }
  const { text } = req.body;
  let mediaUrl = null;
  if (req.files && req.files.media) {
    mediaUrl = await fileUploadCloudinary(req.files.media.tempFilePath, 'redresolve/proofs');
  }
  const message = {
    text,
    mediaUrl,
    sender: req.user._id,
    senderType: req.user.role,
  };
  ticket.messages.push(message);
  await ticket.save();
  const newMessage = ticket.messages[ticket.messages.length - 1];
  await User.populate(newMessage, { path: 'sender', select: 'name' });

  // Use getIO() to safely access the io instance
  const io = getIO();
  io.to(req.params.id).emit('messageReceived', newMessage);

  res.status(201).json(ticket.messages);
});

// @desc    Update ticket status
// @route   PUT /api/tickets/:id/status
exports.updateTicketStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }
  if (ticket.hotel.toString() !== req.user.hotel.toString()) {
    res.status(401);
    throw new Error('User not authorized for this ticket');
  }
  ticket.status = status;
  if (status === 'Resolved') ticket.resolvedAt = Date.now();
  const updatedTicket = await ticket.save();
  // Use getIO() to safely access the io instance
  const io = getIO();
  io.to(req.params.id).emit('ticketUpdated', updatedTicket);

  res.status(200).json(updatedTicket);
});