const express = require('express');
const router = express.Router();
const {
  applyJob,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationById
} = require('../controllers/applicationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// ✅ Specific routes FIRST
router.get('/myapplications', protect, authorizeRoles('jobseeker'), getMyApplications);
router.get('/job/:jobId', protect, authorizeRoles('employer'), getJobApplications);

// Job Seeker routes
router.post('/:jobId', protect, authorizeRoles('jobseeker'), applyJob);
router.delete('/:id', protect, authorizeRoles('jobseeker'), withdrawApplication);

// Employer routes
router.put('/:id/status', protect, authorizeRoles('employer'), updateApplicationStatus);

// ✅ Dynamic route LAST
router.get('/:id', protect, getApplicationById);

module.exports = router;