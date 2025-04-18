const express = require('express');
const router = express.Router();
const {
  getAttendanceStats,
  markAttendance,
  updateAttendance,
  getAttendanceReport
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected and require authentication
router.use(protect);

// Get attendance statistics and mark attendance
router.route('/')
  .get(getAttendanceStats)
  .post(markAttendance);

// Update existing attendance record
router.route('/:id')
  .put(updateAttendance);

// Get attendance report for a date range
router.route('/report')
  .get(getAttendanceReport);

module.exports = router; 