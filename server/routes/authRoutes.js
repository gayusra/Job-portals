const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile
} = require('../controllers/authControllers');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;