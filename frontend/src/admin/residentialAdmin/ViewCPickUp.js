import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import Sidebar from './residentialSideBar'; // Import your sidebar component

const AdminPickUp = () => {
  const [pickups, setPickups] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const response = await axios.get('http://localhost:8020/pickup/getpickups');
        setPickups(response.data);
      } catch (err) {
        setError('Failed to fetch pick-up requests. Please try again.');
      }
    };

    fetchPickups();
  }, []);

  const handleAccept = async (id) => {
    try {
      await axios.put(`http://localhost:8020/pickup/pickups/${id}/accept`);
      setPickups(pickups.map(pickup => pickup._id === id ? { ...pickup, status: 'Accepted' } : pickup));
    } catch (err) {
      setError('Failed to accept pick-up request.');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:8020/pickup/pickups/${id}/reject`);
      setPickups(pickups.map(pickup => pickup._id === id ? { ...pickup, status: 'Rejected' } : pickup));
    } catch (err) {
      setError('Failed to reject pick-up request.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pick-up request?')) {
      try {
        await axios.delete(`http://localhost:8020/pickup/pickups/${id}`);
        setPickups(pickups.filter(pickup => pickup._id !== id));
      } catch (err) {
        setError('Failed to delete pick-up request.');
      }
    }
  };

  const filteredPickups = pickups.filter(pickup => {
    return (
      (searchTerm === '' || pickup.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === 'All' || pickup.category === categoryFilter) &&
      (statusFilter === 'All' || pickup.status === statusFilter)
    );
  });

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Add title
    doc.setFontSize(25);
    doc.setFont('helvetica', 'bold');
    doc.text('IV-Waste Solutions', 105, 30, { align: 'center' });
  
    // Add subtitle (Address)
    doc.setFontSize(10); // Set smaller font size for the subtitle
    doc.setFont('helvetica', 'normal'); // Set font style back to normal
    doc.text('Welivita Road, Kaduwela', 105, 35, { align: 'center' }); // Centered at (x: 105, y: 35)
  
    // Add header for the table
    doc.text('Pick-Up Requests', 14, 50); // Adjust Y position if needed
    
    // Add the table
    doc.autoTable({
      startY: 60, // Start Y position for the table after the title and subtitle
      head: [['Category', 'Quantity', 'Date', 'Location', 'Status']],
      body: filteredPickups.map(pickup => [
        pickup.category,
        pickup.quantity,
        new Date(pickup.date).toLocaleDateString(),
        pickup.location,
        pickup.status,
      ]),
    });
  
    doc.save('pickup_requests.pdf');
  };
  

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-white">
        <h2 className="text-5xl font-bold text-center mb-6 text-black shadow-md">
          Admin - Pick-up Requests
        </h2>

        {/* Search and Filter Section */}
        <div className="mb-8 flex justify-between items-center">
          <input 
            type="text" 
            placeholder="Search by category..." 
            className="p-3 border border-[#2f9e4b] rounded w-1/3 shadow-md focus:ring-2 focus:ring-[#2f9e4b] focus:outline-none" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-3 border border-[#2f9e4b] rounded shadow-md"
          >
            <option value="All">All Categories</option>
            <option value="organic">Organic</option>
            <option value="e-waste">E-Waste</option>
            <option value="plastic">Plastic</option>
            <option value="mix">Mix</option>
            <option value="metallic/copper/glass">Metallic/Copper/Glass</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 border border-[#2f9e4b] rounded shadow-md"
          >
            <option value="All">All Status</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Pending">Pending</option>
          </select>

          <button 
            onClick={generatePDF} 
            className="bg-gradient-to-r from-[#4cae6e] to-[#318847] text-white py-3 px-6 rounded-lg hover:shadow-lg transition duration-300"
          >
            Generate PDF
          </button>
        </div>

        {error && <div className="mb-4 text-red-500">{error}</div>}

        <table className="min-w-full bg-white border border-[#2f9e4b] rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-[#2f9e4b]  text-white">
            <tr>
              <th className="border border-[#2f9e4b] p-4 font-semibold">Category</th>
              <th className="border border-[#2f9e4b] p-4 font-semibold">Quantity</th>
              <th className="border border-[#2f9e4b] p-4 font-semibold">Date</th>
              <th className="border border-[#2f9e4b] p-4 font-semibold">Location</th>
              <th className="border border-[#2f9e4b] p-4 font-semibold">Status</th>
              <th className="border border-[#2f9e4b] p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPickups.map((pickup) => (
              <tr key={pickup._id} className="odd:bg-[#f9f9f7] even:bg-[#f1f0ea] transition duration-200 hover:bg-[#E2E8CE]">
                <td className="border border-[#2f9e4b] p-4">{pickup.category}</td>
                <td className="border border-[#2f9e4b] p-4">{pickup.quantity}</td>
                <td className="border border-[#2f9e4b] p-4">{new Date(pickup.date).toLocaleDateString()}</td>
                <td className="border border-[#2f9e4b] p-4">{pickup.location}</td>
                <td className="border border-[#2f9e4b] p-4">{pickup.status}</td>
                <td className="border border-[#2f9e4b] p-4 flex gap-2">
                  <button
                    onClick={() => handleAccept(pickup._id)}
                    className={`bg-blue-600 text-white p-2 rounded-lg shadow-sm ${pickup.status === 'Accepted' ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    disabled={pickup.status === 'Accepted'}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(pickup._id)}
                    className={`bg-red-600 text-white p-2 rounded-lg shadow-sm ${pickup.status === 'Rejected' ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-red-700'}`}
                    disabled={pickup.status === 'Rejected'}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDelete(pickup._id)}
                    className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPickUp;
