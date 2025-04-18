import { useState, useEffect } from 'react';
import { FaProjectDiagram, FaUsers, FaRegClock, FaCheckCircle, FaFilter, FaEllipsisV } from 'react-icons/fa';
import { MdPriorityHigh, MdAdd, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { BsKanban } from 'react-icons/bs';
import useAxios from '../../utils/validator/useAxios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import toast from 'react-hot-toast';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const axiosInstance = useAxios();

  const PRIORITY_COLORS = {
    High: 'text-red-500',
    Medium: 'text-yellow-500',
    Low: 'text-green-500'
  };

  const STATUS_COLORS = {
    'In Progress': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800',
    'On Hold': 'bg-yellow-100 text-yellow-800',
    'Not Started': 'bg-gray-100 text-gray-800'
  };

  // Fetch projects from the backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get('/api/projects');
        if (response.data.success) {
          setProjects(response.data.projects);
        } else {
          toast.error(response.data.message || 'Failed to load projects');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error(error.response?.data?.message || 'Failed to load projects');
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Calculate project statistics
  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'In Progress').length,
    completed: projects.filter(p => p.status === 'Completed').length,
    onHold: projects.filter(p => p.status === 'On Hold').length
  };

  // Data for charts
  const statusDistribution = [
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Completed', value: stats.completed },
    { name: 'On Hold', value: stats.onHold }
  ];

  const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-xl ${color} bg-opacity-15`}>
          <Icon className={`text-2xl ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-800">{value}</p>
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
          <p className="text-sm text-gray-600">
            Count: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Project Management</h1>
          <p className="text-gray-500 text-sm">Manage and track your team's projects</p>
        </div>
        <button
          onClick={() => setShowNewProjectModal(true)}
          className="px-4 py-2 bg-sky text-white rounded-lg hover:bg-sky-600 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <MdAdd className="text-xl" />
          New Project
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={stats.total}
          icon={FaProjectDiagram}
          color="bg-sky"
          trend={2.5}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={FaRegClock}
          color="bg-yellow-500"
          trend={1.8}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={FaCheckCircle}
          color="bg-green-500"
          trend={3.2}
        />
        <StatCard
          title="On Hold"
          value={stats.onHold}
          icon={MdPriorityHigh}
          color="bg-red-500"
          trend={-0.5}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BsKanban className="text-sky" />
            Project Status Distribution
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Allocation */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaUsers className="text-sky" />
            Team Size Distribution
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projects}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="teamMembers.length" fill="#0897FF" name="Team Members" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaProjectDiagram className="text-sky" />
            Active Projects
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
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
              ) : !projects.length ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FaProjectDiagram className="text-4xl mb-2" />
                      <p className="text-lg font-medium">No projects found</p>
                      <p className="text-sm">Create your first project to get started!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{project.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[project.status]}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${PRIORITY_COLORS[project.priority]} font-medium`}>
                        {project.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {project.teamMembers?.slice(0, 3).map((member, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium"
                            title={member.name}
                          >
                            {member.name.charAt(0)}
                          </div>
                        ))}
                        {project.teamMembers?.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                            +{project.teamMembers.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-sky h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{project.progress}%</span>
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

export default AdminProjects; 