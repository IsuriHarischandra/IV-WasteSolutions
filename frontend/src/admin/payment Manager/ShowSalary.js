import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Sidebar from './paymentSideBar'; // Import your Sidebar component
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import jsPDF autotable for table generation

const ShowSalary = () => {
    const [salaries, setSalaries] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const response = await axios.get('http://localhost:8020/salary'); // Adjust the URL as needed
                setSalaries(response.data);
            } catch (error) {
                setError('Error fetching salaries');
            }
        };

        fetchSalaries();
    }, []);

    // Function to handle delete action
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8020/salary/${id}`); // Adjust the URL as needed
            setSalaries(salaries.filter(salary => salary._id !== id)); // Update state after deletion
        } catch (error) {
            setError('Error deleting salary');
        }
    };

    // Function to navigate to update salary page
    const handleUpdate = (salaryId) => {
        navigate(`/updatesalary/${salaryId}`); // Adjust the route as necessary
    };

    // Function to generate report
    const generateReport = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Salary Report', 14, 22);

        const tableColumn = ["Employee Name", "Basic Salary", "EPF", "ETF"];
        const tableRows = salaries.map(salary => [
            salary.employeeId?.name,
            salary.basicSalary,
            salary.epf,
            salary.etf
        ]);

        doc.autoTable(tableColumn, tableRows, { startY: 30 });
        doc.save('salary_report.pdf');
    };

    // Filter salaries based on search term
    const filteredSalaries = salaries.filter(salary =>
        salary.employeeId?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-8 bg-[#F6F1E5] min-h-screen">
                <h2 className="text-5xl font-extrabold mb-8 text-center text-[#1d8b1d] ">Show Salaries</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                {/* Search Bar */}
                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        placeholder="Search by Employee Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-2 border-[#1d8b1d] p-3 rounded w-2/4 mr-4 shadow-md focus:outline-none focus:ring-2 focus:ring-[#9e972f] transition duration-200"
                    />

                    <button
                        onClick={generateReport}
                        className="bg-gradient-to-r from-[#1d8b1d] to-[#1d8b1d] text-white py-3 rounded-lg hover:shadow-lg transition duration-300 p-6"
                    >
                        Generate Report
                    </button>

                </div>

                

                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="w-full bg-[#1d8b1d] text-white text-left">
                            <th className="py-2 px-4">Employee Name</th>
                            <th className="py-2 px-4">Basic Salary</th>
                            <th className="py-2 px-4">EPF (Employees' Provident Fund)</th>
                            <th className="py-2 px-4">ETF (Employees' Trust Fund)</th>
                            <th className="py-2 px-4">Actions</th> {/* New Actions column */}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSalaries.length > 0 ? (
                            filteredSalaries.map((salary) => (
                                <tr key={salary._id} className="border-b">
                                    <td className="py-2 px-4">{salary.employeeId?.name}</td>
                                    <td className="py-2 px-4">{salary.basicSalary}</td>
                                    <td className="py-2 px-4">{salary.epf}</td>
                                    <td className="py-2 px-4">{salary.etf}</td>
                                    <td className="py-2 px-4">
                                        <button 
                                            onClick={() => handleUpdate(salary._id)} 
                                            className="text-blue-500 hover:underline"
                                        >
                                            Update
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(salary._id)} 
                                            className="text-red-500 hover:underline ml-4"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-4 text-center">No salary records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShowSalary;
