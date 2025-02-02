const express = require('express');
const router = express.Router();

// GET all areas
router.get('/', (req, res) => {
    res.json({ message: 'Get all areas' });
});

// GET single area by ID
router.get('/:id', (req, res) => {
    res.json({ message: `Get area ${req.params.id}` });
});

// POST new area
router.post('/', (req, res) => {
    res.json({ message: 'Create new area' });
});

// PUT update area
router.put('/:id', (req, res) => {
    res.json({ message: `Update area ${req.params.id}` });
});

// DELETE area
router.delete('/:id', (req, res) => {
    res.json({ message: `Delete area ${req.params.id}` });
});

module.exports = router;
