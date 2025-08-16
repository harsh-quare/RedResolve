const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel.js');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch the user from the database
      req.user = await User.findById(decoded.id).select('-password');
      
      console.log(req.user);
      
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next(); // Proceed to the next step (the ticket controller)
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const isHotelStaff = (req, res, next) => {
    if (req.user && req.user.role === 'Hotel') {
      next();
    } else {
      res.status(403).send('Not authorized as hotel staff');
    }
  };
  
const isGuest = (req, res, next) => {
      if (req.user && req.user.role === 'Guest') {
        next();
      } else {
        res.status(403).send('Not authorized as a guest');
      }
    };

module.exports = { protect, isHotelStaff, isGuest };