const express = require('express');
const router = express.Router();
const Manager = require('../models/Manager');
const Service = require('../models/Service');
const Area = require('../models/Area');
const auth = require('../middleware/adminAuth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Debug middleware for admin routes
router.use((req, res, next) => {
  console.log(`[Admin Route] ${req.method} ${req.originalUrl}`);
  next();
});

// Auth routes
router.post('/auth/register', async (req, res) => {
  console.log('Register route hit with original body:', {
    ...req.body,
    password: '[HIDDEN]'
  });
  
  try {
    // First check if we have swapped fields by looking at email format
    let { name, email, password } = req.body;
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    // Check if name contains email and email contains name
    if (emailRegex.test(name) && !emailRegex.test(email)) {
      // Fields are swapped, fix them
      const temp = name;
      name = email;
      email = temp;
    }

    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        message: 'Invalid data format',
        details: {
          name: 'Name is required and must be a non-empty string'
        }
      });
    }

    // Validate email
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format',
        details: 'Please enter a valid email address'
      });
    }

    // Validate password
    if (!password || password.length < 8) {
      return res.status(400).json({
        message: 'Invalid password',
        details: 'Password must be at least 8 characters long'
      });
    }

    // Normalize fields
    const normalizedData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    };

    console.log('Processing registration for:', {
      name: normalizedData.name,
      email: normalizedData.email,
      password: '[HIDDEN]'
    });

    // Check existing admin
    const existingAdmin = await Admin.findOne({ email: normalizedData.email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create and save admin
    const admin = new Admin(normalizedData);
    await admin.save();

    // Generate token
    const token = jwt.sign(
      { 
        id: admin._id,
        name: admin.name,
        email: admin.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );

    // Return success with complete user data
    res.status(201).json({
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role || 'admin',
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      details: error.message
    });
  }
});

router.post('/auth/login', async (req, res) => {
  console.log('Login attempt received:', req.body);
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find admin
    const admin = await Admin.findOne({ email }).select('+password');
    console.log('Admin found:', admin ? 'Yes' : 'No');

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    try {
      const isMatch = await admin.comparePassword(password);
      console.log('Password match:', isMatch);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Password comparison error:', error);
      return res.status(500).json({ message: 'Error during authentication' });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );

    // Send response
    res.json({
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role || 'admin',
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Add test route
router.get('/auth/test', async (req, res) => {
  res.json({ message: 'Auth routes are working' });
});

// Manager Management Routes
router.post('/managers', auth, async (req, res) => {
  try {
    // Check for existing manager first
    const existingManager = await Manager.findOne({ email: req.body.email.toLowerCase() });
    if (existingManager) {
      return res.status(400).json({ 
        error: 'Duplicate email',
        message: 'A manager with this email already exists' 
      });
    }

    // Create new manager without managerCode (it will be generated automatically)
    const manager = new Manager(req.body);
    await manager.save();

    // Fetch the complete manager data with populated fields
    const savedManager = await Manager.findById(manager._id)
      .populate('assignedArea');

    res.status(201).json(savedManager);
  } catch (error) {
    console.error('Manager creation error:', error);
    res.status(400).json({ 
      error: error.name,
      message: error.message 
    });
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
      { new: true, runValidators: true }
    );
    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }
    res.json(manager);
  } catch (error) {
    console.error('Error updating manager:', error);
    res.status(400).json({ error: error.message });
  }
});

// Add the DELETE endpoint for managers
router.delete('/managers/:id', auth, async (req, res) => {
  try {
    console.log('Attempting to delete manager:', req.params.id);
    
    const manager = await Manager.findByIdAndDelete(req.params.id);
    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    // You might want to perform additional cleanup here
    // For example, reassigning their areas, updating related records, etc.

    console.log('Manager deleted successfully:', req.params.id);
    res.json({ 
      message: 'Manager deleted successfully',
      deletedManager: manager
    });
  } catch (error) {
    console.error('Error deleting manager:', error);
    res.status(500).json({ 
      error: 'Failed to delete manager',
      details: error.message 
    });
  }
});

// Service Management Routes
router.get('/services', auth, async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/services', auth, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(400).json({ error: error.message });
  }
});

router.patch('/services/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/services/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: error.message });
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
    const updates = { ...req.body };
    
    // Format location data if provided
    if (updates.coordinates) {
      updates.location = {
        type: 'Point',
        coordinates: [
          parseFloat(updates.coordinates[0]),
          parseFloat(updates.coordinates[1])
        ]
      };
      delete updates.coordinates;
    }

    const area = await Area.findByIdAndUpdate(
      req.params.id,
      updates,
      { 
        new: true, 
        runValidators: true,
        // Return validation errors
        context: 'query'
      }
    );

    if (!area) {
      return res.status(404).json({ error: 'Area not found' });
    }

    // Format the response
    const response = {
      ...area.toObject(),
      coordinates: area.location?.coordinates || []
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating area:', error);
    res.status(400).json({ 
      error: error.name,
      message: error.message,
      details: error.errors 
    });
  }
});

// Delete area route
router.delete('/areas/:id', auth, async (req, res) => {
  try {
    // Check if the area exists
    const area = await Area.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Area not found' 
      });
    }

    // Check if area has any associated managers
    const hasManagers = await Manager.exists({ assignedArea: req.params.id });
    if (hasManagers) {
      return res.status(400).json({
        error: 'Constraint Error',
        message: 'Cannot delete area with assigned managers. Please reassign or remove managers first.'
      });
    }

    // Check if area has any associated services
    const hasServices = await Service.exists({ areaId: req.params.id });
    if (hasServices) {
      return res.status(400).json({
        error: 'Constraint Error',
        message: 'Cannot delete area with active services. Please remove services first.'
      });
    }

    // Delete the area
    await Area.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: 'Area deleted successfully',
      deletedId: req.params.id 
    });
  } catch (error) {
    console.error('Error deleting area:', error);
    res.status(400).json({ 
      error: error.name,
      message: error.message 
    });
  }
});

router.get('/health', (req, res) => {
  console.log('Admin health check endpoint hit');
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Admin API is running'
  });
});

// Add this route to get user data
router.get('/auth/me', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role || 'admin',
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
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
    const totalRevenue = services.reduce((sum, service) => sum + (service.price || 0), 0);

    // Get recent activity (last 5 items)
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

// Settings Management Routes
router.get('/settings', auth, async (req, res) => {
  try {
    // Fetch admin settings
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // You can customize what settings to return
    const settings = {
      profile: {
        name: admin.name,
        email: admin.email,
        createdAt: admin.createdAt
      },
      preferences: {
        // Add any user preferences here
        notifications: true,
        theme: 'light',
        language: 'en'
      },
      system: {
        // Add any system settings here
        timezone: 'UTC',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: '24h'
      }
    };

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ 
      error: 'Failed to fetch settings',
      details: error.message 
    });
  }
});

router.patch('/settings', auth, async (req, res) => {
  try {
    const allowedUpdates = ['name', 'email', 'preferences', 'system'];
    const updates = Object.keys(req.body);
    
    // Validate update fields
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Apply updates
    updates.forEach(update => {
      if (update === 'preferences' || update === 'system') {
        admin[update] = { ...admin[update], ...req.body[update] };
      } else {
        admin[update] = req.body[update];
      }
    });

    await admin.save();

    res.json({
      message: 'Settings updated successfully',
      settings: {
        profile: {
          name: admin.name,
          email: admin.email
        },
        preferences: admin.preferences,
        system: admin.system
      }
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ 
      error: 'Failed to update settings',
      details: error.message 
    });
  }
});

module.exports = router;