const express = require('express');
const router = express.Router();
const multer = require('multer');
const { buildResume, extractResumeText } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'), false);
    }
  }
});

// Extract text from PDF
router.post(
  '/extract',
  protect,
  (req, res, next) => {
    upload.single('resume')(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  extractResumeText
);

// Build resume data
router.post('/build', protect, buildResume);

module.exports = router;