const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Hotel = require('../models/hotelModel');

// @desc    Create a new hotel
// @route   POST /api/hotels
// @access  Public (for now, for easy creation)
router.post('/', asyncHandler(async (req, res) => {
    const { name, location } = req.body;

    if (!name || !location) {
        res.status(400);
        throw new Error('Please provide a name and location');
    }

    const hotel = await Hotel.create({ name, location });
    res.status(201).json(hotel);
}));

module.exports = router;