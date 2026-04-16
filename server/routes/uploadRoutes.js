const express = require('express');
const router = express.Router();
const { uploadResume, uploadPhoto } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// @desc    Upload Resume
// @route   POST /api/upload/resume
// @access  Private
router.post('/resume', protect, (req, res) => {
  uploadResume.single('resume')(req, res, (err) => {
    if (err) {
      console.error("UPLOAD ERROR 👉", err);
      return res.status(500).json({ message: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
      }

      res.status(200).json({
        message: 'Resume uploaded successfully',
        url: req.file.path,
        filename: req.file.originalname
      });

    } catch (error) {
      console.error("SERVER ERROR 👉", error);
      res.status(500).json({ message: error.message });
    }
  });
});

// @desc    Upload Profile Photo
// @route   POST /api/upload/photo
// @access  Private

router.post('/photo', protect, (req, res) => {
  uploadPhoto.single('photo')(req, res, (err) => {
    if (err) {
      console.error("UPLOAD ERROR 👉", err);
      return res.status(500).json({ message: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload a photo' });
      }

      res.status(200).json({
        message: 'Photo uploaded successfully',
        url: req.file.path
      });

    } catch (error) {
      console.error("SERVER ERROR 👉", error);
      res.status(500).json({ message: error.message });
    }
  });
});
module.exports = router;