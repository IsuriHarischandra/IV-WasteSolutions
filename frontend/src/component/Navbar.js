import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove('userId');
    Cookies.remove('email');
    Cookies.remove('userRole');
    navigate('/customerlogin');
  };

  const isLoggedIn = Cookies.get('userId');

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-2xl">
          <Link to="/" className="hover:text-gray-200 transition duration-200">IV</Link>
        </div>
        <div className="flex space-x-6 items-center">
          <Link to="/" className="text-white hover:text-gray-200 transition duration-200 text-lg">
            Home
          </Link>
          <Link to="/about" className="text-white hover:text-gray-200 transition duration-200 text-lg">
            About
          </Link>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-white hover:text-gray-200 transition duration-200 text-lg focus:outline-none"
            >
              Our Services
            </button>
            {dropdownOpen && (
              <div className="absolute bg-white shadow-md rounded-lg py-2 mt-2 w-48">
                <Link
                  to="/MnHwaste"
                  className="block px-4 py-2 text-gray-700 hover:bg-green-500 hover:text-white"
                  onClick={() => setDropdownOpen(false)}
                >
                  Mass and Hazardous Waste Extraction
                </Link>
                <Link
                  to="/addpickup"
                  className="block px-4 py-2 text-gray-700 hover:bg-green-500 hover:text-white"
                  onClick={() => setDropdownOpen(false)}
                >
                  Residential Waste Extraction
                </Link>
                <Link
                  to="/stockview"
                  className="block px-4 py-2 text-gray-700 hover:bg-green-500 hover:text-white"
                  onClick={() => setDropdownOpen(false)}
                >
                  Buy Recycled Material
                </Link>
              </div>
            )}
          </div>
          <Link to="/contactus" className="text-white hover:text-gray-200 transition duration-200 text-lg">
            Contact
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/profile" className="text-white hover:text-gray-200 transition duration-200 text-lg">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white text-black px-4 py-2 rounded-full hover:bg-green-700 transition duration-200 text-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/customerlogin"
              className="bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-800 transition duration-200 text-lg"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
