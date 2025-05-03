import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Cookies from 'js-cookie';
import { FaPlusCircle, FaEye, FaUser } from 'react-icons/fa';

const ViewPickUp = () => {
  const [pickups, setPickups] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const customerId = Cookies.get('userId');

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const response = await axios.get(`http://localhost:8020/pickup/getpickups/${customerId}`);
        if (Array.isArray(response.data)) {
          setPickups(response.data);
        } else {
          setPickups([]);
        }
      } catch (err) {
        setError('Failed to fetch pick-up requests. Please try again.');
      }
    };

    fetchPickups();
  }, [customerId]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pick-up request?')) {
      try {
        await axios.delete(`http://localhost:8020/pickup/pickups/${id}`);
        setPickups(pickups.filter(pickup => pickup._id !== id));
      } catch (err) {
        setError('Failed to delete pick-up request. Please try again.');
      }
    }
  };

  const filteredPickups = pickups.filter(pickup => {
    return (
      (searchTerm === '' || pickup.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === 'All' || pickup.category === categoryFilter)
    );
  });

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Add logo text
    doc.setFontSize(25); // Set a large font size for the logo text
    doc.setFont('helvetica', 'bold'); // Set the font style to bold
    doc.text('IV-Waste Solutions', 105, 30, { align: 'center' }); // Centered at (x: 105, y: 30)
  
    // Add subtitle below the main text (Address)
    doc.setFontSize(10); // Set smaller font size for the subtitle
    doc.setFont('helvetica', 'normal'); // Set font style back to normal
    doc.text('Welivita Road, Kaduwela', 105, 35, { align: 'center' }); // Centered at (x: 105, y: 35)
  
    // Add a line break before the main table
    doc.text('', 10, 45); // Adds an empty line (adjust as necessary)
  
    // Table headers and data
    doc.autoTable({
      startY: 50, // Start the table below the logo text
      head: [['Category', 'Quantity', 'Date', 'Time', 'Location', 'Address']],
      body: filteredPickups.map(pickup => [
        pickup.category,
        pickup.quantity,
        new Date(pickup.date).toLocaleDateString(),
        pickup.time,
        pickup.location,
        pickup.address,
      ]),
    });
  
    doc.save('pickup_requests.pdf');
  };
  

  return (
    <div className="w-full h-screen mx-auto bg-[#F6F1E5] rounded-lg shadow-md flex justify-center">
      <div className="bg-[#E2E8CE] w-1/5 min-h-screen p-4 shadow-lg">
      <ul className="space-y-4">
        <li className="transition duration-300 ease-in-out transform hover:scale-105">
          <Link to="/profile" className="flex items-center text-gray-800 hover:bg-gray-200 p-2 rounded-lg">
            <FaUser className="mr-2 text-[#41A64F]" />
            <span>My Profile</span>
          </Link>
        </li>
        <li className="transition duration-300 ease-in-out transform hover:scale-105">
          <Link to="/addpickup" className="flex items-center text-gray-800 hover:bg-gray-200 p-2 rounded-lg">
            <FaPlusCircle className="mr-2 text-[#41A64F]" />
            <span>Add Pick-Up Request</span>
          </Link>
        </li>
        <li className="transition duration-300 ease-in-out transform hover:scale-105">
          <Link to="/viewpickup" className="flex items-center text-gray-800 hover:bg-gray-200 p-2 rounded-lg">
            <FaEye className="mr-2 text-[#41A64F]" />
            <span>View Pick-Up Requests</span>
          </Link>
        </li>
        <li className="transition duration-300 ease-in-out transform hover:scale-105">
                        <Link to="/adddailycollection" className="flex items-center text-gray-800 hover:bg-gray-200 p-2 rounded-lg">
                            <FaPlusCircle className="mr-2 text-[#41A64F]" />
                            <span>Add Daily Collection</span>
                        </Link>
                    </li>
        {/* Add more navigation links as needed */}
      </ul>
    </div>
      <div className='flex flex-col items-center mt-10 w-4/5'>
      <div className='w-6/7'>
      <h2 className="text-3xl font-bold mb-6 text-[#2f9e5d] text-center">Pick-Up Requests</h2>

      {/* Search and Filter Section */}
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by category..."
          className="p-2 border border-gray-300 rounded-lg w-1/3 focus:outline-none focus:ring focus:ring-blue-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-1/4 focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="All">All Categories</option>
          <option value="organic">Organic</option>
          <option value="e-waste">E-Waste</option>
          <option value="plastic">Plastic</option>
          <option value="mix">Mix</option>
          <option value="metallic/copper/glass">Metallic/Copper/Glass</option>
        </select>

        <button
          onClick={generatePDF}
          className="p-2 bg-[#2f9e5d] text-white font-bold rounded-lg hover:bg-[#f6f1e5] hover:text-[#2f9e5d] transition duration-300"
        >
          Generate PDF
        </button>
      </div>

      {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-[#E2E8CE]">
            <th className="py-2 px-4 border-b text-left">Category</th>
            <th className="py-2 px-4 border-b text-left">Quantity</th>
            <th className="py-2 px-4 border-b text-left">Date</th>
            <th className="py-2 px-4 border-b text-left">Time</th>
            <th className="py-2 px-4 border-b text-left">Location</th>
            <th className="py-2 px-4 border-b text-left">Address</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPickups.length > 0 ? (
            filteredPickups.map((pickup) => (
              <tr key={pickup._id} className="hover:bg-gray-100 transition duration-300">
                <td className="py-2 px-4 border-b">{pickup.category}</td>
                <td className="py-2 px-4 border-b">{pickup.quantity}</td>
                <td className="py-2 px-4 border-b">{new Date(pickup.date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{pickup.time}</td>
                <td className="py-2 px-4 border-b">{pickup.location}</td>
                <td className="py-2 px-4 border-b">{pickup.address}</td>
                <td className="py-2 px-4 border-b flex">
               <Link to={`/editpickup/${pickup._id}`}>
            <button className="ml-2 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-700 transition duration-300">
      Edit
    </button>
  </Link>
  <button
    onClick={() => handleDelete(pickup._id)}
    className="ml-4 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-300"
  >
    Delete
  </button>
  <Link to={`/feedbackpage/${pickup._id}`}>
    <button className="ml-4 bg-[#2f9e5d] text-white py-1 px-3 rounded hover:bg-green-700 transition duration-300">
      Add Feedback
    </button>
  </Link>
</td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-4 text-center text-gray-500">No pick-up requests found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-6 text-center">
  <Link to="/addpickup">
    <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300">
      Add New Pick-up Request
    </button>
  </Link>
</div>

      </div>
      </div>
    </div>
  );
};

export default ViewPickUp;
