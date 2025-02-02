const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  zipCodes: [{
    type: String,
    required: true
  }],
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  active: {
    type: Boolean,
    default: true
  }
});

areaSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Area', areaSchema); 