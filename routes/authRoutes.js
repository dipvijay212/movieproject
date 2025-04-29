const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);  
// Protected route to get current user
router.get('/me', authMiddleware, getMe);

module.exports = router;
