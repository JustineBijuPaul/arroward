const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add pre-save middleware to check for duplicate emails
adminSchema.pre('save', async function(next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 8);
    }

    // Check for existing email if this is a new document or email is modified
    if (this.isNew || this.isModified('email')) {
      const existingAdmin = await this.constructor.findOne({ email: this.email.toLowerCase() });
      if (existingAdmin) {
        throw new Error('An admin with this email already exists');
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Add post-save error handling
adminSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('An admin with this email already exists'));
  } else {
    next(error);
  }
});

// Simplified comparePassword method
adminSchema.methods.comparePassword = async function(password) {
  console.log('Password comparison start');
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    console.log('Password match:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Password comparison error:', error);
    throw error;
  }
};

module.exports = mongoose.model('Admin', adminSchema);