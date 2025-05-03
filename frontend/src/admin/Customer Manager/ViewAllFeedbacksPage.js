import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FeedbackSidebar from './customerSideBar'; // Import Sidebar for Feedback
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation
import 'jspdf-autotable'; // Import autoTable for table generation in PDF

const ViewAllFeedbacksPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [feedbackType, setFeedbackType] = useState('all'); // State for feedback type filter
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('http://localhost:8020/feedback/all');
                setFeedbacks(response.data); 
            } catch (error) {
                alert('Error fetching feedbacks.');
            }
        };

        fetchFeedbacks();
    }, []);

    const handleDelete = async (feedbackId) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                await axios.delete(`http://localhost:8020/feedback/feedback/${feedbackId}`);
                setFeedbacks(feedbacks.filter((feedback) => feedback._id !== feedbackId)); 
                alert('Feedback deleted successfully.');
            } catch (error) {
                alert('Error deleting feedback.');
            }
        }
    };

    const handleUpdate = (feedbackId) => {
        navigate(`/feedback/update/${feedbackId}`); 
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                    {i <= rating ? '★' : '☆'}
                </span>
            );
        }
        return stars;
    };

    // Function to generate PDF
    const generatePDF = () => {
        const doc = new jsPDF();
        
        // Add logo text at the top of the PDF
        doc.setFontSize(25); // Set a large font size for the logo text
        doc.setFont('helvetica', 'bold'); // Set the font style to bold
        doc.text('IV-Waste Solutions', 105, 30, { align: 'center' }); // Centered at (x: 105, y: 30)
        
        // Add the subtitle below the main text (Address)
        doc.setFontSize(10); // Set smaller font size for the subtitle
        doc.setFont('helvetica', 'normal'); // Set font style back to normal
        doc.text('Welivita Road, Kaduwela', 105, 35, { align: 'center' }); // Centered at (x: 105, y: 35)

        // Title of the PDF
        doc.setFontSize(20);
        doc.text('All Feedbacks', 14, 50);
        
        // Use autoTable to generate a table for the feedbacks
        doc.autoTable({
            startY: 60, // Start after the title
            head: [['Customer ID', 'Pickup Location', 'Description', 'Star Rating']],
            body: feedbacks.map(feedback => [
                feedback.customerId,
                feedback.pickupId?.location || 'N/A', // Handle undefined pickup location
                feedback.description,
                `${feedback.starRating} ${''.repeat(feedback.starRating)}${''.repeat(5 - feedback.starRating)}` // Star rating count and stars
            ]),
        });

        // Save the PDF with a specific file name
        doc.save('feedbacks.pdf');
    };

    const filteredFeedbacks = feedbacks.filter((feedback) => {
        if (feedbackType === 'good') {
            return feedback.starRating >= 4; // Good feedback (4 or 5 stars)
        } else if (feedbackType === 'bad') {
            return feedback.starRating <= 2; // Bad feedback (1 or 2 stars)
        }
        return true; // Show all feedbacks if no filter is selected
    });

    return (
        <div className="flex">
            {/* Sidebar */}
            <FeedbackSidebar /> {/* Sidebar for Feedback */}
            
            {/* Main content */}
            <div className="flex-1 p-8 bg-[#ffffff] min-h-screen">
                <h2 className="text-4xl font-bold text-center text-[#135713] mb-8 ">All Feedbacks</h2>

                {/* Search Bar */}
                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        placeholder="Search by Customer ID"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-2 border-[#135713] p-3 rounded w-2/4 mr-4 shadow-md focus:outline-none focus:ring-2 focus:ring-[#135713] transition duration-200"
                    />
                    <button
                        onClick={generatePDF}
                        className="bg-gradient-to-r from-[#008d00] to-[#008d00] text-white py-3 rounded-lg hover:shadow-lg transition duration-300 p-6"
                    >
                        Generate PDF
                    </button>
                </div>

                {/* Feedback Type Filter */}
                <div className="flex mb-4">
                    <select
                        value={feedbackType}
                        onChange={(e) => setFeedbackType(e.target.value)}
                        className="border-2 border-[#135713] p-3 rounded mr-4 shadow-md focus:outline-none focus:ring-2 focus:ring-[#135713] transition duration-200"
                    >
                        <option value="all">All Feedbacks</option>
                        <option value="good">Good Feedbacks (4-5 Stars)</option>
                        <option value="bad">Bad Feedbacks (1-2 Stars)</option>
                    </select>
                </div>

                {filteredFeedbacks.length === 0 ? (
                    <p className="text-center text-xl">No feedbacks available.</p>
                ) : (
                    <table className="min-w-full bg-white border border-[#135713] rounded-lg shadow-lg overflow-hidden">
                        <thead className="bg-[#E2E8CE] text-left">
                            <tr>
                                <th className="p-4 border border-[#135713] font-semibold">Customer ID</th>
                                <th className="p-4 border border-[#135713] font-semibold">Pickup Location</th>
                                <th className="p-4 border border-[#135713] font-semibold">Description</th>
                                <th className="p-4 border border-[#135713] font-semibold">Star Rating</th>
                                <th className="p-4 border border-[#135713] font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFeedbacks
                                .filter(feedback => feedback.customerId.includes(searchTerm)) // Filter feedbacks based on search term
                                .map((feedback) => (
                                    <tr key={feedback._id} className="odd:bg-[#f9f9f7] even:bg-[#f1f0ea] transition duration-200 hover:bg-[#E2E8CE]">
                                        <td className="p-4 border border-[#135713]">{feedback.customerId}</td>
                                        <td className="p-4 border border-[#135713]">{feedback.pickupId?.location}</td>
                                        <td className="p-4 border border-[#135713]">{feedback.description}</td>
                                        <td className="p-4 border border-[#135713]">{renderStars(feedback.starRating)}</td>
                                        <td className="p-4 border border-[#135713]">
                                            <button
                                                onClick={() => handleDelete(feedback._id)}
                                                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                                            >
                                                Delete
                                            </button>
                                        
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ViewAllFeedbacksPage;
