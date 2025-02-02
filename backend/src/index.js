const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Make sure this path is correct

const app = express();

// Basic middleware
app.use(express.json());

// Simple CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// Debug route to test if server is working
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Mount auth routes
app.use('/auth', authRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 