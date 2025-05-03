import React, { forwardRef } from 'react';

const PrintableReport = forwardRef(({ reportData }, ref) => (
    <div ref={ref} style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Waste Report</h1>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th style={tableHeaderStyle}>Type</th>
                    <th style={tableHeaderStyle}>Location</th>
                    <th style={tableHeaderStyle}>Quantity</th>
                    <th style={tableHeaderStyle}>Image</th>
                    <th style={tableHeaderStyle}>User Email</th> {/* User Email column */}
                </tr>
            </thead>
            <tbody>
                {reportData.map((entry) => (
                    <tr key={entry._id}>
                        <td style={tableCellStyle}>{entry.type}</td>
                        <td style={tableCellStyle}>{entry.location}</td>
                        <td style={tableCellStyle}>{entry.quantity}</td>
                        <td style={tableCellStyle}>
                            {entry.image ? (
                                <img 
                                    src={`http://localhost:8000/${entry.image}`} 
                                    alt="Waste" 
                                    style={{ width: '100px', borderRadius: '5px' }} 
                                />
                            ) : (
                                'No Image'
                            )}
                        </td>
                        <td style={tableCellStyle}>{entry.email}</td> {/* Display User Email */}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
));

// Styles for table header and cells
const tableHeaderStyle = {
    backgroundColor: '#f2f2f2',
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    fontWeight: 'bold',
};

const tableCellStyle = {
    border: '1px solid #ddd',
    padding: '8px',
};

export default PrintableReport;
