const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, hotel } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Please include all required fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const userData = { name, email, password, role };
  if (role === 'Hotel' && hotel) {
    userData.hotel = hotel;
  }

  const user = await User.create(userData);

  if (user) {
    // This is the critical part. We now add the booking info to the response.
    const responseData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    };

    if (user.role === 'Guest') {
      // In a real app, you would create a new booking here.
      // For now, we are mocking it.
      responseData.currentBooking = {
        hotelId: '689f2d4db675a49e5fddce01', // Use a real hotel ID from your DB
        roomNumber: '101', // Assign a default room number
      };
    } else if (user.role === 'Hotel') {
      responseData.hotel = user.hotel;
    }

    res.status(201).json(responseData);
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login a user
// @route   POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const responseData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    };

    if (user.role === 'Guest') {
      responseData.currentBooking = {
        hotelId: '689f2d4db675a49e5fddce01', // Use a real hotel ID from your DB
        roomNumber: '101',
      };
    } else if (user.role === 'Hotel') {
      responseData.hotel = user.hotel;
    }

    res.status(200).json(responseData);
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

module.exports = {
  registerUser,
  loginUser,
};