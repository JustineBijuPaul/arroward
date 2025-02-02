const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const authMiddleware = require('../middleware/auth');

// Route to get all job requests for a manager
router.get('/jobs', authMiddleware, managerController.getJobs);

// Route to accept a job request
router.post('/jobs/:jobId/accept', authMiddleware, managerController.acceptJob);

// Route to decline a job request
router.post('/jobs/:jobId/decline', authMiddleware, managerController.declineJob);

// Route to manage workers
router.post('/workers', authMiddleware, managerController.addWorker);
router.put('/workers/:workerId', authMiddleware, managerController.updateWorker);
router.delete('/workers/:workerId', authMiddleware, managerController.removeWorker);

// Route to assign workers to jobs
router.post('/jobs/:jobId/assign', authMiddleware, managerController.assignWorker);

// Route to update job status
router.put('/jobs/:jobId/status', authMiddleware, managerController.updateJobStatus);

module.exports = router;