import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import VehicleSidebar from './vehicleSideBar'; // Sidebar component

const AllVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get('http://localhost:8020/vehicle/allvehicles');
                setVehicles(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Available' ? 'Not available' : 'Available';
        try {
            await axios.put(`http://localhost:8020/vehicle/${id}/status`, { status: newStatus });
            setVehicles((prevVehicles) =>
                prevVehicles.map((vehicle) =>
                    vehicle._id === id ? { ...vehicle, status: newStatus } : vehicle
                )
            );
        } catch (error) {
            console.error('Error updating vehicle status:', error);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this vehicle?');
        if (!confirmDelete) return;
        try {
            await axios.delete(`http://localhost:8020/vehicle/vehicles/${id}`);
            setVehicles(vehicles.filter((vehicle) => vehicle._id !== id));
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    };

    const handleView = (id) => {
        navigate(`/vehicles/${id}`);
    };

    const handleUpdate = (id) => {
        navigate(`/vehicles/update/${id}`);
    };

    const handleRequestVehicle = async (id) => {
        try {
            await axios.put(`http://localhost:8020/vehicle/${id}/request`, { status: 'requested' });
            setVehicles((prevVehicles) =>
                prevVehicles.map((vehicle) =>
                    vehicle._id === id ? { ...vehicle, status: 'requested' } : vehicle
                )
            );
        } catch (error) {
            console.error('Error requesting vehicle:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const generateReport = () => {
        const doc = new jsPDF();
        doc.text('All Vehicles Report', 14, 16);
        const tableColumn = ['Vehicle No', 'Model', 'Registered Year', 'Chassis No', 'Capacity', 'Status'];
        const tableRows = vehicles.map(vehicle => [
            vehicle.vehicleNo,
            vehicle.model,
            vehicle.registeredYear,
            vehicle.chassisNo,
            vehicle.capacity,
            vehicle.status,
        ]);
        doc.autoTable(tableColumn, tableRows, { startY: 20 });
        doc.save('vehicles_report.pdf');
    };

    if (loading) {
        return <p className="text-center">Loading vehicles...</p>;
    }

    const filteredVehicles = vehicles.filter(vehicle =>
        vehicle.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex">
            {/* Sidebar */}
            <VehicleSidebar />

            {/* Main content */}
            <div className="flex-1 p-8 bg-[#F6F1E5] min-h-screen">
                <h2 className="text-4xl font-bold text-center text-black mb-8 shadow-md">All Vehicles</h2>

                {/* Search and Report Generation */}
                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        placeholder="Search by Vehicle No"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border border-[#2f9e4b] rounded-l-md p-2 w-full max-w-sm"
                    />
                    <button
                        onClick={generateReport}
                        className="bg-gradient-to-r from-[#4cae6e] to-[#318847] text-white py-3 rounded-lg hover:shadow-lg transition duration-300 p-6"
                    >
                        Generate Report
                    </button>
                </div>

                {/* Vehicles Table */}
                {filteredVehicles.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-[#2f9e4b] rounded-lg shadow-lg">
                            <thead className="bg-[#E2E8CE]">
                                <tr>
                                    <th className="p-4 border border-[#2f9e4b]">Vehicle No</th>
                                    <th className="p-4 border border-[#2f9e4b]">Image</th>
                                    <th className="p-4 border border-[#2f9e4b]">Registered Year</th>
                                    <th className="p-4 border border-[#2f9e4b]">Model</th>
                                    <th className="p-4 border border-[#2f9e4b]">Chassis No</th>
                                    <th className="p-4 border border-[#2f9e4b]">Capacity</th>
                                    <th className="p-4 border border-[#2f9e4b]">Status</th>
                                    <th className="p-4 border border-[#2f9e4b]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVehicles.map((vehicle) => (
                                    <tr key={vehicle._id} className="odd:bg-[#f9f9f7] even:bg-[#f1f0ea] hover:bg-[#E2E8CE] transition duration-200">
                                        <td className="p-4 border border-[#2f9e4b]">{vehicle.vehicleNo}</td>
                                        <td className="p-4 border border-[#2f9e4b]">
                                            {vehicle.imageUrl && (
                                                <img
                                                    src={`http://localhost:8020${vehicle.imageUrl}`}
                                                    alt={vehicle.vehicleNo}
                                                    className="w-24 h-auto rounded"
                                                />
                                            )}
                                        </td>
                                        <td className="p-4 border border-[#2f9e4b]">{vehicle.registeredYear}</td>
                                        <td className="p-4 border border-[#2f9e4b]">{vehicle.model}</td>
                                        <td className="p-4 border border-[#2f9e4b]">{vehicle.chassisNo}</td>
                                        <td className="p-4 border border-[#2f9e4b]">{vehicle.capacity}</td>
                                        <td className="p-4 border border-[#2f9e4b]">
                                            <button
                                                onClick={() => toggleStatus(vehicle._id, vehicle.status)}
                                                className={`text-white font-bold py-1 px-2 rounded ${
                                                    vehicle.status === 'Available' ? 'bg-green-500' : 'bg-red-500'
                                                }`}
                                            >
                                                {vehicle.status}
                                            </button>
                                        </td>
                                        <td className="p-4 border border-[#2f9e4b]">
                                            <button
                                                onClick={() => handleView(vehicle._id)}
                                                className="bg-blue-500 text-white rounded px-2 py-1 mr-1 hover:bg-blue-600"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleUpdate(vehicle._id)}
                                                className="bg-green-500 text-white rounded px-2 py-1 mr-1 hover:bg-green-600"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => handleDelete(vehicle._id)}
                                                className="bg-red-500 text-white rounded px-2 py-1 mr-1 hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => handleRequestVehicle(vehicle._id)}
                                                className="bg-yellow-500 text-white rounded px-2 py-1 hover:bg-yellow-600"
                                            >
                                                Request
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-lg">No vehicles found.</p>
                )}
            </div>
        </div>
    );
};

export default AllVehicles;
