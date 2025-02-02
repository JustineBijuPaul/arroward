const express = require('express');
const router = express.Router();
const Manager = require('../models/Manager');
const Service = require('../models/Service');
const Area = require('../models/Area');
const auth = require('../middleware/adminAuth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Manager Management Routes
router.post('/managers', auth, async (req, res) => {
  try {
    const manager = new Manager(req.body);
    await manager.save();
    res.status(201).json(manager);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/managers', auth, async (req, res) => {
  try {
    const managers = await Manager.find().populate('assignedArea');
    res.json(managers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/managers/:id', auth, async (req, res) => {
  try {
    const manager = await Manager.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }
    res.json(manager);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Service Management Routes
router.post('/services', auth, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/services', auth, async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/services/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Area Management Routes
router.post('/areas', auth, async (req, res) => {
  try {
    const area = new Area(req.body);
    await area.save();
    res.status(201).json(area);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/areas', auth, async (req, res) => {
  try {
    const areas = await Area.find();
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/areas/:id', auth, async (req, res) => {
  try {
    const area = await Area.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!area) {
      return res.status(404).json({ error: 'Area not found' });
    }
    res.json(area);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Auth routes
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const admin = new Admin({
      name,
      email,
      password: hashedPassword
    });

    await admin.save();

    // Create JWT token with 6 hour expiration
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );

    // Return success response
    res.status(201).json({
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log('Admin not found with email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    console.log('Admin found:', admin);

    // Verify password
    const isValidPassword = await admin.comparePassword(password);
    console.log('Password validation result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Invalid password for email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token with 6 hour expiration
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );

    // Return success response
    res.json({
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.get('/health', async (req, res) => {
  console.log('Admin health check endpoint hit');
  res.json({ status: 'ok', message: 'Admin API is running' });
});

// Add this route to get user data
router.get('/auth/me', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({
      id: admin._id,
      name: admin.name,
      email: admin.email
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this near your other routes in admin.js
router.get('/stats/dashboard', auth, async (req, res) => {
  try {
    // Get counts from different collections
    const totalManagers = await Manager.countDocuments();
    const totalAreas = await Area.countDocuments();
    const totalServices = await Service.countDocuments();
    
    // Calculate total revenue (example calculation)
    const services = await Service.find();
    const totalRevenue = services.reduce((sum, service) => sum + service.price, 0);

    // Get recent activity
    const recentActivity = []; // You can populate this based on your needs

    // Get area distribution
    const areas = await Area.find();
    const areaDistribution = await Promise.all(
      areas.map(async (area) => ({
        areaName: area.name,
        serviceCount: await Service.countDocuments({ areaId: area._id })
      }))
    );

    // Get monthly revenue (example data)
    const monthlyRevenue = [
      { month: 'Jan', revenue: 0 },
      { month: 'Feb', revenue: 0 },
      // ... add more months as needed
    ];

    res.json({
      totalManagers,
      totalAreas,
      totalServices,
      totalRevenue,
      recentActivity,
      areaDistribution,
      monthlyRevenue
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

module.exports = router;