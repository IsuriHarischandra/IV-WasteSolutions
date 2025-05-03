import React from "react";
import { Link } from 'react-router-dom';
import { FaMoneyCheckAlt, FaTrashAlt, FaUsers, FaTruck, FaBuilding, FaRecycle } from 'react-icons/fa';

const MainAdminDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#ffffff] to-[#ffffff] p-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-[#2E7D32] mb-2 drop-shadow-lg">IV - Administration</h1>
        <p className="text-lg text-gray-700 drop-shadow-sm">Admin Dashboard of IV-Waste Solutions, Sri Lanka</p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Payment Manager */}
        <Link to="/showpayments" className="group">
          <div className="flex flex-col justify-center items-center bg-gradient-to-br from-[#C8E6C9] to-[#A5D6A7] w-48 h-48 border-[#4CAF50] shadow-lg group-hover:shadow-2xl transform group-hover:scale-105 transition duration-300">
            <FaMoneyCheckAlt className="text-5xl text-[#8d8426] mb-2 group-hover:rotate-12 transition-transform duration-300" />
            <p className="text-lg font-semibold text-[#000000]">Payment Manager</p>
          </div>
        </Link>

        {/* Residential Waste Manager */}
        <Link to="/adminpickup" className="group">
          <div className="flex flex-col justify-center items-center bg-gradient-to-br from-[#A5D6A7] to-[#C8E6C9] w-48 h-48 border-[#4CAF50] shadow-lg group-hover:shadow-2xl transform group-hover:scale-105 transition duration-300">
            <FaTrashAlt className="text-5xl text-[#298d20] mb-2 group-hover:rotate-12 transition-transform duration-300" />
            <p className="text-lg font-semibold text-[#000000] text-center">Residential Waste</p>
          </div>
        </Link>

        {/* Mass & Hazardous Waste Manager */}
        <Link to="/MnHManager" className="group">
          <div className="flex flex-col justify-center items-center bg-gradient-to-br from-[#C8E6C9] to-[#A5D6A7] w-48 h-48 border-[#4CAF50] shadow-lg group-hover:shadow-2xl transform group-hover:scale-105 transition duration-300">
            <FaBuilding className="text-5xl text-[#000000] mb-2 group-hover:rotate-12 transition-transform duration-300" />
            <p className="text-lg font-semibold text-[#000000] text-center">Mass & Hazardous Waste</p>
          </div>
        </Link>

        {/* Employee Manager */}
        <Link to="/employeeview" className="group">
          <div className="flex flex-col justify-center items-center bg-gradient-to-br from-[#A5D6A7] to-[#C8E6C9] w-48 h-48 border-[#4CAF50] shadow-lg group-hover:shadow-2xl transform group-hover:scale-105 transition duration-300">
            <FaUsers className="text-5xl text-[#158079] mb-2 group-hover:rotate-12 transition-transform duration-300" />
            <p className="text-lg font-semibold text-[#000000] text-center">Employee Manager</p>
          </div>
        </Link>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {/* Vehicle Inventory Manager */}
        <Link to="/allvehicles" className="group">
          <div className="flex flex-col justify-center items-center bg-gradient-to-br from-[#C8E6C9] to-[#A5D6A7] w-48 h-48 border-[#4CAF50] shadow-lg group-hover:shadow-2xl transform group-hover:scale-105 transition duration-300">
            <FaTruck className="text-5xl text-[#000000] mb-2 group-hover:rotate-12 transition-transform duration-300" />
            <p className="text-lg font-semibold text-[#000000] text-center">Vehicle Manager</p>
          </div>
        </Link>

        {/* Customer Manager */}
        <Link to="/customerview" className="group">
          <div className="flex flex-col justify-center items-center bg-gradient-to-br from-[#A5D6A7] to-[#C8E6C9] w-48 h-48 border-[#4CAF50] shadow-lg group-hover:shadow-2xl transform group-hover:scale-105 transition duration-300">
            <FaUsers className="text-5xl text-[#158079] mb-2 group-hover:rotate-12 transition-transform duration-300" />
            <p className="text-lg font-semibold text-[#000000] text-center">Customer Manager</p>
          </div>
        </Link>

        {/* Recycle Waste Manager */}
        <Link to="/recyclewastemanager" className="group">
          <div className="flex flex-col justify-center items-center bg-gradient-to-br from-[#C8E6C9] to-[#A5D6A7] w-48 h-48 border-[#4CAF50] shadow-lg group-hover:shadow-2xl transform group-hover:scale-105 transition duration-300">
            <FaRecycle className="text-5xl text-[#298d20] mb-2 group-hover:rotate-12 transition-transform duration-300" />
            <p className="text-lg font-semibold text-[#000000] text-center">Recycle Manager</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MainAdminDashboard;
