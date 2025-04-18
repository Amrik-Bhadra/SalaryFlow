const Attendance = require('../models/Attendance');
const Project = require('../models/Project');
const Employee = require('../models/Employee');

// Helper function to generate date range array
const generateDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

// Get attendance report
const getAttendanceReport = async (req, res) => {
  try {
    const { start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Get attendance records for the date range
    const attendanceRecords = await Attendance.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('employee', 'name department');

    const totalEmployees = await Employee.countDocuments({ status: 'active' });
    const dateRange = generateDateRange(startDate, endDate);

    // Process data for the chart
    const data = dateRange.map(date => {
      const dayRecords = attendanceRecords.filter(record => 
        record.date.toDateString() === date.toDateString()
      );

      return {
        date: date.toISOString().split('T')[0],
        attendance: (dayRecords.filter(r => r.status === 'Present').length / totalEmployees) * 100,
        late: (dayRecords.filter(r => r.status === 'Late').length / totalEmployees) * 100
      };
    });

    // Calculate summary statistics
    const totalRecords = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(r => r.status === 'Present').length;
    const lateCount = attendanceRecords.filter(r => r.status === 'Late').length;

    const summary = {
      metrics: {
        'Average Attendance Rate': `${((presentCount / totalRecords) * 100).toFixed(1)}%`,
        'Late Arrival Rate': `${((lateCount / totalRecords) * 100).toFixed(1)}%`,
        'Total Working Days': dateRange.length
      },
      insights: [
        `${((presentCount / totalRecords) * 100).toFixed(1)}% overall attendance rate`,
        `${lateCount} late arrivals recorded`,
        `${dateRange.length} working days analyzed`
      ],
      recommendations: [
        'Consider implementing flexible work hours',
        'Review attendance policies',
        'Recognize employees with perfect attendance'
      ]
    };

    res.status(200).json({
      success: true,
      data,
      summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating attendance report',
      error: error.message
    });
  }
};

// Get performance report
const getPerformanceReport = async (req, res) => {
  try {
    const { start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Get projects completed in the date range
    const projects = await Project.find({
      deadline: {
        $gte: startDate,
        $lte: endDate
      }
    });

    const dateRange = generateDateRange(startDate, endDate);

    // Calculate performance metrics
    const data = dateRange.map(date => {
      const dayProjects = projects.filter(project => 
        project.deadline.toDateString() === date.toDateString()
      );

      const performanceScore = dayProjects.length > 0
        ? dayProjects.reduce((acc, proj) => acc + proj.progress, 0) / dayProjects.length
        : null;

      return {
        date: date.toISOString().split('T')[0],
        performance: performanceScore || 0
      };
    });

    // Calculate summary statistics
    const averagePerformance = projects.reduce((acc, proj) => acc + proj.progress, 0) / projects.length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;

    const summary = {
      metrics: {
        'Average Performance': `${averagePerformance.toFixed(1)}%`,
        'Completed Projects': completedProjects,
        'Total Projects': projects.length
      },
      insights: [
        `${averagePerformance.toFixed(1)}% average project progress`,
        `${completedProjects} projects completed`,
        `${projects.length - completedProjects} projects ongoing`
      ],
      recommendations: [
        'Focus on project milestone tracking',
        'Review resource allocation',
        'Implement regular progress reviews'
      ]
    };

    res.status(200).json({
      success: true,
      data,
      summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating performance report',
      error: error.message
    });
  }
};

// Get project report
const getProjectReport = async (req, res) => {
  try {
    const { start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Get all projects within the date range
    const projects = await Project.find({
      startDate: {
        $gte: startDate,
        $lte: endDate
      }
    });

    const dateRange = generateDateRange(startDate, endDate);

    // Process data for the chart
    const data = dateRange.map(date => {
      const dayProjects = projects.filter(project => 
        project.startDate.toDateString() === date.toDateString()
      );

      return {
        date: date.toISOString().split('T')[0],
        completed: dayProjects.filter(p => p.status === 'Completed').length,
        ongoing: dayProjects.filter(p => p.status !== 'Completed').length
      };
    });

    // Calculate summary statistics
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const onHoldProjects = projects.filter(p => p.status === 'On Hold').length;

    const summary = {
      metrics: {
        'Total Projects': totalProjects,
        'Completion Rate': `${((completedProjects / totalProjects) * 100).toFixed(1)}%`,
        'On Hold Rate': `${((onHoldProjects / totalProjects) * 100).toFixed(1)}%`
      },
      insights: [
        `${completedProjects} projects completed`,
        `${projects.length - completedProjects} projects in progress`,
        `${onHoldProjects} projects on hold`
      ],
      recommendations: [
        'Review delayed projects',
        'Optimize resource allocation',
        'Schedule regular project reviews'
      ]
    };

    res.status(200).json({
      success: true,
      data,
      summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating project report',
      error: error.message
    });
  }
};

module.exports = {
  getAttendanceReport,
  getPerformanceReport,
  getProjectReport
}; 