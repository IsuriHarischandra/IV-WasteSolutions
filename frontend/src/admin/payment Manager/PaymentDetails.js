import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import jsPDF AutoTable plugin
import Sidebar from './paymentSideBar'; // Assuming the same sidebar used in EmployeeView

const PaymentDetails = () => {
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');

    // Fetch all payments
    const fetchPayments = async () => {
        try {
            const response = await fetch('http://localhost:8020/payment'); // Your API endpoint
            if (response.ok) {
                const data = await response.json();
                setPayments(data);
                setFilteredPayments(data); // Set the initial filtered payments to all payments
            } else {
                setMessage('Failed to fetch payments.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    // Handle search
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        const filtered = payments.filter(payment =>
            payment.itemName.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setFilteredPayments(filtered);
    };

    // Handle payment status update
    const updatePaymentStatus = async (paymentId, status) => {
        try {
            const response = await fetch(`http://localhost:8020/payment/${paymentId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                setMessage(`Payment ${status} successfully!`);
                fetchPayments(); // Refresh the payments list
            } else {
                setMessage('Failed to update payment status.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    // Handle payment deletion
    const deletePayment = async (paymentId) => {
        if (window.confirm('Are you sure you want to delete this payment?')) {
            try {
                const response = await fetch(`http://localhost:8020/payment/${paymentId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setMessage('Payment deleted successfully!');
                    fetchPayments(); // Refresh the payments list
                } else {
                    setMessage('Failed to delete payment.');
                }
            } catch (error) {
                console.error('Error:', error);
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    // Generate PDF report
    const generatePDF = () => {
        const doc = new jsPDF();
        
        // Add logo text
        doc.setFontSize(25); // Set a large font size for the logo text
        doc.setFont('helvetica', 'bold'); // Set the font style to bold
        doc.text('IV-Waste Solutions', 105, 30, { align: 'center' }); // Centered at (x: 105, y: 30)
        
        // Add subtitle below the main text (Address)
        doc.setFontSize(10); // Set smaller font size for the subtitle
        doc.setFont('helvetica', 'normal'); // Set font style back to normal
        doc.text('Welivita Road, Kaduwela', 105, 35, { align: 'center' }); // Centered at (x: 105, y: 35)
        
        // Add title
        doc.setFontSize(20);
        doc.text('Payment Report', 14, 50);
        
        doc.setFontSize(12);
        
        // Prepare table data
        const tableData = filteredPayments.map(payment => [
            payment.itemId,
            payment.itemName,
            payment.itemPrice.toFixed(2),
            payment.customerId,
            payment.status,
        ]);

        // Create table in PDF
        doc.autoTable({
            head: [['Item ID', 'Item Name', 'Price', 'Customer Id', 'Status']],
            body: tableData,
            startY: 60, // Start below the title
        });

        // Save the PDF
        doc.save('payment_report.pdf');
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-8 bg-white min-h-screen">
                <h2 className="text-4xl font-extrabold text-center text-black mb-6">Payment Details</h2>
                {message && <p className="text-center text-red-500 mb-4">{message}</p>}

                {/* Search Bar */}
                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search by item name..."
                        className="border-2 border-[#2f9e5f] p-3 rounded w-2/4 mr-4 shadow-md focus:outline-none focus:ring-2 focus:ring-[#2f9e54] transition duration-200"
                    />

                    <button
                        onClick={generatePDF}
                        className="bg-gradient-to-r from-[#4cae6e] to-[#318847] text-white py-3 rounded-lg hover:shadow-lg transition duration-300 p-6"
                    >
                        Generate Report
                    </button>
                </div>

                {/* Payments Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-[#9e972f] rounded-lg shadow-lg overflow-hidden">
                        <thead>
                            <tr className="bg-[#E2E8CE] text-left">
                                <th className="border border-[#2f9e4b] p-4 font-semibold">Item ID</th>
                                <th className="border border-[#2f9e4b] p-4 font-semibold">Item Name</th>
                                <th className="border border-[#2f9e4b] p-4 font-semibold">Price</th>
                                <th className="border border-[#2f9e4b] p-4 font-semibold">Customer Id</th>
                                <th className="border border-[#2f9e4b] p-4 font-semibold">Status</th>
                                <th className="border border-[#2f9e4b] p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map((payment) => (
                                <tr key={payment._id} className="odd:bg-[#f9f9f7] even:bg-[#f1f0ea] transition duration-200 hover:bg-[#E2E8CE]">
                                    <td className="border border-[#2f9e4b] p-4">{payment.itemId}</td>
                                    <td className="border border-[#2f9e4b] p-4">{payment.itemName}</td>
                                    <td className="border border-[#2f9e4b] p-4">{payment.itemPrice.toFixed(2)}</td>
                                    <td className="border border-[#2f9e4b] p-4">{payment.customerId}</td>
                                    <td className="border border-[#2f9e4b] p-4">{payment.status}</td>
                                    <td className="border border-[#2f9e4b] p-4">
                                        <button
                                            onClick={() => updatePaymentStatus(payment._id, payment.status === 'paid' ? 'unpaid' : 'paid')}
                                            className="bg-[#2f9e4b] text-white py-1 px-3 rounded mr-2"
                                        >
                                            {payment.status === 'paid' ? 'Mark Unpaid' : 'Mark Paid'}
                                        </button>
                                        <button
                                            onClick={() => deletePayment(payment._id)}
                                            className="bg-red-500 text-white py-1 px-3 rounded"
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
        </div>
    );
};

export default PaymentDetails;
