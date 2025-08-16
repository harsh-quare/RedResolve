const mongoose = require('mongoose');

const hotelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a hotel name'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Hotel', hotelSchema);