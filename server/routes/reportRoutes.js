const express = require('express');
const router = express.Router();
const {
  getAttendanceReport,
  getPerformanceReport,
  getProjectReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Get attendance report
router.get('/attendance', getAttendanceReport);

// Get performance report
router.get('/performance', getPerformanceReport);

// Get project report
router.get('/project', getProjectReport);

module.exports = router; 