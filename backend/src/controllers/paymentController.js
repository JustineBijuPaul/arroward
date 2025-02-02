const Payment = require('../models/Payment');
const User = require('../models/User');
const Job = require('../models/Job');
const { processPayment, refundPayment } = require('../services/payment');

// Function to handle payment processing
exports.createPayment = async (req, res) => {
    try {
        const { userId, jobId, amount } = req.body;

        // Validate user and job
        const user = await User.findById(userId);
        const job = await Job.findById(jobId);

        if (!user || !job) {
            return res.status(404).json({ message: 'User or Job not found' });
        }

        // Process payment
        const payment = await processPayment(userId, jobId, amount);
        
        // Save payment details to the database
        const newPayment = new Payment({
            userId,
            jobId,
            amount,
            paymentId: payment.id,
            status: payment.status,
        });

        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to handle payment refunds
exports.refundPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;

        // Refund payment
        const refund = await refundPayment(paymentId);

        if (!refund) {
            return res.status(400).json({ message: 'Refund failed' });
        }

        res.status(200).json({ message: 'Refund successful', refund });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};