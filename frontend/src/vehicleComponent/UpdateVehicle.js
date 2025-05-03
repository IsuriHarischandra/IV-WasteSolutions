import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './vehicleSideBar'; // Ensure to import your Sidebar

const UpdateVehicle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [formData, setFormData] = useState({
        vehicleNo: '',
        registeredYear: '',
        model: '',
        chassisNo: '',
        capacity: '',
        status: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState('');
    const [yearError, setYearError] = useState('');

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await axios.get(`http://localhost:8020/vehicle/vehicles/${id}`);
                setVehicle(response.data);
                setFormData({
                    vehicleNo: response.data.vehicleNo,
                    registeredYear: response.data.registeredYear,
                    model: response.data.model,
                    chassisNo: response.data.chassisNo,
                    capacity: response.data.capacity,
                    status: response.data.status,
                    image: null,
                });
                setImagePreview(response.data.imageUrl);
            } catch (error) {
                console.error('Error fetching vehicle details:', error);
                setError('Failed to fetch vehicle details');
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === 'registeredYear') {
            // Check if the registered year is within the allowed range
            const year = parseInt(value, 10);
            if (year < 1907 || year > 2025) {
                setYearError('Registered year must be between 1907 and 2024.');
            } else {
                setYearError('');
                setFormData({ ...formData, [name]: value });
            }
        } else if (name === 'image') {
            setFormData({ ...formData, image: files[0] });
            setImagePreview(URL.createObjectURL(files[0]));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (yearError) {
            return; // Do not submit if there is a year validation error
        }

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            await axios.put(`http://localhost:8020/vehicle/update/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccessMessage('Vehicle updated successfully!');
            navigate(`/allvehicles`);
        } catch (error) {
            console.error('Error updating vehicle:', error);
            setError('Failed to update vehicle details');
        }
    };

    if (loading) {
        return <p className="text-center text-lg text-gray-500">Loading vehicle details...</p>;
    }

    if (error) {
        return <p className="text-center text-lg text-red-500">{error}</p>;
    }

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-6 bg-[#F6F1E5] min-h-screen">
                <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold mb-4 text-center text-[#9e972f]">Update Vehicle</h2>
                    {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Vehicle No:</label>
                            <input
                                type="text"
                                name="vehicleNo"
                                value={formData.vehicleNo}
                                onChange={handleChange}
                                maxLength="20"  // Added maxLength attribute
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-indigo-200"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Registered Year:</label>
                            <input
                                type="number"
                                name="registeredYear"
                                value={formData.registeredYear}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-indigo-200"
                            />
                            {yearError && <p className="text-red-500">{yearError}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Model:</label>
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                maxLength="20"  // Added maxLength attribute
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-indigo-200"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Chassis No:</label>
                            <input
                                type="text"
                                name="chassisNo"
                                value={formData.chassisNo}
                                onChange={handleChange}
                                maxLength="20"  // Added maxLength attribute
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-indigo-200"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Capacity:</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                placeholder="Enter Capacity (1-100)"
                                min="1"
                                max="100"
                                maxLength="2"  // Added maxLength attribute
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-indigo-200"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Status:</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-indigo-200"
                            >
                                <option value="">Select Status</option>
                                <option value="Available">Available</option>
                                <option value="Not Available">Not Available</option>
                            </select>
                        </div>
                        <div className="mb-4 md:col-span-2">
                            <label className="block text-gray-700 font-semibold">New Image:</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-indigo-200"
                            />
                        </div>
                        {imagePreview && (
                            <div className="mb-4 md:col-span-2">
                                <img
                                    src={imagePreview}
                                    alt="New Vehicle Preview"
                                    className="w-40 h-auto rounded-lg shadow-md mt-2"
                                />
                            </div>
                        )}
                        
                        <button type="submit" className="bg-[#9e972f] hover:bg-[#7c7f24] text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">
                            Update Vehicle
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateVehicle;
