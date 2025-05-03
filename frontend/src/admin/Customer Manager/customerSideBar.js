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
            className="block p-3 rounded-lg transition-colors bg-[#E2E8CE] text-[#000000] hover:bg-[#3da839] hover:text-white"
          >
           Main Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/customerview" 
            className="block p-3 rounded-lg transition-colors bg-[#E2E8CE] text-[#000000] hover:bg-[#3da839] hover:text-white"
          >
            Customer View
          </Link>
        </li>
        <li>
          <Link 
            to="/viewallfeedback" 
            className="block p-3 rounded-lg transition-colors bg-[#E2E8CE] text-[#000000] hover:bg-[#3da839] hover:text-white"
          >
            Feedback View
          </Link>
        </li>
        <li>
          <Link 
            to="/viewcontact" 
            className="block p-3 rounded-lg transition-colors bg-[#E2E8CE] text-[#000000] hover:bg-[#3da839] hover:text-white"
          >
            Reported Issues
          </Link>
        </li>
        <li>
          <button 
            onClick={handleLogout} 
            className="block p-3 rounded-lg transition-colors bg-[#E2E8CE] text-[#000000] hover:bg-[#3da839] hover:text-white"
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
