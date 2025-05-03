import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Sample stock items (same as in StockView)
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

const ItemDetail = () => {
    const { itemId } = useParams(); // Get itemId from the URL
    const navigate = useNavigate(); // Initialize the navigate function
    const item = stockItems.find(item => item.id === parseInt(itemId)); // Find the item by ID

    if (!item) {
        return <p>Item not found.</p>; // Handle case where item is not found
    }

    // Function to handle the "Buy Now" button click
    const handleBuyNow = () => {
        // Navigate to the payment page, passing the item details
        navigate('/payment', {
            state: {
                itemId: item.id,
                itemName: item.name,
                itemPrice: item.price,
            },
        });
    };

    return (
        <div className="flex justify-center items-center p-8 bg-[#F6F1E5] min-h-screen">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-lg w-full">
                <div className="p-8">
                    <h2 className="text-4xl font-bold text-center text-[#1d9a32] mb-6">
                        {item.name}
                    </h2>
                    <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-64 h-64 mx-auto object-cover mb-6 rounded-lg shadow-md"
                    />
                    <p className="text-gray-600 text-lg text-center mb-4">
                        {item.description}
                    </p>
                    <div className="flex justify-between items-center text-lg font-semibold mb-4">
                        <span className="text-gray-800">Quantity:</span>
                        <span className="text-gray-900">{item.quantity}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-semibold mb-6">
                        <span className="text-gray-800">Price:</span>
                        <span className="text-[#1d9a32]">${item.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-center">
                        <button 
                            onClick={handleBuyNow} // Call the handler on click
                            className="bg-gradient-to-r from-[#1d9a32] to-[#1d9a32] text-white py-3 px-6 rounded-lg hover:shadow-lg transition duration-300"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetail;
