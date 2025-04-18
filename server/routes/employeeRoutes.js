const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/employeeController');
const { verifyToken } = require('../middleware/authMiddleware');

// ... existing routes ...

// Dashboard Statistics Route
router.get('/getDashboardStats', verifyToken, getDashboardStats);

module.exports = router; 