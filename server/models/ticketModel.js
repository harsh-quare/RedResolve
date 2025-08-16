const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Correctly references the User model
      required: true,
    },
    senderType: {
      type: String,
      enum: ['Guest', 'Hotel'],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    mediaUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const TicketSchema = new Schema(
  {
    guest: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Correctly references the User model
      required: true,
    },
    hotel: {
      type: Schema.Types.ObjectId,
      ref: 'Hotel', // Correctly references the Hotel model
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Room Amenity', 'Housekeeping', 'Front Desk', 'Security', 'Other'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    mediaUrls: [{ type: String }],
    messages: [MessageSchema],
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', TicketSchema);