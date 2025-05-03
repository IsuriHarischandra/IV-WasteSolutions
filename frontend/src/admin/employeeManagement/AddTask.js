import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './employeeSideBar'; // Import your Sidebar component

const AddTask = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedEmployeeId, setAssignedEmployeeId] = useState('');
    const [status, setStatus] = useState('pending');
    const [priority, setPriority] = useState('low');
    const [dueDate, setDueDate] = useState('');
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [dateError, setDateError] = useState('');

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

    const specialCharPattern = /^[a-zA-Z0-9 ]*$/; // Regex pattern to allow only alphanumeric characters and spaces

    const handleTitleChange = (e) => {
        const value = e.target.value;
        if (!specialCharPattern.test(value)) {
            setTitleError('Special characters are not allowed in the title');
        } else {
            setTitleError('');
        }
        setTitle(value.replace(/[^a-zA-Z0-9 ]/g, '')); // Remove special characters
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        if (!specialCharPattern.test(value)) {
            setDescriptionError('Special characters are not allowed in the description');
        } else {
            setDescriptionError('');
        }
        setDescription(value.replace(/[^a-zA-Z0-9 ]/g, '')); // Remove special characters
    };

    // Get today's date
    const today = new Date();
    // Set minimum date as tomorrow
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 1);

    // Set maximum date as 60 days from today
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 60);

    // Format the date to YYYY-MM-DD for use in input's min and max attributes
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (titleError || descriptionError || dateError) {
            setError('Please fix the errors before submitting');
            return;
        }
        try {
            const newTask = {
                title,
                description,
                assignedEmployeeId,
                status,
                priority,
                dueDate,
            };
            await axios.post('http://localhost:8020/task', newTask); // Adjust the URL as needed
            alert('Task added successfully!');
            // Reset form fields
            setTitle('');
            setDescription('');
            setAssignedEmployeeId('');
            setStatus('pending');
            setPriority('low');
            setDueDate('');
        } catch (error) {
            setError('Error adding task');
        }
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-8 bg-[#ffffff] min-h-screen">
                <h2 className="text-5xl font-extrabold mb-8 text-center text-black ">Add Task</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Side */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="title">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={handleTitleChange}
                            className="mt-1 block w-full border h-10 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        {titleError && <p className="text-red-500 text-sm">{titleError}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="assignedEmployeeId">
                            Assigned Employee
                        </label>
                        <select
                            id="assignedEmployeeId"
                            value={assignedEmployeeId}
                            onChange={(e) => setAssignedEmployeeId(e.target.value)}
                            className="mt-1 block w-full border h-10 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">Select an employee</option>
                            {employees.map((employee) => (
                                <option key={employee._id} value={employee._id}>
                                    {employee.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="status">
                            Status
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="mt-1 block w-full border h-10 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="pending">Pending</option>
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    
                    {/* Right Side */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={handleDescriptionChange}
                            className="mt-1 block w-full border h-20 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        {descriptionError && <p className="text-red-500 text-sm">{descriptionError}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="priority">
                            Priority
                        </label>
                        <select
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="mt-1 block w-full border h-10 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="dueDate">
                            Due Date
                        </label>
                        <input
                            type="date"
                            id="dueDate"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="mt-1 block w-full border h-10 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                            min={formatDate(minDate)} // Set minimum date as tomorrow
                            max={formatDate(maxDate)} // Set maximum date as 60 days from today
                            required
                        />
                        {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
                    </div>

                    <div className="col-span-2 flex justify-center">
                        <button
                            type="submit"
                            className="mt-4 w-2/4 bg-[#1d8b1d] text-white font-bold py-2 px-4 rounded-md hover:bg-[#1d8b1d]"
                        >
                            Add Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTask;
