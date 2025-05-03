import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link component
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Sidebar from './customerSideBar'; // Import Sidebar

const ViewContactRequests = () => {
    const [contactRequests, setContactRequests] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchContactRequests = async () => {
            try {
                const response = await axios.get('http://localhost:8020/contact/contacts'); // Adjust endpoint as needed
                setContactRequests(response.data); // Assume the data is in the response
            } catch (err) {
                console.error('Error fetching contact requests:', err);
                setError('Failed to fetch contact requests. Please try again later.');
            }
        };

        fetchContactRequests();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8020/contact/requests/${id}`);
            setContactRequests(contactRequests.filter(request => request._id !== id)); // Update the state to remove the deleted contact
            setSuccessMessage('Contact request deleted successfully.'); // Add success message on delete
        } catch (err) {
            console.error('Error deleting contact request:', err);
            setError('Failed to delete contact request. Please try again later.');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value); 
    };

    const generateReport = () => {
        const doc = new jsPDF();
        
        // Add logo text
        doc.setFontSize(25); // Set a large font size for the logo text
        doc.setFont('helvetica', 'bold'); // Set the font style to bold
        doc.text('IV-Waste Solutions', 105, 30, { align: 'center' }); // Centered at (x: 105, y: 30)
        
        // Add subtitle below the main text (Address)
        doc.setFontSize(10); // Set smaller font size for the subtitle
        doc.setFont('helvetica', 'normal'); // Set font style back to normal
        doc.text('Welivita Road, Kaduwela', 105, 35, { align: 'center' }); // Centered at (x: 105, y: 35)
        
        doc.text('Customer Issues - Reported', 14, 50); // Moved down to avoid overlap
        doc.autoTable({
            head: [['Issue ID', 'Customer ID', 'Title', 'Description', 'Created At']],
            body: contactRequests.map(request => [
                request.issueId,
                request.customerId,
                request.title,
                request.description,
                new Date(request.createdAt).toLocaleString()
            ]),
            startY: 55, // Adjusted the start position of the table to leave space for the title
        });
        doc.save('Customer Issues - Reported.pdf'); 
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar /> {/* Render sidebar */}

            {/* Main content */}
            <div className="flex-1 p-8 bg-[#F6F1E5] min-h-screen">
                <h2 className="text-4xl font-bold text-center text-[#136815] mb-8 ">Reported Customer Issues</h2>

                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border-2 border-[#9e972f] p-3 rounded w-2/4 mr-4 shadow-md focus:outline-none focus:ring-2 focus:ring-[#9e972f] transition duration-200"
                    />
                    <button
                        className="bg-gradient-to-r from-[#21a437] to-[#21a437] text-white py-3 rounded-lg hover:shadow-lg transition duration-300 p-6"
                        onClick={generateReport}
                    >
                        Generate Report
                    </button>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
                {successMessage && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{successMessage}</div>}

                <table className="min-w-full bg-white border border-[#9e972f] rounded-lg shadow-lg overflow-hidden">
                    <thead>
                        <tr className="bg-[#E2E8CE] text-left">
                            <th className="border border-[#9e972f] p-4 font-semibold">Issue ID</th>
                            <th className="border border-[#9e972f] p-4 font-semibold">Customer ID</th>
                            <th className="border border-[#9e972f] p-4 font-semibold">Title</th>
                            <th className="border border-[#9e972f] p-4 font-semibold">Description</th>
                            <th className="border border-[#9e972f] p-4 font-semibold">Created At</th>
                            <th className="border border-[#9e972f] p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contactRequests.length > 0 ? (
                            contactRequests.filter(request =>
                                request.title.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((request) => (
                                <tr key={request._id} className="odd:bg-[#f9f9f7] even:bg-[#f1f0ea] transition duration-200 hover:bg-[#E2E8CE]">
                                    <td className="border border-[#9e972f] p-4">{request.issueId}</td>
                                    <td className="border border-[#9e972f] p-4">{request.customerId}</td>
                                    <td className="border border-[#9e972f] p-4">{request.title}</td>
                                    <td className="border border-[#9e972f] p-4">{request.description}</td>
                                    <td className="border border-[#9e972f] p-4">{new Date(request.createdAt).toLocaleString()}</td>
                                    <td className="border border-[#9e972f] p-4 flex gap-2">
                                        <button
                                            onClick={() => handleDelete(request._id)} // Call delete function on click
                                            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-2 px-4 text-center">No contact requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewContactRequests;
