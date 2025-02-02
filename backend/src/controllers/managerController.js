const Manager = require('../models/Manager');
const Job = require('../models/Job');
const Worker = require('../models/Worker');

// Accept a job request
exports.acceptJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const managerId = req.user.id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        job.manager = managerId;
        job.status = 'Accepted';
        await job.save();

        res.status(200).json({ message: 'Job accepted successfully', job });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting job', error });
    }
};

// Manage workers
exports.manageWorkers = async (req, res) => {
    try {
        const { action, workerId } = req.body;
        const managerId = req.user.id;

        if (action === 'add') {
            const newWorker = new Worker(req.body.workerData);
            await newWorker.save();
            return res.status(201).json({ message: 'Worker added successfully', newWorker });
        }

        if (action === 'update') {
            const updatedWorker = await Worker.findByIdAndUpdate(workerId, req.body.workerData, { new: true });
            return res.status(200).json({ message: 'Worker updated successfully', updatedWorker });
        }

        if (action === 'remove') {
            await Worker.findByIdAndDelete(workerId);
            return res.status(200).json({ message: 'Worker removed successfully' });
        }

        res.status(400).json({ message: 'Invalid action' });
    } catch (error) {
        res.status(500).json({ message: 'Error managing workers', error });
    }
};