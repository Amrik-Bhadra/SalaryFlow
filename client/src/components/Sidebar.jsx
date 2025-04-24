import { Link, useLocation } from "react-router-dom";
import {
  FaChartBar,
  FaCalendarAlt,
  FaProjectDiagram,
  FaUser,
  FaTimes,
  FaBars,
  FaSignOutAlt,
  FaCog,
  FaBell,
  FaMoneyBillWave,
} from "react-icons/fa";

const Sidebar = ({ isOpen, setIsOpen, navLinks }) => {
  const location = useLocation();

  const getIcon = (iconName) => {
    switch (iconName) {
      case "dashboard":
        return <FaChartBar className="text-xl" />;
      case "calendar":
        return <FaCalendarAlt className="text-xl" />;
      case "project":
        return <FaProjectDiagram className="text-xl" />;
      case "user":
        return <FaUser className="text-xl" />;
      case "money":
        return <FaMoneyBillWave className="text-xl" />;
      default:
        return <FaChartBar className="text-xl" />;
    }
  };

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div
        className={`bg-white border-r border-gray-200 text-gray-800 w-72 min-h-screen fixed lg:static 
        transition-transform duration-300 ease-in-out transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 z-10`}
      >
        {/* Logo and Brand */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">SalaryFlow</h1>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <FaUser className="text-gray-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Ankur Dome</h2>
              <p className="text-xs text-gray-500">Software Engineer</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-6">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <span className={`${isActive ? "text-blue-600" : "text-gray-400"}`}>
                    {getIcon(link.icon)}
                  </span>
                  <span className="font-medium">{link.label}</span>
                  {link.badge && (
                    <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <button className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors">
              <FaBell className="text-xl" />
              <span className="text-sm">Notifications</span>
              <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                3
              </span>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors">
              <FaCog className="text-xl" />
              <span className="text-sm">Settings</span>
            </button>
            <button className="flex items-center space-x-3 text-red-600 hover:text-red-700 transition-colors">
              <FaSignOutAlt className="text-xl" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-0"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar; 