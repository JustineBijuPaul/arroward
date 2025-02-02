require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const managerRoutes = require('./routes/managerRoutes');
const areaRoutes = require('./routes/areaRoutes');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/database');
const adminRoutes = require('./routes/admin');
const corsOptions = require('./config/cors');

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io with merged CORS config
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:3000',  // client
      'http://localhost:3002'   // manager/admin
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Apply CORS before any other middleware
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes will be imported here
// app.get('/admin/health', (req, res) => {
//   console.log('Admin health check endpoint hit');
//   res.status(200).json({ status: 'ok' });
// });

// Configure routes
const router = express.Router();

// Remove these conflicting routes
// router.use('/admin/auth', authRoutes);
// router.use('/admin/areas', areaRoutes);
// router.use('/admin/managers', managerRoutes);
// router.use('/admin/health', healthRoutes);

// Mount routes in correct order
app.use('/api/admin', adminRoutes);  // Mount admin routes first
app.use('/api', router);             // Mount other routes after

// Add route logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Add debug logging for 404s
app.use((req, res, next) => {
  console.log(`[404] ${req.method} ${req.originalUrl}`);
  console.log('Available routes:', app._router.stack.map(r => r.route?.path).filter(Boolean));
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;