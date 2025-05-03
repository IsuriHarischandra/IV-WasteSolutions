import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Sample stock items
const stockItems = [
    {
        id: 1,
        name: 'Item One',
        description: 'This is a brief description of Item One.',
        quantity: 50,
        price: 100.00,
        imageUrl: 'https://via.placeholder.com/150', // Placeholder image
    },
    {
        id: 2,
        name: 'Item Two',
        description: 'This is a brief description of Item Two.',
        quantity: 30,
        price: 150.00,
        imageUrl: 'https://via.placeholder.com/150', // Placeholder image
    },
    {
        id: 3,
        name: 'Item Three',
        description: 'This is a brief description of Item Three.',
        quantity: 20,
        price: 200.00,
        imageUrl: 'https://via.placeholder.com/150', // Placeholder image
    },
];

const StockView = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    // Function to handle item click
    const handleItemClick = (itemId) => {
        navigate(`/item/${itemId}`); // Navigate to item detail page
    };

    return (
        <div className="flex flex-col items-center p-8 bg-[#F6F1E5] min-h-screen">
            <h2 className="text-5xl font-extrabold mb-8 text-[#1d9a32] shadow-md">Stock View</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {stockItems.map(item => (
                    <div 
                        key={item.id} 
                        className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer" 
                        onClick={() => handleItemClick(item.id)} // Handle click
                    >
                        <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                            <p className="text-gray-700 mb-2">{item.description}</p>
                            <p className="text-lg font-semibold">Quantity: {item.quantity}</p>
                            <p className="text-lg font-semibold">Price: ${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StockView;
