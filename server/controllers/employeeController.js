const getDashboardStats = async (req, res) => {
  try {
    // Basic Stats
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'active' });
    const onLeaveEmployees = await Employee.countDocuments({ status: 'inactive' });
    const remoteEmployees = await Employee.countDocuments({ work_type: 'remote' });

    // Calculate growth rates (comparing with last month)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const lastMonthTotal = await Employee.countDocuments({
      createdAt: { $lt: lastMonth }
    });
    
    const totalGrowth = lastMonthTotal ? 
      ((totalEmployees - lastMonthTotal) / lastMonthTotal * 100).toFixed(1) : 0;

    // Work mode distribution
    const workModeDistribution = await Employee.aggregate([
      {
        $group: {
          _id: '$work_type',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          value: '$count',
          _id: 0
        }
      }
    ]);

    // Monthly joining and departures (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyJoining = await Employee.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          employees: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          month: {
            $let: {
              vars: {
                monthsInString: [
                  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ]
              },
              in: {
                $arrayElemAt: ['$$monthsInString', { $subtract: ['$_id.month', 1] }]
              }
            }
          },
          employees: 1,
          departures: 0 // Initialize departures (to be updated in next step)
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);

    // Department distribution
    const departmentDistribution = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          department: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Recent activities (last 5)
    const recentActivities = await Employee.aggregate([
      {
        $sort: { updatedAt: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          action: {
            $cond: {
              if: { $eq: ['$createdAt', '$updatedAt'] },
              then: 'New employee joined',
              else: {
                $cond: {
                  if: { $eq: ['$status', 'inactive'] },
                  then: 'Employee status updated to inactive',
                  else: 'Employee details updated'
                }
              }
            }
          },
          department: 1,
          updatedAt: 1
        }
      }
    ]);

    // Office locations stats
    const officeLocations = await Employee.aggregate([
      {
        $group: {
          _id: '$location',
          employees: { $sum: 1 }
        }
      },
      {
        $project: {
          location: '$_id',
          employees: 1,
          _id: 0
        }
      },
      {
        $sort: { employees: -1 }
      }
    ]);

    res.status(200).json({
      stats: {
        totalEmployees,
        activeEmployees,
        onLeaveEmployees,
        remoteEmployees,
        totalGrowth
      },
      workModeDistribution,
      monthlyJoining,
      departmentDistribution,
      recentActivities: recentActivities.map(activity => ({
        ...activity,
        time: Math.round((Date.now() - activity.updatedAt) / (1000 * 60)) + ' minutes ago'
      })),
      officeLocations: officeLocations.map(office => ({
        ...office,
        growth: '+' + (Math.random() * 10).toFixed(1) + '%' // Simulated growth for demo
      }))
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};

module.exports = {
  getDashboardStats,
}; 