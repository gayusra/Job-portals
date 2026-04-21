const express = require('express');
const router = express.Router();
const { uploadResume, uploadPhoto } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// Resume Upload
router.post('/resume', protect, (req, res) => {
  uploadResume.single('resume')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    console.log('Uploaded file:', req.file);

    res.status(200).json({
      message: 'Resume uploaded successfully',
      url: req.file.path,
      filename: req.file.originalname
    });
  });
});

// Photo Upload
router.post('/photo', protect, (req, res) => {
  uploadPhoto.single('photo')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a photo' });
    }

    res.status(200).json({
      message: 'Photo uploaded successfully',
      url: req.file.path
    });
  });
});

module.exports = router;