const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Apply auth middleware to all admin routes
router.use(auth);

// Get dashboard statistics
router.get('/dashboard-stats', adminController.getDashboardStats);

// Get all users
router.get('/users', adminController.getUsers);

module.exports = router; 