import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './employeeSideBar'; // Import your Sidebar component

const AddSalary = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [basicSalary, setBasicSalary] = useState('');
    const [error, setError] = useState('');
    const [salaryError, setSalaryError] = useState(''); // State for salary error
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch employees when the component mounts
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:8020/employee'); // Adjust the URL as needed
                setEmployees(response.data);
            } catch (error) {
                setError('Error fetching employees');
            }
        };

        fetchEmployees();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message
        setSuccessMessage(''); // Reset success message

        // Prevent form submission if there is a validation error
        if (salaryError) {
            setError('Please fix the errors before submitting.');
            return;
        }

        try {
            const newSalary = { employeeId: selectedEmployeeId, basicSalary };
            await axios.post('http://localhost:8020/salary', newSalary); // Adjust the URL as needed
            setSuccessMessage('Salary added successfully!');
            setSelectedEmployeeId(''); // Reset the employee ID field
            setBasicSalary(''); // Reset the basic salary field
        } catch (error) {
            setError('Error adding salary. Please try again.');
        }
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-8 bg-[#F6F1E5] min-h-screen">
                <h2 className="text-5xl font-extrabold mb-8 text-center text-black ">Add Salary</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4 col-span-2">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="employeeId">
                            Employee
                        </label>
                        <select
                            id="employeeId"
                            value={selectedEmployeeId}
                            onChange={(e) => setSelectedEmployeeId(e.target.value)}
                            className="mt-1 block w-full border h-10 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">Select an employee</option>
                            {employees.map((employee) => (
                                <option key={employee._id} value={employee._id}>
                                    {employee.name} (ID: {employee.employeeId})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 col-span-2">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="basicSalary">
                            Basic Salary
                        </label>
                        <input
                            type="text"
                            id="basicSalary"
                            value={basicSalary}
                            onChange={handleSalaryChange}
                            className={`mt-1 block w-full border h-10 border-gray-300 rounded-md shadow-sm focus:ring ${
                                salaryError ? 'border-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'
                            }`}
                            required
                        />
                        {salaryError && <p className="text-red-500 text-sm mt-1">{salaryError}</p>}
                    </div>
                    <div className="col-span-2 flex justify-center">
                        <button
                            type="submit"
                            className="mt-4 w-2/4 bg-[#1d8b1d] text-white font-bold py-2 px-4 rounded-md hover:bg-[#1d8b1d]"
                            disabled={!!salaryError} // Disable submit if there's a validation error
                        >
                            Add Salary
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSalary;
