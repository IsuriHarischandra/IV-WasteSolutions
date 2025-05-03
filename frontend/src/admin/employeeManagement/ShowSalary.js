import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Sidebar from './employeeSideBar'; // Import your Sidebar component
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



  // Function to generate the PDF report
const generateReport = () => {
    const doc = new jsPDF();

    // Add "IV-Waste Solutions" styled as a logo at the top of the PDF
    doc.setFontSize(25); // Set a large font size for the logo text
    doc.setFont('helvetica', 'bold'); // Set the font style to bold
    doc.text('IV-Waste Solutions', 105, 30, { align: 'center' }); // Centered at (x: 105, y: 30)

    // Add the subtitle below the main text (Address)
    doc.setFontSize(10); // Set smaller font size for the subtitle
    doc.setFont('helvetica', 'normal'); // Set font style back to normal
    doc.text('Welivita Road, Kaduwela', 105, 35, { align: 'left' }); // Centered at (x: 105, y: 35)

    // Add space after the logo and address
    doc.setFontSize(16); // Reset font size for the report title
    doc.text('Salary Report', 14, 60); // Title at (x: 14, y: 60)

    // Use autoTable to generate a table for the salary details
    doc.autoTable({
        startY: 70, // Start the table after the title
        head: [['Employee Name', 'Basic Salary', 'EPF', 'ETF']],
        body: salaries.map((salary) => [
            salary.employeeId?.name || 'N/A',
            salary.basicSalary,
            salary.epf,
            salary.etf,
        ]),
    });

    // Save the PDF
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
