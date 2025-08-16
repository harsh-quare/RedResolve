const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const { initSocket } = require('./socket'); // Import the init function
const connectDB = require('./config/db');
const connectCloudinary = require('./config/cloudinary');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const fileUpload = require('express-fileupload');

// Route files
const ticketRoutes = require('./routes/ticketRoutes');
const userRoutes = require('./routes/userRoutes');
const hotelRoutes = require('./routes/hotelRoutes');

// Load environment variables
dotenv.config();
// Connect to the database & Cloudinary
connectDB();
connectCloudinary();

const app = express();
const server = http.createServer(app); // Create an HTTP server from the Express app

// Initialize Socket.IO using our new module
const io = initSocket(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

// Socket.IO Connection Logic (can stay here)
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinTicketRoom', (ticketId) => {
    socket.join(ticketId);
    console.log(`User ${socket.id} joined ticket room ${ticketId}`);
  });

  socket.on('joinHotelRoom', (hotelId) => {
    socket.join(hotelId);
    console.log(`User ${socket.id} joined hotel room ${hotelId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


// Mount the API routes
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hotels', hotelRoutes);

// Use the custom error middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
