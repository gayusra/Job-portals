const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getEmployerJobs
} = require('../controllers/jobController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Private routes (Employer only)
router.post('/', protect, authorizeRoles('employer'), createJob);
router.put('/:id', protect, authorizeRoles('employer'), updateJob);
router.delete('/:id', protect, authorizeRoles('employer'), deleteJob);
router.get('/employer/myjobs', protect, authorizeRoles('employer'), getEmployerJobs);

module.exports = router;