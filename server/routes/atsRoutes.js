const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResume } = require('../controllers/atsController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // increased to 10MB
  fileFilter: (req, file, cb) => {
    console.log('File mimetype:', file.mimetype);
    console.log('File name:', file.originalname);

    // Accept PDF by mimetype or extension
    const isPDF =
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/octet-stream' ||
      file.originalname.toLowerCase().endsWith('.pdf');

    if (isPDF) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

router.post(
  '/analyze',
  protect,
  (req, res, next) => {
    upload.single('resume')(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err.message);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  analyzeResume
);

module.exports = router;