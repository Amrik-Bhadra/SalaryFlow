import { useState, useEffect } from 'react';
import { FaUsers, FaUserCheck, FaUserClock, FaChartLine, FaUserTie } from 'react-icons/fa';
import { MdWorkOutline, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { BsBuildingsFill } from 'react-icons/bs';
import useAxios from '../../utils/validator/useAxios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area,
  AreaChart
} from 'recharts';

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 150,
    activeEmployees: 146,
    onLeaveEmployees: 4,
    remoteEmployees: 47
  });

  const [workModeData, setWorkModeData] = useState([]);
  const [monthlyJoining, setMonthlyJoining] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const axiosInstance = useAxios();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const WORK_MODE_COLORS = {
    'Remote': '#4CAF50',
    'Hybrid': '#2196F3',
    'On-Site': '#FF9800'
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, subtext }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-full ${color} bg-opacity-20`}>
          <Icon className={`text-2xl ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {trend && (
              <span className={`flex items-center text-sm ${
                trend > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {trend > 0 ? <MdTrendingUp /> : <MdTrendingDown />}
                {Math.abs(trend)}%
              </span>
            )}
          </div>
          {subtext && (
            <p className="text-xs text-gray-500 mt-1">{subtext}</p>
          )}
        </div>
      </div>
    </div>
  );

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/api/employee/getDashboardStats');
      setDashboardStats(response.data.stats);
      setWorkModeData(response.data.workModeDistribution);
      setMonthlyJoining(response.data.monthlyJoining);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Sample data - replace with actual data from API
  const sampleWorkModeData = [
    { name: 'Remote', value: 5 },
    { name: 'Hybrid', value: 25 },
    { name: 'On-Site', value: 70 }
  ];

  const sampleMonthlyData = [
    { month: 'Jan', employees: 5, departures: 2 },
    { month: 'Feb', employees: 8, departures: 3 },
    { month: 'Mar', employees: 12, departures: 4 },
    { month: 'Apr', employees: 15, departures: 3 },
    { month: 'May', employees: 10, departures: 5 },
    { month: 'Jun', employees: 18, departures: 4 }
  ];

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-txt"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-primary-txt text-white rounded-md hover:bg-opacity-90 transition-colors duration-300 flex items-center gap-2"
        >
          <FaChartLine />
          Refresh Data
        </button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={dashboardStats.totalEmployees}
          icon={FaUsers}
          color="bg-blue-500"
          trend={5.2}
          subtext="Total workforce strength"
        />
        <StatCard
          title="Active Employees"
          value={dashboardStats.activeEmployees}
          icon={FaUserCheck}
          color="bg-green-500"
          trend={2.1}
          subtext="Currently working"
        />
        <StatCard
          title="On Leave"
          value={dashboardStats.onLeaveEmployees}
          icon={FaUserClock}
          color="bg-yellow-500"
          trend={-1.5}
          subtext="Temporary absence"
        />
        <StatCard
          title="Remote Workers"
          value={dashboardStats.remoteEmployees}
          icon={MdWorkOutline}
          color="bg-purple-500"
          trend={8.3}
          subtext="Working remotely"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Employee Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Work Mode Distribution</h2>
            <div className="flex gap-2">
              {Object.entries(WORK_MODE_COLORS).map(([mode, color]) => (
                <span key={mode} className="flex items-center gap-1 text-sm">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
                  {mode}
                </span>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sampleWorkModeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={5}
                >
                  {sampleWorkModeData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={WORK_MODE_COLORS[entry.name]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employee Trends Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Employee Trends</h2>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                On Time
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                Late
              </span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampleMonthlyData}>
                <defs>
                  <linearGradient id="colorEmployees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2196F3" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2196F3" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDepartures" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5252" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF5252" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="employees" 
                  stroke="#2196F3" 
                  fillOpacity={1} 
                  fill="url(#colorEmployees)" 
                  name="On Time"
                />
                <Area 
                  type="monotone" 
                  dataKey="departures" 
                  stroke="#FF5252" 
                  fillOpacity={1} 
                  fill="url(#colorDepartures)" 
                  name="Late"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Department Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaUserTie className="text-blue-500" />
            Top Departments
          </h3>
          <div className="space-y-4">
            {[
              { dept: 'Engineering', count: 45, percent: 30 },
              { dept: 'Sales', count: 30, percent: 20 },
              { dept: 'Marketing', count: 25, percent: 17 },
            ].map((dept) => (
              <div key={dept.dept} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{dept.dept}</span>
                  <span className="font-medium">{dept.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${dept.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MdTrendingUp className="text-green-500" />
            Recent Activities
          </h3>
          <div className="space-y-4">
            {[
              { action: 'New employee joined', dept: 'Engineering', time: '2 hours ago' },
              { action: 'Employee status updated', dept: 'Sales', time: '4 hours ago' },
              { action: 'Leave request approved', dept: 'Marketing', time: '5 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.dept} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Office Locations */}
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BsBuildingsFill className="text-purple-500" />
            Office Locations
          </h3>
          <div className="space-y-4">
            {[
              { location: 'Pune', employees: 90, growth: '+5%' },
              { location: 'Mumbai', employees: 30, growth: '+3%' },
              { location: 'Surat', employees: 30, growth: '+7%' },
            ].map((office, index) => (
              <div key={index} className="flex items-center justify-between pb-3 border-b">
                <div>
                  <p className="font-medium">{office.location}</p>
                  <p className="text-sm text-gray-500">{office.employees} employees</p>
                </div>
                <span className="text-green-500 text-sm font-medium">{office.growth}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
