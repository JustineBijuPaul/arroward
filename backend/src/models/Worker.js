const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        required: true,
    },
    paymentFrequency: {
        type: String,
        enum: ['weekly', 'bi-weekly', 'monthly'],
        required: true,
    },
    contactInfo: {
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
    },
    availability: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Worker', workerSchema);