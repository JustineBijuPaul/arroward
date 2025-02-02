const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['farm_maintenance', 'home_cleaning', 'house_painting', 'blight_removal', 'tree_services', 'other']
  },
  basePrice: {
    type: Number,
    required: true
  },
  priceUnit: {
    type: String,
    enum: ['per_hour', 'per_square_meter', 'per_job'],
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  requiredSkills: [{
    type: String
  }],
  estimatedDuration: {
    type: Number, // in hours
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', serviceSchema); 