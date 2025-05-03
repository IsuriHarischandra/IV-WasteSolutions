import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import Sidebar from './employeeSideBar'; // Import your Sidebar component

const UpdateSalary = () => {
    const { id } = useParams(); // Get the salary ID from the URL
    const [salary, setSalary] = useState(null);
    const [basicSalary, setBasicSalary] = useState('');
    const [error, setError] = useState('');
    const [salaryError, setSalaryError] = useState(''); // State for salary error
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchSalary = async () => {
            try {
                const response = await axios.get(`http://localhost:8020/salary/${id}`); // Adjust the URL as needed
                setSalary(response.data);
                setBasicSalary(response.data.basicSalary); // Set initial basic salary
            } catch (error) {
                setError('Error fetching salary details');
            }
        };

        fetchSalary();
    }, [id]);

    // Handle salary input with validation
    const handleSalaryChange = (e) => {
        const value = e.target.value;

        // Check if value contains only numbers
        const isNumeric = /^[0-9]*$/.test(value);

        if (!isNumeric) {
            setSalaryError('Only numbers are allowed, no letters or special characters');
            return;
        }

        // Check if the value is within the valid range
        if (value === '' || (value >= 0 && value <= 200000)) {
            setBasicSalary(value);
            setSalaryError(''); // Clear error if valid
        } else {
            setSalaryError('Salary must be between 0 and 200,000'); // Show range error
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous error message

        // Prevent submission if there are any validation errors
        if (salaryError) {
            setError('Please fix the errors before submitting.');
            return;
        }

        try {
            await axios.put(`http://localhost:8020/salary/${id}`, { basicSalary }); // Adjust the URL as needed
            navigate('/showsalary'); // Redirect to the Show Salary page after updating
        } catch (error) {
            setError('Error updating salary');
        }
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-8 bg-[#F6F1E5] min-h-screen">
                <h2 className="text-5xl font-extrabold mb-8 text-center text-[#1d8b1d] ">Update Salary</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                {salary && (
                    <form onSubmit={handleUpdate} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Employee Name: {salary.employeeId?.name} {/* Display employee name */}
                            </label>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="basicSalary">
                                Basic Salary:
                            </label>
                            <input
                                type="text" // Use type="text" to validate input
                                id="basicSalary"
                                value={basicSalary}
                                onChange={handleSalaryChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                    salaryError ? 'border-red-500 focus:border-red-500' : ''
                                }`}
                                required
                            />
                            {salaryError && <p className="text-red-500 text-sm mt-1">{salaryError}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#1d8b1d] hover:bg-[#1d8b1d] text-white font-bold py-2 px-4 rounded"
                            disabled={!!salaryError} // Disable submit if there's an error
                        >
                            Update Salary
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UpdateSalary;
