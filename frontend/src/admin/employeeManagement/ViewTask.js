import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import Sidebar from './employeeSideBar'; // Import the Sidebar component

const ViewTask = () => {
    const [tasks, setTasks] = useState([]); // State for storing tasks
    const [searchTerm, setSearchTerm] = useState(''); // State for search functionality
    const navigate = useNavigate(); // Used for navigation to different pages

    // Fetch tasks when the component is mounted
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:8020/task');
                setTasks(response.data); // Store fetched tasks
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    // Handle task deletion
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`http://localhost:8020/task/${id}`); // Delete task by ID
                setTasks(tasks.filter((task) => task._id !== id)); // Remove the deleted task from the state
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    // Generate a PDF report for the tasks
    const handleGenerateReport = () => {
        const doc = new jsPDF();
    
        // Add "IV-Waste Solutions" styled as a logo at the top of the PDF
        doc.setFontSize(25); // Set a large font size for the logo text
        doc.setFont('helvetica', 'bold'); // Set the font style to bold
        doc.text('IV-Waste Solutions', 105, 30, { align: 'center' }); // Centered at (x: 105, y: 30)
    
        // Add the subtitle below the main text (Address)
        doc.setFontSize(10); // Set smaller font size for the subtitle
        doc.setFont('helvetica', 'normal'); // Set font style back to normal
        doc.text('Welivita Road, Kaduwela', 105, 35, { align: 'left' }); // Centered at (x: 105, y: 40)
    
        // Add space after the logo and address
        doc.setFontSize(16); // Reset font size for the report title
        doc.text('Tasks Report', 14, 60); // Title at (x:14, y:60)
    
        // Use autoTable to generate a table for the tasks
        doc.autoTable({
            startY: 70, // Start the table after the title
            head: [['Title', 'Description', 'Assigned Employee', 'Status', 'Priority', 'Due Date']],
            body: tasks.map((task) => [
                task.title,
                task.description,
                task.assignedEmployeeId?.name || 'N/A',
                task.status,
                task.priority,
                new Date(task.dueDate).toLocaleDateString(),
            ]),
        });
    
        // Save the PDF
        doc.save('tasks_report.pdf');
    };
    
    


    // Filter tasks based on search term
    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-8 bg-[#ffffff] min-h-screen">
                <h1 className="text-5xl font-extrabold mb-8 text-center text-black ">
                    Task Management
                </h1>

                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-2 border-[#1d8b1d] p-3 rounded w-2/4 mr-4 shadow-md focus:outline-none focus:ring-2 focus:ring-[#9e972f] transition duration-200"
                    />
                    <button
                        className="bg-gradient-to-r from-[#4cae6e] to-[#318847] text-white py-3 rounded-lg hover:shadow-lg transition duration-300 p-6"
                        onClick={handleGenerateReport}
                    >
                        Generate Report
                    </button>
                </div>

                <table className="min-w-full bg-white border border-[#1d8b1d] rounded-lg shadow-lg overflow-hidden">
                    <thead>
                        <tr className="bg-[#E2E8CE] text-left">
                            <th className="border border-[#2f9e4b] p-4 font-semibold">Title</th>
                            <th className="border border-[#2f9e4b] p-4 font-semibold">Description</th>
                            <th className="border border-[#2f9e4b] p-4 font-semibold">Assigned Employee</th>
                            <th className="border border-[#2f9e4b] p-4 font-semibold">Status</th>
                            <th className="border border-[#2f9e4b] p-4 font-semibold">Priority</th>
                            <th className="border border-[#2f9e4b] p-4 font-semibold">Due Date</th>
                            <th className="border border-[#2f9e4b] p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map((task) => (
                            <tr key={task._id} className="odd:bg-[#f9f9f7] even:bg-[#f1f0ea] transition duration-200 hover:bg-[#E2E8CE]">
                                <td className="border border-[#2f9e4b] p-4">{task.title}</td>
                                <td className="border border-[#2f9e4b] p-4">{task.description}</td>
                                <td className="border border-[#2f9e4b] p-4">
                                    {task.assignedEmployeeId?.name || 'Unassigned'}
                                </td>
                                <td className="border border-[#2f9e4b] p-4">{task.status}</td>
                                <td className="border border-[#2f9e4b] p-4">{task.priority}</td>
                                <td className="border border-[#2f9e4b] p-4">
                                    {new Date(task.dueDate).toLocaleDateString()}
                                </td>
                                <td className="border border-[#2f9e4b] p-4 flex gap-2">
                                    <button
                                        className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                                        onClick={() => navigate(`/updatetask/${task._id}`)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                                        onClick={() => handleDelete(task._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewTask;
