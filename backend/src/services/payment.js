const Payment = require('../models/Payment');
const User = require('../models/User');
const { processPayment, refundPayment } = require('../utils/paymentGateway'); // Assume these are utility functions for payment processing

// Function to create a new payment
const createPayment = async (req, res) => {
    try {
        const { userId, amount, serviceId } = req.body;

        // Validate user and service
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Process payment through payment gateway
        const paymentResult = await processPayment(userId, amount, serviceId);
        if (!paymentResult.success) {
            return res.status(400).json({ message: 'Payment processing failed', error: paymentResult.error });
        }

        // Save payment details to the database
        const payment = new Payment({
            userId,
            amount,
            serviceId,
            status: 'completed',
            transactionId: paymentResult.transactionId,
        });

        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Function to refund a payment
const refundPaymentHandler = async (req, res) => {
    try {
        const { paymentId } = req.params;

        // Find payment record
        const payment = await Payment.findById(paymentId);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        // Process refund through payment gateway
        const refundResult = await refundPayment(payment.transactionId);
        if (!refundResult.success) {
            return res.status(400).json({ message: 'Refund processing failed', error: refundResult.error });
        }

        // Update payment status
        payment.status = 'refunded';
        await payment.save();
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    createPayment,
    refundPaymentHandler,
};