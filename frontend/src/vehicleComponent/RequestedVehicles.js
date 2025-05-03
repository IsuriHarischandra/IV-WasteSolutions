import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Sidebar from './vehicleSideBar'; // Import Sidebar

const RequestedVehicles = () => {
    const [requestedVehicles, setRequestedVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchRequestedVehicles = async () => {
        try {
            const response = await axios.get('http://localhost:8020/vehicle/requested');
            setRequestedVehicles(response.data);
        } catch (error) {
            console.error('Error fetching requested vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequestedVehicles();
    }, []);

    const refreshRequestedVehicles = async () => {
        setLoading(true);
        await fetchRequestedVehicles();
    };

    const handleAcceptRequest = async (id) => {
        try {
            await axios.put(`http://localhost:8020/vehicle/${id}/accept`);
            refreshRequestedVehicles();
        } catch (error) {
            console.error('Error accepting vehicle request:', error);
        }
    };

    const handleRejectRequest = async (id) => {
        try {
            await axios.put(`http://localhost:8020/vehicle/${id}/reject`);
            refreshRequestedVehicles();
        } catch (error) {
            console.error('Error rejecting vehicle request:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const generateReport = () => {
        const doc = new jsPDF();
        
        // Set a large font size for the logo text
        doc.setFontSize(25);
        doc.setFont('helvetica', 'bold'); // Set the font style to bold
        doc.text('IV-Waste Solutions', 105, 30, { align: 'center' }); // Centered at (x: 105, y: 30)
    
        // Add subtitle below the main text (Address)
        doc.setFontSize(10); // Set smaller font size for the subtitle
        doc.setFont('helvetica', 'normal'); // Set font style back to normal
        doc.text('Welivita Road, Kaduwela', 105, 35, { align: 'center' }); // Centered at (x: 105, y: 35)
    
        // Set the table title
        doc.setFontSize(16);
        doc.text('Requested Vehicles Report', 14, 50); // Adjust the Y position for the title
    
        const tableColumn = ['Vehicle No', 'Model', 'Capacity', 'Registered Year'];
        const tableRows = requestedVehicles
            .filter(vehicle => vehicle.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(vehicle => [
                vehicle.vehicleNo,
                vehicle.model,
                vehicle.capacity,
                vehicle.registeredYear,
            ]);
    
        // Add the table to the document
        doc.autoTable(tableColumn, tableRows, { startY: 55 }); // Adjust starting Y position for the table
        doc.save('requested_vehicles_report.pdf');
    };
    

    if (loading) {
        return <p className="text-center text-xl">Loading requested vehicles...</p>;
    }

    const filteredVehicles = requestedVehicles.filter(vehicle =>
        vehicle.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar /> {/* Render sidebar */}

            {/* Main content */}
            <div className="flex-1 p-8 bg-[#F6F1E5] min-h-screen">
                <h2 className="text-4xl font-bold text-center text-[#cfa226] mb-8 shadow-md">Requested Vehicles</h2>

                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        placeholder="Search by Vehicle No"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border-2 border-[#9e972f] p-3 rounded w-2/4 mr-4 shadow-md focus:outline-none focus:ring-2 focus:ring-[#9e972f] transition duration-200"
                    />
                    <button
                        className="bg-gradient-to-r from-[#FFC107] to-[#FFA000] text-white py-3 rounded-lg hover:shadow-lg transition duration-300 p-6"
                        onClick={generateReport}
                    >
                        Generate Report
                    </button>
                </div>

                {filteredVehicles.length > 0 ? (
                    <table className="min-w-full bg-white border border-[#9e972f] rounded-lg shadow-lg overflow-hidden">
                        <thead>
                            <tr className="bg-[#E2E8CE] text-left">
                                <th className="border border-[#9e972f] p-4 font-semibold">Image</th>
                                <th className="border border-[#9e972f] p-4 font-semibold">Vehicle No</th>
                                <th className="border border-[#9e972f] p-4 font-semibold">Model</th>
                                <th className="border border-[#9e972f] p-4 font-semibold">Capacity</th>
                                <th className="border border-[#9e972f] p-4 font-semibold">Registered Year</th>
                                <th className="border border-[#9e972f] p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVehicles.map((vehicle) => (
                                <tr key={vehicle._id} className="odd:bg-[#f9f9f7] even:bg-[#f1f0ea] transition duration-200 hover:bg-[#E2E8CE]">
                                    <td className="border border-[#9e972f] p-4">
                                        {vehicle.imageUrl ? (
                                            <img
                                                src={`http://localhost:8020${vehicle.imageUrl}`}
                                                alt={vehicle.model}
                                                className="w-24 h-auto"
                                            />
                                        ) : (
                                            <p>No Image</p>
                                        )}
                                    </td>
                                    <td className="border border-[#9e972f] p-4">{vehicle.vehicleNo}</td>
                                    <td className="border border-[#9e972f] p-4">{vehicle.model}</td>
                                    <td className="border border-[#9e972f] p-4">{vehicle.capacity}</td>
                                    <td className="border border-[#9e972f] p-4">{vehicle.registeredYear}</td>
                                    <td className="border border-[#9e972f] p-4">
                                        <button
                                            onClick={() => handleAcceptRequest(vehicle._id)}
                                            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleRejectRequest(vehicle._id)}
                                            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center">No requested vehicles found</p>
                )}
            </div>
        </div>
    );
};

export default RequestedVehicles;
