import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './vehicleSideBar'; // Ensure to import your Sidebar

const VehicleAdd = () => {
    const [vehicleNo, setVehicleNo] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [registeredYear, setRegisteredYear] = useState('');
    const [model, setModel] = useState('');
    const [chassisNo, setChassisNo] = useState('');
    const [capacity, setCapacity] = useState('');
    const [status, setStatus] = useState('available');
    const [file, setFile] = useState(null);
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleVehicleNoChange = (e) => {
        const value = e.target.value;
        if (value.length >= 5 && value.length <= 15) {
            setVehicleNo(value);
        } else if (value.length < 5) {
            setVehicleNo(value);
        }
    };

    const handleChassisNoChange = (e) => {
        const value = e.target.value;
        if (value.length >= 5 && value.length <= 20) {
            setChassisNo(value);
        } else if (value.length < 5) {
            setChassisNo(value);
        }
    };

    const handleCapacityChange = (e) => {
        const value = e.target.value;
        if (value === '' || (value >= 1 && value <= 100)) {
            setCapacity(value);
        }
    };

    const handleRegisteredYearChange = (e) => {
        setRegisteredYear(e.target.value);
    };

    const validateRegisteredYear = () => {
        if (registeredYear < 1920) {
            setRegisteredYear(1920);
        } else if (registeredYear > 2024) {
            setRegisteredYear(2024);
        }
    };

    const handleModelChange = (e) => {
        const value = e.target.value;
        if (value.length <= 20) {
            setModel(value); // Update the model only if length is less than or equal to 20
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('vehicleNo', vehicleNo);
        formData.append('image', file);
        formData.append('registeredYear', registeredYear);
        formData.append('model', model);
        formData.append('chassisNo', chassisNo);
        formData.append('capacity', capacity);
        formData.append('status', status);

        try {
            const response = await axios.post('http://localhost:8020/vehicle/vehicles', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess('Vehicle added successfully!');
            setTimeout(() => {
                navigate('/allvehicles');
            }, 2000);
        } catch (error) {
            console.error('Error adding vehicle:', error);
        }
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-8 bg-white min-h-screen">
                <h2 className="text-3xl font-bold mb-4 text-center text-black">Add New Vehicle</h2>
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicleNo">
                            Vehicle No
                        </label>
                        <input
                            type="text"
                            id="vehicleNo"
                            value={vehicleNo}
                            onChange={handleVehicleNoChange}
                            placeholder="Enter Vehicle No"
                            required
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                            Vehicle Image
                        </label>
                        <input
                            type="file"
                            id="image"
                            onChange={handleFileChange}
                            required
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="registeredYear">
                            Registered Year
                        </label>
                        <input
                            type="number"
                            id="registeredYear"
                            value={registeredYear}
                            onChange={handleRegisteredYearChange}
                            onBlur={validateRegisteredYear} // Validate on blur
                            placeholder="Enter Registered Year (e.g., 2020)"
                            min="1920"
                            max="2024"
                            required
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model">
                            Model
                        </label>
                        <input
                            type="text"
                            id="model"
                            value={model}
                            onChange={handleModelChange} // Updated here
                            placeholder="Enter Vehicle Model"
                            required
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="chassisNo">
                            Chassis No
                        </label>
                        <input
                            type="text"
                            id="chassisNo"
                            value={chassisNo}
                            onChange={handleChassisNoChange}
                            placeholder="Enter Chassis No"
                            min="99999"
                            max="99999999999999999999"
                            required
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capacity">
                            Capacity
                        </label>
                        <input
                            type="number"
                            id="capacity"
                            value={capacity}
                            onChange={handleCapacityChange}
                            placeholder="Enter Capacity (1-100)"
                            min="1"
                            max="100"
                            required
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                            Status
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="Available">Available</option>
                            <option value="Not available">Not Available</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-[#9e972f] hover:bg-[#7c7f24] text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
                    >
                        Add Vehicle
                    </button>
                </form>

                {/* Display success message */}
                {success && <p className="mt-4 text-green-500">{success}</p>}
            </div>
        </div>
    );
};

export default VehicleAdd;
