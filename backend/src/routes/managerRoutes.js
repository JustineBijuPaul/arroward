const express = require('express');
const router = express.Router();

// GET all managers
router.get('/', (req, res) => {
    res.json({ message: 'Get all managers' });
});

// GET single manager
router.get('/:id', (req, res) => {
    res.json({ message: `Get manager ${req.params.id}` });
});

// POST new manager
router.post('/', (req, res) => {
    res.json({ message: 'Create new manager' });
});

// PUT update manager
router.put('/:id', (req, res) => {
    res.json({ message: `Update manager ${req.params.id}` });
});

// DELETE manager
router.delete('/:id', (req, res) => {
    res.json({ message: `Delete manager ${req.params.id}` });
});

module.exports = router;
