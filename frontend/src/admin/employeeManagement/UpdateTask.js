import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './employeeSideBar'; // Import your Sidebar component

const UpdateTask = () => {
    const { id } = useParams(); // Get the task ID from the URL
    const navigate = useNavigate(); // Initialize useNavigate
    const [task, setTask] = useState({
        title: '',
        description: '',
        assignedEmployeeId: '',
        status: '',
        priority: '',
        dueDate: '',
    });
    const [employees, setEmployees] = useState([]); // State to store employees
    const [error, setError] = useState('');
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [dateError, setDateError] = useState('');

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`http://localhost:8020/task/${id}`);
                setTask(response.data);
            } catch (error) {
                console.error('Error fetching task:', error);
                setError('Failed to fetch task details.');
            }
        };

        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:8020/employee'); // Adjust this URL as needed
                setEmployees(response.data); // Store employees in state
            } catch (error) {
                console.error('Error fetching employees:', error);
                setError('Failed to fetch employees.');
            }
        };

        fetchTask();
        fetchEmployees(); // Fetch employees when the component mounts
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value });
    };

    const specialCharPattern = /^[a-zA-Z0-9 ]*$/; // Regex pattern to allow only alphanumeric characters and spaces
    
    const handleTitleChange = (e) => {
        const value = e.target.value;
        if (!specialCharPattern.test(value)) {
            setTitleError('Special characters are not allowed in the title');
        } else {
            setTitleError('');
        }
        setTask({ ...task, title: value.replace(/[^a-zA-Z0-9 ]/g, '') }); // Update task state
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        if (!specialCharPattern.test(value)) {
            setDescriptionError('Special characters are not allowed in the description');
        } else {
            setDescriptionError('');
        }
        setTask({ ...task, description: value.replace(/[^a-zA-Z0-9 ]/g, '') }); // Update task state
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
            await axios.put(`http://localhost:8020/task/${id}`, task);
            navigate('/viewtask'); // Redirect to the task list after update
        } catch (error) {
            console.error('Error updating task:', error);
            setError('Failed to update task. Please try again.');
        }
    };

    return (
        <div className="flex min-h-screen bg-[#ffffff]">
            <Sidebar /> {/* Add Sidebar component here */}
            <div className="flex-1 p-8">
                <h2 className="text-5xl font-extrabold mb-8 text-center text-[#1d8b1d] ">Update Task</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Side */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="title">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={task.title}
                            onChange={handleTitleChange}
                            className="mt-1 block w-full border h-10 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        {titleError && <p className="text-red-500 text-sm">{titleError}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={task.description}
                            onChange={handleDescriptionChange}
                            className="mt-1 block w-full border h-20 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        {descriptionError && <p className="text-red-500 text-sm">{descriptionError}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="assignedEmployeeId">
                            Assigned Employee
                        </label>
                        <select
                            name="assignedEmployeeId"
                            value={task.assignedEmployeeId}
                            onChange={handleChange}
                            className="mt-1 block w-full border h-10 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="" disabled>Select an Employee</option>
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
                            name="status"
                            value={task.status}
                            onChange={handleChange}
                            className="mt-1 block w-full border h-10 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="" disabled>Select Status</option>
                            <option value="pending">Pending</option>
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    
                    {/* Right Side */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="priority">
                            Priority
                        </label>
                        <select
                            name="priority"
                            value={task.priority}
                            onChange={handleChange}
                            className="mt-1 block w-full border h-10 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="" disabled>Select Priority</option>
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
                            name="dueDate"
                            value={task.dueDate ? task.dueDate.slice(0, 10) : ''}
                            onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                            min={formatDate(minDate)} // Set minimum date as tomorrow
                            max={formatDate(maxDate)} 
                            className="mt-1 block w-full border h-10 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
                    </div>
                    <div className="col-span-2 flex justify-center">
                        <button
                            type="submit"
                            className="mt-4 w-2/4 bg-[#1d8b1d] text-white font-bold py-2 px-4 rounded-md hover:bg-[#1d8b1d]"
                        >
                            Update Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateTask;
