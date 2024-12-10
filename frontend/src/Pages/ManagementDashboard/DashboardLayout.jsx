import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes, FaBell, FaHome, FaBox, FaUsers, FaChartBar, FaShoppingCart, FaCog } from "react-icons/fa";
import { FiSun, FiMoon, FiChevronDown, FiChevronUp } from "react-icons/fi"; // Added FiChevronDown and FiChevronUp
import axios from "axios";
import { toast } from "react-toastify";




const DashboardLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false); // State to toggle sidebar
  const [showProfileOptions, setShowProfileOptions] = useState(false); // State to toggle profile dropdown
  const [darkMode, setDarkMode] = useState(false); // State to toggle between dark and light mode
  const [showProducts, setShowProducts] = useState(false); // State to toggle the Products section
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));



  const handleLogout = async () => {
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true});
      if(response.data.success) {
      navigate('/login');
      sessionStorage.removeItem('user');
      toast.success("successfully logged out");
      }
    } catch (error) {
      if(error.response && error.response.status === 400){
        toast.error(error.response.data.message)
      }
      else{
        toast.error('logout failed try again later');
        console.error(error);
      }
    }
  };

  return (
    // look tailwind.config.css for dark
    <div className={`flex min-h-screen ${darkMode && "dark"}`}>
      {/* Sidebar displayed in large screen */}
      <div className="hidden md:flex flex-col w-64 bg-gray-800 p-4 space-y-4 dark:bg-gray-900">
        <div className="mt-4 space-y-2">
          <Link to="/management-dashboard" className="flex items-center text-gray-300 hover:bg-gray-700 rounded-md p-2 dark:hover:bg-gray-600">
            <FaHome className="mr-2"/>
            Dashboard
          </Link>

          {/* Products Link with Dropdown */}
          <div>
            <button
              onClick={() => setShowProducts(!showProducts)} // Toggle visibility of Products section
              className="flex items-center text-gray-300 hover:bg-gray-700 rounded-md p-2 dark:hover:bg-gray-600 w-full text-left"
            >
              <FaShoppingCart className="mr-2" />
              Products
              {showProducts ? (
                <FiChevronUp className="ml-auto" /> // Show Chevron Up when the Products section is expanded
              ) : (
                <FiChevronDown className="ml-auto" /> // Show Chevron Down when the Products section is collapsed
              )}
            </button>
            {showProducts && (
              <div className="ml-6 space-y-2">
                <Link to="admin-add-product" className="flex items-center text-gray-300 hover:bg-gray-700 rounded-md p-2 dark:hover:bg-gray-600">
                  <FaBox className="mr-2" />
                  Add Product
                </Link>
                <Link to="admin-all-products" className="flex items-center text-gray-300 hover:bg-gray-700 rounded-md p-2 dark:hover:bg-gray-600">
                  <FaShoppingCart className="mr-2" />
                  All Products
                </Link>
              </div>
            )}
          </div>

          <Link to="admin-all-users" className="flex items-center text-gray-300 hover:bg-gray-700 rounded-md p-2 dark:hover:bg-gray-600">
            <FaUsers className="mr-2" />
           All Users
          </Link>
          <Link to="admin-all-bookings" className="flex items-center text-gray-300 hover:bg-gray-700 rounded-md p-2 dark:hover:bg-gray-600">
                <FaUsers className="mr-2" />
                All Bookings
              </Link>
          <Link to="admin-all-report" className="flex items-center text-gray-300 hover:bg-gray-700 rounded-md p-2 dark:hover:bg-gray-600">
            <FaChartBar className="mr-2" />
            Report
          </Link>
          <Link to="admin-report" className="flex items-center text-gray-300 hover:bg-gray-700 rounded-md p-2 dark:hover:bg-gray-600">
            <FaCog className="mr-2" />
            Setting
          </Link>
        </div>
      </div>

      {/* Sidebar Links with Icons, displayed in small screen */}
      <div className="flex flex-col w-50 bg-gray-800 p-4 space-y-4 md:hidden dark:bg-gray-900">
        <div className="mt-4 space-y-2">
          <button
            onClick={() => setShowSidebar(!showSidebar)} // Toggle sidebar visibility on mobile screens
            className="text-white p-4 md:hidden"
          >
            {showSidebar ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>

          {showSidebar && (
            <>
              <Link to="/management-dashboard" className="flex items-center text-gray-300 hover:bg-gray-700 rounded-md p-2 dark:hover:bg-gray-600">
                <FaHome className="mr-2"/>
                Dashboard
              </Link>
              <button
                onClick={() => setShowProducts(!showProducts)} // Toggle visibility of Products section on mobile
                className="flex items-center text-gray-300 hover:bg-gray-700 rounded-md p-2 dark:hover:bg-gray-600 w-full text-left"
              >
                <FaShoppingCart className="mr-2" />
                Products
                {showProducts ? (
                  <FiChevronUp className="ml-auto" />
                ) : (
                  <FiChevronDown className="ml-auto" />
                )}
              </button>
              {showProducts && (
                <div className="ml-6 space-y-2">
                  <Link to="admin-add-product" className="flex items-center text-gray-300 hover:bg-gray-700 rounded-md p-2 dark:hover:bg-gray-600">
                    <FaBox className="mr-2" />
                    Add Product
                  </Link>
                  <Link to="admin-all-products" className="flex items-center text-gray-300 hover:bg-gray-700 rounded-md p-2 dark:hover:bg-gray-600">
                    <FaShoppingCart className="mr-2" />
                    All Products
                  </Link>
                </div>
              )}
              <Link to="admin-all-users" className="flex items-center text-gray-300 hover:bg-gray-700 rounded-md p-2 dark:hover:bg-gray-600">
                <FaUsers className="mr-2" />
                All Users
              </Link>
              <Link to="admin-all-bookings" className="flex items-center text-gray-300 hover:bg-gray-700 rounded-md p-2 dark:hover:bg-gray-600">
                <FaUsers className="mr-2" />
                All Bookings
              </Link>
              <Link to="admin-all-report" className="flex items-center text-gray-300 hover:bg-gray-700 rounded-md p-2 dark:hover:bg-gray-600">
                <FaChartBar className="mr-2" />
                Report
              </Link>
              <Link to="admin-report" className="flex items-center text-gray-300 hover:bg-gray-700 rounded-md p-2 dark:hover:bg-gray-600">
                <FaCog className="mr-2" />
                Setting
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white dark:bg-gray-800">
        {/* Top Navbar */}
        <div className="p-4 bg-gray-900 flex flex-col items-center justify-between md:flex-row">
          <div className="mx-auto">
            <p className="text-xl md:text-3xl font-bold text-gray-300">Management DB</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <FaBell className="mr-2 cursor-pointer text-gray-500 dark:text-gray-300" />
            {/* Toggle Dark/Light Mode Button */}
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)} // Toggle dark/light mode
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-500">
                  <div
                    className={`absolute top-0.5 left-[2px] w-5 h-5 flex items-center justify-center rounded-full transition-transform ${
                      darkMode ? 'translate-x-full' : ''
                    }`}
                  >
                    {darkMode ? (
                      <FiMoon className="text-white w-5 h-5" />
                    ) : (
                      <FiSun className="text-yellow-500 w-5 h-5" />
                    )}
                  </div>
                </div>
              </label>
            </div>

            {/* Profile image and Admin greeting */}
            <div className="relative">
              <div
                onClick={() => setShowProfileOptions(!showProfileOptions)} // Toggle profile dropdown visibility
                className="flex items-center cursor-pointer"
              >
               {user?.image? <img
                  src={user.image}
                  alt="admin image"
                  className="w-10 h-10 rounded-full object-cover"
                />:<p className="h-10 w-10 rounded-full text-white font-bold text-2xl flex items-center justify-center bg-blue-500">{user?.firstName.charAt(0).toUpperCase()}</p> } 
              </div>
              {showProfileOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg dark:bg-gray-800">
                  <Link
                    to="admin-profile-edit"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-600 rounded-md dark:hover:bg-gray-700"
                  >
                    Edit Profile
                  </Link>
                  <div onClick={handleLogout}
                    className="block px-4 py-2 text-gray-300 cursor-pointer hover:bg-gray-600 rounded-md dark:hover:bg-gray-700"
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 bg-slate-200 text-gray-800 dark:bg-gray-900 dark:text-gray-200 min-h-[87vh]">
          {/* Outlet is used to render the nested routes inside the main content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;