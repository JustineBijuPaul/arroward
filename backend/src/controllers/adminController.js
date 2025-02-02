const Manager = require('../models/Manager');

// Add a new manager
exports.addManager = async (req, res) => {
    try {
        const { name, email, area } = req.body;
        const newManager = new Manager({ name, email, area });
        await newManager.save();
        res.status(201).json({ message: 'Manager added successfully', manager: newManager });
    } catch (error) {
        res.status(500).json({ message: 'Error adding manager', error });
    }
};

// Update an existing manager
exports.updateManager = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedManager = await Manager.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedManager) {
            return res.status(404).json({ message: 'Manager not found' });
        }
        res.status(200).json({ message: 'Manager updated successfully', manager: updatedManager });
    } catch (error) {
        res.status(500).json({ message: 'Error updating manager', error });
    }
};

// Remove a manager
exports.removeManager = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedManager = await Manager.findByIdAndDelete(id);
        if (!deletedManager) {
            return res.status(404).json({ message: 'Manager not found' });
        }
        res.status(200).json({ message: 'Manager removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing manager', error });
    }
};

// Get all managers
exports.getAllManagers = async (req, res) => {
    try {
        const managers = await Manager.find();
        res.status(200).json(managers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching managers', error });
    }
};