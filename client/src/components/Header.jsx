import { useState } from "react";
import { FaBell, FaUser, FaSignOutAlt } from "react-icons/fa";

const Header = ({ isSidebarOpen, setIsSidebarOpen, userRole }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {userRole} Portal
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <FaBell className="text-gray-600 text-xl" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <FaUser className="text-gray-600 text-xl" />
              <span className="text-gray-700">Ankur DOme</span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="text-gray-600" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 