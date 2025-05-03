import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import jsPDF from 'jspdf'; // Import jsPDF
import 'jspdf-autotable'; // Import autoTable plugin for tables

const MnHManager = () => {
    const [wasteEntries, setWasteEntries] = useState([]);
    const [editEntry, setEditEntry] = useState(null);
    const [reportData, setReportData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchWasteEntries();
        fetchReportData();
    }, []);

    const fetchWasteEntries = async () => {
        try {
            const response = await axios.get('http://localhost:8020/MnH/allwaste');
            const updatedEntries = response.data.map(entry => ({
                ...entry,
                orderNumber: entry.orderNumber || generateOrderNumber()
            }));
            setWasteEntries(updatedEntries);
        } catch (error) {
            console.error("Error fetching waste entries:", error);
        }
    };

    const fetchReportData = async () => {
        try {
            const response = await axios.get('http://localhost:8020/MnH/report');
            setReportData(response.data);
        } catch (error) {
            console.error("Error fetching report data:", error);
        }
    };

    const generateOrderNumber = () => {
        return `ORD-${Date.now()}`; // Simple unique order number based on timestamp
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditEntry({ ...editEntry, [name]: value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8020/MnH/waste/${editEntry._id}`, editEntry);
            setEditEntry(null);
            fetchWasteEntries();
        } catch (error) {
            console.error("Error updating waste entry:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8020/MnH/waste/${id}`);
            fetchWasteEntries();
        } catch (error) {
            console.error("Error deleting waste entry:", error);
        }
    };

    const handleAccept = async (id, email) => {
        try {
            await axios.put(`http://localhost:8020/MnH/waste/${id}/status`, { status: 'accepted' });
            await sendEmail(email, 'accepted');
            fetchWasteEntries();
        } catch (error) {
            console.error("Error accepting waste entry:", error);
        }
    };

    const handleDecline = async (id, email) => {
        try {
            await axios.put(`http://localhost:8020/MnH/waste/${id}/status`, { status: 'declined' });
            await sendEmail(email, 'declined');
            fetchWasteEntries();
        } catch (error) {
            console.error("Error declining waste entry:", error);
        }
    };

    const sendEmail = async (email, status) => {
        try {
            await axios.post('http://localhost:8020/MnH/sendEmail', { email, status });
            alert(`Email sent: Order ${status === 'accepted' ? 'accepted' : 'declined'}`);
        } catch (error) {
            console.error("Error sending email:", error);
        }
    };

    const handleLogout = () => {
        Cookies.remove('userId');
        Cookies.remove('email');
        Cookies.remove('userRole');
        navigate('/customerlogin');
    };

    const filteredWasteEntries = wasteEntries.filter(entry =>
        entry.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Cost mapping for each type of material
    const costPerUnit = {
        'Hazardous Waste': 500, // Example cost per liter
        'Chemical Waste': 300,   // Example cost per liter
        'Mass Waste': 100        // Example cost per liter
    };

    const calculateEstimatedCost = (type, quantity) => {
        const cost = costPerUnit[type] || 0; // Default to 0 if type not found

        // Extract numerical value from quantity string
        const quantityValue = parseFloat(quantity); // Will convert "10 liters" to 10

        if (isNaN(quantityValue)) {
            return 0; // Return 0 if the quantity is not a number
        }

        return cost * quantityValue; // Calculate the estimated cost
    };

    const calculateTotalEstimatedCost = () => {
        return filteredWasteEntries.reduce((total, entry) => {
            return total + calculateEstimatedCost(entry.type, entry.quantity);
        }, 0);
    };

    const formatCostInLKR = (cost) => {
        return `LKR ${cost.toFixed(2)}`; // Format the cost to 2 decimal places with LKR symbol
    };

    // Generate PDF report
    const downloadEstimatedCostReport = () => {
        const doc = new jsPDF();
        const totalEstimatedCost = calculateTotalEstimatedCost();
        
        // Set title and date
        doc.setFontSize(18);
        doc.text("Estimated Cost Report", 14, 22);
        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

        // Prepare data for table
        const reportData = filteredWasteEntries.map((entry, index) => [
            index + 1, // Sequential order number
            entry.type,
            entry.quantity,
            formatCostInLKR(calculateEstimatedCost(entry.type, entry.quantity))
        ]);

        // Add table
        doc.autoTable({
            head: [['Order No', 'Type', 'Quantity', 'Estimated Cost']],
            body: reportData,
            startY: 40,
        });

        // Add total estimated cost at the bottom
        doc.text(`Total Estimated Cost: ${formatCostInLKR(totalEstimatedCost)}`, 14, doc.autoTable.previous.finalY + 10);

        // Save the PDF
        doc.save('estimated_cost_report.pdf');
    };

    return (
        <div className="p-6 bg-[#f9ffc2] min-h-screen">
            <div className="text-center shadow-lg p-5 bg-[#F6F1E5] rounded-lg mb-5">
                <h1 className="text-[#cfa226]">Welcome, MnH Manager!</h1>
                <p className="lead text-[#9e972f]">You have access to the management features.</p>
                <button 
                    onClick={handleLogout} 
                    className="bg-[#cfa226] text-white p-3 rounded-lg transition-colors hover:bg-[#9e972f]"
                >
                    Logout
                </button>
            </div>

            <div className="mt-5">
                <h2 className="text-[#cfa226]">Admin Dashboard</h2>
                <div className="mb-3">
                    <label className="block text-[#9e972f]">Search by Status:</label>
                    <input 
                        type="text" 
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cfa226]" 
                        placeholder="Enter pending, accepted, or declined" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>

                <table className="min-w-full bg-white mb-5">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Order No</th>
                            <th className="border px-4 py-2">Type</th>
                            <th className="border px-4 py-2">Location</th>
                            <th className="border px-4 py-2">Quantity</th>
                            <th className="border px-4 py-2">Image</th>
                            <th className="border px-4 py-2">User Email</th>
                            <th className="border px-4 py-2">Status</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWasteEntries.map((entry, index) => (
                            <tr key={entry._id}>
                                <td className="border px-4 py-2">{index + 1}</td> {/* Sequential order number */}
                                <td className="border px-4 py-2">{entry.type}</td>
                                <td className="border px-4 py-2">{entry.location}</td>
                                <td className="border px-4 py-2">{entry.quantity}</td>
                                <td className="border px-4 py-2">
                                    <img src={`http://localhost:8020${entry.image}`} alt="Waste" className="w-12" />
                                </td>
                                <td className="border px-4 py-2">{entry.email}</td>
                                <td className="border px-4 py-2">{entry.status}</td>
                                <td className="border px-4 py-2">
                                    <button 
                                        className="bg-yellow-500 text-white p-2 rounded-lg mx-1" 
                                        onClick={() => setEditEntry(entry)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="bg-gray-500 text-white p-2 rounded-lg mx-1" 
                                        onClick={() => handleDelete(entry._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* New table for Accept/Decline Actions */}
            <div className="mt-5">
                <h2 className="text-[#cfa226]">Pending Actions</h2>
                <table className="min-w-full bg-white mb-5">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Order No</th>
                            <th className="border px-4 py-2">Type</th>
                            <th className="border px-4 py-2">Quantity</th>
                            <th className="border px-4 py-2">User Email</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWasteEntries.filter(entry => entry.status === 'pending').map((entry, index) => (
                            <tr key={entry._id}>
                                <td className="border px-4 py-2">{index + 1}</td>
                                <td className="border px-4 py-2">{entry.type}</td>
                                <td className="border px-4 py-2">{entry.quantity}</td>
                                <td className="border px-4 py-2">{entry.email}</td>
                                <td className="border px-4 py-2">
                                    <button 
                                        className="bg-green-500 text-white p-2 rounded-lg mx-1" 
                                        onClick={() => handleAccept(entry._id, entry.email)}
                                    >
                                        Accept
                                    </button>
                                    <button 
                                        className="bg-red-500 text-white p-2 rounded-lg mx-1" 
                                        onClick={() => handleDecline(entry._id, entry.email)}
                                    >
                                        Decline
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* New table for estimated costs */}
            <div className="mt-5">
                <h2 className="text-[#cfa226]">Estimated Costs</h2>
                <table className="min-w-full bg-white mb-5">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Order No</th>
                            <th className="border px-4 py-2">Type</th>
                            <th className="border px-4 py-2">Quantity</th>
                            <th className="border px-4 py-2">Estimated Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWasteEntries.map((entry, index) => (
                            <tr key={entry._id}>
                                <td className="border px-4 py-2">{index + 1}</td>
                                <td className="border px-4 py-2">{entry.type}</td>
                                <td className="border px-4 py-2">{entry.quantity}</td>
                                <td className="border px-4 py-2">
                                    {formatCostInLKR(calculateEstimatedCost(entry.type, entry.quantity))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-5 text-center">
                <button 
                    onClick={downloadEstimatedCostReport} 
                    className="bg-[#cfa226] text-white p-3 rounded-lg transition-colors hover:bg-[#9e972f]"
                >
                    Download Estimated Cost Report
                </button>
            </div>
        </div>
    );
};

export default MnHManager;

