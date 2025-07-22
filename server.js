// require('dotenv').config();
// const express = require('express');
// const database = require('./database');
// const router = require('./Routes/routers');
// const mongoose = require('mongoose');

// const app = express();

// // Initialize database connection
// database();

// // Middleware for parsing JSON
// app.use(express.json({ limit: '10mb' }));

// // Enable CORS (adjust origins as needed)
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

// // File upload handling (commented out for Vercel)
// // app.use('/uploadImages', express.static('uploadImages'));

// // Routes
// app.use('/auth', router);

// // Basic health check endpoint
// app.get('/health', (req, res) => {
//   const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
//   res.json({ status: 'running', db: dbStatus });
// });

// // Root endpoint
// app.get('/', (req, res) => {
//   res.send('Server is up and running!');
// });

// // Error handling
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ error: 'Internal Server Error y dhko '+err.message });
// });

// module.exports = app;
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectionDB = require('./db');
const Room = require('./models/Room');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Database connection
connectionDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms', error });
  }
});

app.delete('/api/rooms/:id', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room', error });
  }
});

// Socket.io signaling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('create-or-join-room', async (roomId) => {
    try {
      const room = await Room.findOne({ roomId });
      
      if (!room) {
        // Create new room
        const newRoom = new Room({ roomId });
        await newRoom.save();
        socket.join(roomId);
        socket.emit('created', roomId);
        console.log(`Room ${roomId} created by ${socket.id}`);
      } else {
        // Join existing room
        const clients = await io.in(roomId).fetchSockets();
        
        if (clients.length >= 2) {
          socket.emit('full', roomId);
          return;
        }
        
        socket.join(roomId);
        socket.emit('joined', roomId);
        io.to(roomId).emit('ready');
        console.log(`Client ${socket.id} joined room ${roomId}`);
      }
    } catch (error) {
      console.error('Error in create-or-join-room:', error);
      socket.emit('error', { message: 'Error joining room' });
    }
  });

  socket.on('message', (message) => {
    console.log('Message received:', message);
    socket.broadcast.to(message.roomId).emit('message', message);
  });

  socket.on('disconnect', async () => {
    console.log('Client disconnected:', socket.id);
    // Clean up empty rooms
    const rooms = await Room.find();
    for (const room of rooms) {
      const sockets = await io.in(room.roomId).fetchSockets();
      if (sockets.length === 0) {
        await Room.deleteOne({ roomId: room.roomId });
        console.log(`Room ${room.roomId} deleted (empty)`);
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});