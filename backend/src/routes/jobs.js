const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticate } = require('../middleware/auth');

// Route to post a new job request
router.post('/', authenticate, jobController.postJob);

// Route to update an existing job request
router.put('/:jobId', authenticate, jobController.updateJob);

// Route to get all job requests for a client
router.get('/', authenticate, jobController.getAllJobs);

// Route to get a specific job request by ID
router.get('/:jobId', authenticate, jobController.getJobById);

// Route to track job status
router.get('/:jobId/status', authenticate, jobController.trackJobStatus);

module.exports = router;