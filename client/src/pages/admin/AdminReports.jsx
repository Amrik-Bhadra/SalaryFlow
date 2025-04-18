import { useState, useEffect } from 'react';
import { FaFileAlt, FaDownload, FaFilter, FaCalendarAlt, FaChartPie } from 'react-icons/fa';
import { MdAnalytics, MdTrendingUp } from 'react-icons/md';
import { BsGraphUp } from 'react-icons/bs';
import useAxios from '../../utils/validator/useAxios';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';

const AdminReports = () => {
  const [selectedReport, setSelectedReport] = useState('attendance');
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const axiosInstance = useAxios();

  const reportTypes = [
    { id: 'attendance', name: 'Attendance Report', icon: FaFileAlt, color: 'bg-sky' },
    { id: 'performance', name: 'Performance Report', icon: MdAnalytics, color: 'bg-green-500' },
    { id: 'project', name: 'Project Report', icon: FaChartPie, color: 'bg-yellow-500' }
  ];

  // Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/reports/${selectedReport}?start=${dateRange.start}&end=${dateRange.end}`
        );
        if (response.data.success) {
          setReportData(response.data);
        } else {
          toast.error(response.data.message || 'Failed to load report data');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching report:', error);
        toast.error(error.response?.data?.message || 'Failed to load report data');
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [selectedReport, dateRange]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.unit ? entry.unit : '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (!reportData?.data) return null;

    switch (selectedReport) {
      case 'attendance':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={reportData.data}>
              <defs>
                <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF5252" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FF5252" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="attendance" 
                stroke="#4CAF50" 
                fillOpacity={1} 
                fill="url(#colorAttendance)" 
                name="Attendance"
                unit="%" 
              />
              <Area 
                type="monotone" 
                dataKey="late" 
                stroke="#FF5252" 
                fillOpacity={1} 
                fill="url(#colorLate)" 
                name="Late"
                unit="%" 
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'performance':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={reportData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="performance" 
                stroke="#2196F3" 
                name="Performance Score"
                unit="%" 
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'project':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="completed" fill="#4CAF50" name="Completed" />
              <Bar dataKey="ongoing" fill="#FFC107" name="Ongoing" />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Reports & Analytics</h1>
            <p className="text-gray-500 text-sm">Generate and analyze detailed reports</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border hover:border-sky transition-colors duration-300">
              <FaCalendarAlt className="text-gray-500" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border hover:border-sky transition-colors duration-300">
              <FaCalendarAlt className="text-gray-500" />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="outline-none text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-sky text-white rounded-lg hover:bg-sky-600 transition-all duration-300 shadow-sm hover:shadow-md">
              <FaDownload />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedReport(type.id)}
            className={`flex items-center gap-4 p-6 rounded-xl border transition-all duration-300 ${
              selectedReport === type.id
                ? 'bg-sky bg-opacity-10 border-sky shadow-md'
                : 'bg-white hover:border-sky border-gray-100'
            }`}
          >
            <div className={`p-4 rounded-xl ${type.color} bg-opacity-15`}>
              <type.icon className={`text-2xl ${type.color.replace('bg-', 'text-')}`} />
            </div>
            <div className="text-left">
              <h3 className={`font-medium ${
                selectedReport === type.id ? 'text-sky' : 'text-gray-700'
              }`}>
                {type.name}
              </h3>
              <p className="text-sm text-gray-500">View detailed analytics</p>
            </div>
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-sky rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-4 h-4 bg-sky rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-4 h-4 bg-sky rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        ) : !reportData ? (
          <div className="flex flex-col items-center justify-center h-96 text-gray-500">
            <BsGraphUp className="text-5xl mb-4" />
            <p className="text-lg font-medium">No report data available</p>
            <p className="text-sm">Try adjusting your filters or date range</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            {reportData.summary && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(reportData.summary.metrics).map(([key, value], index) => (
                  <div key={key} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">{key}</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-gray-800">{value}</p>
                      <MdTrendingUp className="text-green-500 text-xl" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Chart */}
            <div className="bg-white rounded-xl border border-gray-100 p-1">
              {renderChart()}
            </div>

            {/* Insights */}
            {reportData.summary?.insights && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MdAnalytics className="text-sky" />
                    Key Insights
                  </h3>
                  <ul className="space-y-3">
                    {reportData.summary.insights.map((insight, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-sky"></div>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BsGraphUp className="text-sky" />
                    Recommendations
                  </h3>
                  <ul className="space-y-3">
                    {reportData.summary.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports; 