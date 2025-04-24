import { useState } from "react";
import {
  FaClock,
  FaCalendarCheck,
  FaProjectDiagram,
  FaTasks,
  FaBell,
  FaCheckCircle,
  FaSpinner,
  FaClock as FaClockOutline,
} from "react-icons/fa";
import { Link } from "react-router-dom";
const authString = localStorage.getItem("auth");
const auth = authString ? JSON.parse(authString) : null;

const EmployeeDashboard = () => {
  const [checkInTime, setCheckInTime] = useState(null);

  const handleCheckIn = () => {
    setCheckInTime(new Date());
  };

  const stats = {
    attendance: "90%",
    projects: 4,
    tasks: 8,
    completed: 45,
  };

  const upcomingTasks = [
    {
      id: 1,
      title: "Complete API Integration",
      project: "E-commerce Platform",
      deadline: "2024-03-25",
      priority: "high",
    },
    {
      id: 2,
      title: "Review Pull Requests",
      project: "Mobile App",
      deadline: "2024-03-24",
      priority: "medium",
    },
    {
      id: 3,
      title: "Update Documentation",
      project: "Internal Tools",
      deadline: "2024-03-26",
      priority: "low",
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "Team Meeting",
      content: "Weekly sync at 10:00 AM tomorrow",
      time: "1 hour ago",
    },
    {
      id: 2,
      title: "New Project Launch",
      content: "Kickoff meeting for the new client project",
      time: "3 hours ago",
    },
    {
      id: 3,
      title: "Holiday Notice",
      content: "Office will be closed for the upcoming holiday",
      time: "1 day ago",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Completed task",
      description: "User Authentication Module",
      time: "2 hours ago",
      type: "task",
    },
    {
      id: 2,
      action: "Submitted",
      description: "Weekly Progress Report",
      time: "4 hours ago",
      type: "document",
    },
    {
      id: 3,
      action: "Attended",
      description: "Project Planning Meeting",
      time: "Yesterday",
      type: "meeting",
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Welcome Message and Check-in Button */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome Back, {auth.user.name.split(" ")[0]}
            </h1>
            <p className="text-gray-600 mt-1">Here's what's happening today</p>
          </div>
          <button
            onClick={handleCheckIn}
            disabled={checkInTime}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${
              checkInTime
                ? "bg-green-100 text-green-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition-colors duration-200`}
          >
            <FaClock className="text-lg" />
            <span>{checkInTime ? "Checked In" : "Check In"}</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Attendance Rate</p>
              <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.attendance}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaCalendarCheck className="text-xl text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/employee/attendance"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View Details →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.projects}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaProjectDiagram className="text-xl text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/employee/projects"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View Projects →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Tasks</p>
              <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.tasks}
              </h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaTasks className="text-xl text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/employee/tasks"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View Tasks →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Tasks</p>
              <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.completed}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaCheckCircle className="text-xl text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/employee/tasks"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View All →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Upcoming Tasks
            </h2>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Project: {task.project}
                    </p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="flex items-center text-sm text-gray-500">
                        <FaClockOutline className="mr-1" />
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs capitalize ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Announcements
            </h2>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                >
                  <div className="flex items-start">
                    <div className="p-2 bg-blue-100 rounded-full mr-3">
                      <FaBell className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {announcement.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {announcement.content}
                      </p>
                      <span className="text-xs text-gray-500 mt-2 block">
                        {announcement.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FaSpinner className="text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-900">
                    <span className="font-medium">{activity.action}</span>{" "}
                    {activity.description}
                  </p>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
