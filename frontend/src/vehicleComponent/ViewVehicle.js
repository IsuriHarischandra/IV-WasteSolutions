import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from './vehicleSideBar'; // Import your Sidebar component

const ViewVehicle = () => {
    const { id } = useParams(); // Get the vehicle ID from the URL
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await axios.get(`http://localhost:8020/vehicle/vehicles/${id}`);
                setVehicle(response.data);
            } catch (error) {
                console.error('Error fetching vehicle details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [id]);

    if (loading) {
        return <p className="text-center text-lg text-gray-500">Loading vehicle details...</p>;
    }

    if (!vehicle) {
        return <p className="text-center text-lg text-red-500">Vehicle not found.</p>;
    }

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-6 bg-[#F6F1E5] min-h-screen">
                <div className="max-w-lg mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                    <h2 className="text-3xl font-bold mb-4 text-center text-black">Vehicle Details</h2>
                    <div className="space-y-2">
                        <p className="text-lg">
                            <strong className="font-medium">Vehicle No:</strong> {vehicle.vehicleNo}
                        </p>
                        <p className="text-lg">
                            <strong className="font-medium">Registered Year:</strong> {vehicle.registeredYear}
                        </p>
                        <p className="text-lg">
                            <strong className="font-medium">Model:</strong> {vehicle.model}
                        </p>
                        <p className="text-lg">
                            <strong className="font-medium">Chassis No:</strong> {vehicle.chassisNo}
                        </p>
                        <p className="text-lg">
                            <strong className="font-medium">Capacity:</strong> {vehicle.capacity}
                        </p>
                        <p className="text-lg">
                            <strong className="font-medium">Status:</strong> {vehicle.status}
                        </p>
                    </div>
                    {vehicle.imageUrl && (
                        <img
                            src={`http://localhost:8020${vehicle.imageUrl}`}
                            alt={vehicle.vehicleNo}
                            className="w-full h-auto mt-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                        />
                    )}
                    <div className="mt-4">
                        <button 
                            className="w-full py-2 px-4 bg-gradient-to-r from-[#2f9e4b] to-[#2f9e4b] text-white rounded-lg hover:shadow-lg transition duration-300 p-6"
                            onClick={() => window.history.back()}
                        >
                            Back to Vehicles
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewVehicle;
