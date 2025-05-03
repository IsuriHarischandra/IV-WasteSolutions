import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaTrash } from 'react-icons/fa';
import { jsPDF } from 'jspdf'; // Import jsPDF
import Sidebar from './residentialSideBar'; // Import your sidebar component

const ShowDailyCollections = () => {
    const [dailyCollections, setDailyCollections] = useState([]);
    const [filteredCollections, setFilteredCollections] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await axios.get('http://localhost:8020/dailycollection');
                setDailyCollections(response.data);
                setFilteredCollections(response.data); // Initialize filteredCollections
            } catch (error) {
                setError('Error fetching daily collections');
            }
        };

        fetchCollections();
    }, []);

    useEffect(() => {
        // Filter collections based on search query
        const result = dailyCollections.filter(collection =>
            collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            collection.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            collection.nic.includes(searchQuery)
        );
        setFilteredCollections(result);
    }, [searchQuery, dailyCollections]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.patch(`http://localhost:8020/dailycollection/${id}/status`, { status: newStatus });
            setFilteredCollections((prevCollections) =>
                prevCollections.map((collection) =>
                    collection._id === id ? { ...collection, status: newStatus } : collection
                )
            );
        } catch (error) {
            setError('Error updating status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this collection?')) {
            try {
                await axios.delete(`http://localhost:8020/dailycollection/${id}`);
                setFilteredCollections((prevCollections) => prevCollections.filter((collection) => collection._id !== id));
            } catch (error) {
                setError('Error deleting collection');
            }
        }
    };

    const generateReport = () => {
        const doc = new jsPDF();
    
        // Add the title
        doc.setFontSize(25);
        doc.setFont('helvetica', 'bold');
        doc.text('IV-Waste Solutions', 105, 30, { align: 'center' });
    
        // Add the subtitle (Address)
        doc.setFontSize(10); // Set smaller font size for the subtitle
        doc.setFont('helvetica', 'normal'); // Set font style back to normal
        doc.text('Welivita Road, Kaduwela', 105, 35, { align: 'center' }); // Centered at (x: 105, y: 35)
    
        // Add the report title
        doc.setFontSize(20);
        doc.text('Daily Collections Report', 14, 50); // Adjusted y position for the report title
    
        doc.setFontSize(12);
        const tableColumn = ["Category", "Name", "NIC", "Address", "Email", "Contact Number", "Location", "Status"];
        const tableRows = [];
    
        filteredCollections.forEach(collection => {
            const collectionData = [
                collection.category,
                collection.name,
                collection.nic,
                collection.address,
                collection.email,
                collection.contactNumber,
                collection.location,
                collection.status
            ];
            tableRows.push(collectionData);
        });
    
        // Set the starting position for the table
        const startY = 60; // Adjust this as necessary based on the previous text
        doc.autoTable(tableColumn, tableRows, { startY });
        
        // Save the PDF
        doc.save('daily_collections_report.pdf');
    };
    

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-8 bg-white">
                <h2 className="text-5xl font-bold text-center mb-6 text-black shadow-md">
                    All Daily Collections
                </h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <div className="mb-8 flex justify-between items-center">
                    <input
                        type="text"
                        placeholder="Search by category or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-3 border border-[#2f9e4b] rounded w-1/3 shadow-md focus:ring-2 focus:ring-[#2f9e4b] focus:outline-none"
                    />
                    <button
                        onClick={generateReport}
                        className="bg-gradient-to-r from-[#4cae6e] to-[#318847] text-white py-3 px-6 rounded-lg hover:shadow-lg transition duration-300"
                    >
                        Generate Report
                    </button>
                </div>

                <table className="table-auto w-full border-collapse bg-white shadow-lg rounded-lg">
                    <thead>
                        <tr className="bg-[#2f9e4b] text-white">
                            <th className="px-4 py-2">Category</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">NIC</th>
                            <th className="px-4 py-2">Address</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Contact Number</th>
                            <th className="px-4 py-2">Location</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCollections.length > 0 ? (
                            filteredCollections.map((collection) => (
                                <tr key={collection._id} className="hover:bg-gray-100">
                                    <td className="border px-4 py-2">{collection.category}</td>
                                    <td className="border px-4 py-2">{collection.name}</td>
                                    <td className="border px-4 py-2">{collection.nic}</td>
                                    <td className="border px-4 py-2">{collection.address}</td>
                                    <td className="border px-4 py-2">{collection.email}</td>
                                    <td className="border px-4 py-2">{collection.contactNumber}</td>
                                    <td className="border px-4 py-2">{collection.location}</td>
                                    <td className="border px-4 py-2 capitalize">{collection.status}</td>
                                    <td className="border px-4 py-2 flex items-center space-x-4">
                                        {collection.status === 'pending' && (
                                            <>
                                                <button
                                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                                    onClick={() => handleStatusChange(collection._id, 'accept')}
                                                >
                                                    <FaCheckCircle />
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                                    onClick={() => handleStatusChange(collection._id, 'reject')}
                                                >
                                                    <FaTimesCircle />
                                                </button>
                                            </>
                                        )}
                                        <button
                                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                                            onClick={() => handleDelete(collection._id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center py-4 text-gray-500">No daily collections found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShowDailyCollections;
