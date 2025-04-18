import { useState, useEffect } from 'react';
import { FaUserCheck, FaUserClock, FaCalendarAlt, FaFileDownload, FaFilter, FaEllipsisV } from 'react-icons/fa';
import { MdAccessTime, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import useAxios from '../../utils/validator/useAxios';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const AdminAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const axiosInstance = useAxios();

  const STATUS_COLORS = {
    'Present': 'bg-green-100 text-green-800',
    'Absent': 'bg-red-100 text-red-800',
    'Late': 'bg-yellow-100 text-yellow-800',
    'Half Day': 'bg-orange-100 text-orange-800'
  };

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axiosInstance.get(`/api/attendance?date=${selectedDate}`);
        if (response.data.success) {
          setAttendanceData(response.data);
        } else {
          toast.error(response.data.message || 'Failed to load attendance data');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching attendance:', error);
        toast.error(error.response?.data?.message || 'Failed to load attendance data');
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedDate]);

  const stats = attendanceData.stats || {
    totalEmployees: 0,
    present: 0,
    absent: 0,
    late: 0,
    onLeave: 0
  };

  const StatCard = ({ title, value, icon: Icon, color, percentage, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-xl ${color} bg-opacity-15`}>
          <Icon className={`text-2xl ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {percentage && (
              <span className="text-sm text-gray-500">
                ({((value / stats.totalEmployees) * 100).toFixed(1)}%)
              </span>
            )}
            {trend && (
              <span className={`flex items-center text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? <MdTrendingUp /> : <MdTrendingDown />}
                {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Attendance Management</h1>
            <p className="text-gray-500 text-sm">Track and manage employee attendance</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border hover:border-sky transition-colors duration-300">
              <FaCalendarAlt className="text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="outline-none text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-sky text-white rounded-lg hover:bg-sky-600 transition-all duration-300 shadow-sm hover:shadow-md">
              <FaFileDownload />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={FaUserCheck}
          color="bg-sky"
          trend={2.5}
        />
        <StatCard
          title="Present Today"
          value={stats.present}
          icon={FaUserCheck}
          color="bg-green-500"
          percentage={true}
          trend={1.8}
        />
        <StatCard
          title="Late Today"
          value={stats.late}
          icon={FaUserClock}
          color="bg-yellow-500"
          percentage={true}
          trend={-0.5}
        />
        <StatCard
          title="Absent Today"
          value={stats.absent}
          icon={FaUserClock}
          color="bg-red-500"
          percentage={true}
          trend={-1.2}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaUserCheck className="text-sky" />
            Weekly Attendance Trends
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData.weeklyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="present" stackId="a" fill="#4CAF50" name="Present" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" stackId="a" fill="#FFC107" name="Late" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" stackId="a" fill="#FF5252" name="Absent" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Attendance Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MdAccessTime className="text-sky" />
            Today's Attendance Distribution
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Present', value: stats.present },
                    { name: 'Late', value: stats.late },
                    { name: 'Absent', value: stats.absent }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                >
                  {['#4CAF50', '#FFC107', '#FF5252'].map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaUserCheck className="text-sky" />
            Today's Attendance Log
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search employee..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky focus:border-transparent transition-all duration-300"
              />
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 bg-sky rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-4 h-4 bg-sky rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-4 h-4 bg-sky rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                  </td>
                </tr>
              ) : !attendanceData.attendanceRecords?.length ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FaUserCheck className="text-4xl mb-2" />
                      <p className="text-lg font-medium">No attendance records found</p>
                      <p className="text-sm">Try selecting a different date</p>
                    </div>
                  </td>
                </tr>
              ) : (
                attendanceData.attendanceRecords?.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-sky bg-opacity-15 flex items-center justify-center text-sky font-medium">
                          {record.employee.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{record.employee.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{record.employee.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(record.checkIn).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[record.status]}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {record.workHours.toFixed(2)}h
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                        <FaEllipsisV />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance; 