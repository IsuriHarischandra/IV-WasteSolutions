import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Sidebar from './employeeSideBar';

const EmployeeView = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8020/employee/");
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (err) {
        setError("Failed to fetch employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:8020/employee/${id}`);
      const updatedEmployees = employees.filter((employee) => employee._id !== id);
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
    } catch (error) {
      console.error("Failed to delete employee", error);
    }
  };

  const updateEmployee = (employeeId) => {
    navigate(`/employeeupdate/${employeeId}`);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === "") {
      setFilteredEmployees(employees);
    } else {
      const filteredList = employees.filter((employee) =>
        employee.name.toLowerCase().includes(term)
      );
      setFilteredEmployees(filteredList);
    }
  };

  const generatePDF = () => {
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
    doc.text('Employee Report', 14, 60); // Title at (x:14, y:60)

    const tableColumn = ["Employee ID", "Name", "NIC", "Email", "Contact Number"];
    const tableRows = [];

    filteredEmployees.forEach((employee) => {
      const employeeData = [
        employee.employeeId,
        employee.name,
        employee.nic,
        employee.email,
        employee.contactNumber,
      ];
      tableRows.push(employeeData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 65 }); // Start the table below the title
    doc.save("employee_report.pdf");
  };

  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-[#ffffff] min-h-screen">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-black ">Employee List</h1>

        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearch}
            className="border-2 border-[#1d8b1d] p-3 rounded w-2/4 mr-4 shadow-md focus:outline-none focus:ring-2 focus:ring-[#1d8b1d] transition duration-200"
          />
          <button
            onClick={generatePDF}
            className="bg-gradient-to-r from-[#4cae6e] to-[#318847] text-white py-3 rounded-lg hover:shadow-lg transition duration-300 p-6"
          >
            Generate Report
          </button>
        </div>

        <table className="min-w-full bg-white border border-[#1d8b1d] rounded-lg shadow-lg overflow-hidden">
          <thead>
            <tr className="bg-[#E2E8CE] text-left">
              <th className="border border-[#2f9e4b] p-4 font-semibold">Employee ID</th>
              <th className="border border-[#2f9e4b] p-4 font-semibold">Name</th>
              <th className="border border-[#2f9e4b] p-4 font-semibold">NIC</th>
              <th className="border border-[#2f9e4b] p-4 font-semibold">Email</th>
              <th className="border border-[#2f9e4b] p-4 font-semibold">Contact Number</th>
              <th className="border border-[#2f9e4b] p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.employeeId} className="odd:bg-[#f9f9f7] even:bg-[#f1f0ea] transition duration-200 hover:bg-[#E2E8CE]">
                <td className="border border-[#2f9e4b] p-4">{employee.employeeId}</td>
                <td className="border border-[#2f9e4b] p-4">{employee.name}</td>
                <td className="border border-[#2f9e4b] p-4">{employee.nic}</td>
                <td className="border border-[#2f9e4b] p-4">{employee.email}</td>
                <td className="border border-[#2f9e4b] p-4">{employee.contactNumber}</td>
                <td className="border border-[#2f9e4b] p-4 flex gap-2">
                  <button
                    onClick={() => updateEmployee(employee._id)}
                    className="bg-[#1d8b1d] text-white py-1 px-3 rounded hover:bg-[#145214] transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEmployee(employee._id)}
                    className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-200"
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

export default EmployeeView;
