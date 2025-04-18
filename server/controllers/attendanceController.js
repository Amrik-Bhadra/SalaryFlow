const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// Get attendance statistics and logs for a specific date
const getAttendanceStats = async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    date.setHours(0, 0, 0, 0);

    // Get total number of employees
    const totalEmployees = await Employee.countDocuments({ status: 'active' });

    // Get attendance for the specified date
    const attendanceRecords = await Attendance.find({
      date: {
        $gte: date,
        $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)
      }
    }).populate('employee', 'name department');

    // Calculate statistics
    const stats = {
      totalEmployees,
      present: attendanceRecords.filter(r => r.status === 'Present').length,
      late: attendanceRecords.filter(r => r.status === 'Late').length,
      absent: totalEmployees - attendanceRecords.length,
      onLeave: attendanceRecords.filter(r => r.status === 'Half Day').length
    };

    // Get weekly attendance data
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weeklyAttendance = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: weekStart,
            $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            status: "$status"
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Format weekly data
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      const dayStr = day.toISOString().split('T')[0];
      const records = weeklyAttendance.filter(r => r._id.date === dayStr);
      
      return {
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        present: records.find(r => r._id.status === 'Present')?.count || 0,
        late: records.find(r => r._id.status === 'Late')?.count || 0,
        absent: totalEmployees - (records.reduce((acc, r) => acc + r.count, 0) || 0)
      };
    });

    res.status(200).json({
      stats,
      weeklyData,
      attendanceRecords
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance data', error: error.message });
  }
};

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    const { employeeId, status, checkIn, checkOut, notes } = req.body;
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      employee: employeeId,
      date
    });

    if (attendance) {
      attendance.status = status;
      attendance.checkOut = checkOut;
      attendance.notes = notes;
      attendance.workHours = checkOut ? 
        (new Date(checkOut) - new Date(attendance.checkIn)) / (1000 * 60 * 60) : 
        attendance.workHours;
    } else {
      attendance = new Attendance({
        employee: employeeId,
        date,
        checkIn: checkIn || new Date(),
        status,
        notes
      });
    }

    await attendance.save();
    res.status(200).json({ message: 'Attendance marked successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
};

// Update attendance
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json({ message: 'Attendance updated successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error updating attendance', error: error.message });
  }
};

// Get attendance report
const getAttendanceReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {
      date: {
        $gte: new Date(startDate),
        $lt: new Date(endDate)
      }
    };

    const attendanceData = await Attendance.find(query)
      .populate('employee', 'name department')
      .sort({ date: 1 });

    res.status(200).json(attendanceData);
  } catch (error) {
    res.status(500).json({ message: 'Error generating attendance report', error: error.message });
  }
};

module.exports = {
  getAttendanceStats,
  markAttendance,
  updateAttendance,
  getAttendanceReport
}; 