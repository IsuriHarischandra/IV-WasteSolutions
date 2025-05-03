import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Sidebar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('userId');
        Cookies.remove('email');
        Cookies.remove('userRole');
        navigate('/customerlogin');
      };
    
      const isLoggedIn = Cookies.get('userId');
  return (
    <div className="bg-[#b3e6bf] w-64 min-h-screen p-6 shadow-lg">
      
      <ul className="space-y-4">
      <li>
          <Link 
            to="/mainadmindashboard" 
            className="block p-3 rounded-lg transition-colors bg-white text-[#267b59] hover:bg-[#2f9e4b] hover:text-white"
          >
           Maindashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/allvehicles" 
            className="block p-3 rounded-lg transition-colors bg-white text-[#267b59] hover:bg-[#2f9e4b] hover:text-white"
          >
           All Vehicles
          </Link>
        </li>
        <li>
          <Link 
            to="/vehicleadd" 
            className="block p-3 rounded-lg transition-colors bg-white text-[#267b59] hover:bg-[#2f9e4b] hover:text-white"
          >
            Vehicle Add
          </Link>
        </li>
        <li>
          <Link 
            to="/vehicles/requests" 
            className="block p-3 rounded-lg transition-colors bg-white text-[#267b59] hover:bg-[#2f9e4b] hover:text-white"
          >
            Requested Vehicles
          </Link>
        </li>
        <li>
          <button 
            onClick={handleLogout} 
            className="block p-3 rounded-lg transition-colors bg-white text-[#267b59] hover:bg-[#2f9e4b] hover:text-white"
          >
            Logout
          </button>
        </li>
        {/* Add more links as needed */}
      </ul>
    </div>
  );
};

export default Sidebar;
