import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get the ID from the URL
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies
import axios from 'axios'; // Import axios for making HTTP requests

const FeedbackPage = () => {
    const { id } = useParams(); // Get the pickupId from the URL
    const [description, setDescription] = useState('');
    const [starRating, setStarRating] = useState(1); // Default star rating
    const [isEditing, setIsEditing] = useState(false); // Check if we are in "edit mode"
    const [feedbackId, setFeedbackId] = useState(null); // Store feedback ID if editing
    const [errorMessage, setErrorMessage] = useState(''); // Store validation error message
    const customerId = Cookies.get('userId'); // Get customer ID from cookies

    // Fetch feedback if it exists for the given pickupId
    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get(`http://localhost:8020/feedback/feedback/pickup/${id}`);
                console.log('Fetched feedback:', response.data); // Log the feedback data

                const feedback = response.data[0]; // Assuming response.data is an array with the feedback
                if (feedback) {
                    setDescription(feedback.description);
                    setStarRating(feedback.starRating);
                    setIsEditing(true); // If feedback exists, we are in "editing" mode
                    setFeedbackId(feedback._id); // Set feedback ID for editing
                }
            } catch (error) {
                console.error('Error fetching feedback:', error);
            }
        };

        fetchFeedback();
    }, [id]);

    // Function to handle real-time validation of the description input
    const handleDescriptionChange = (e) => {
        const input = e.target.value;
        const regex = /^[a-zA-Z0-9\s]*$/;

        if (regex.test(input)) {
            setDescription(input); 
            setErrorMessage('');
        } else {
            setErrorMessage('Special characters are not allowed.');
        }
    };

    // Handle form submission (either create or update feedback)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (description.trim() === '') {
            setErrorMessage('Description cannot be empty.');
            return;
        }

        // Prepare feedback data
        const feedbackData = {
            customerId,
            pickupId: id, // Correctly set pickupId from URL param id
            description,
            starRating,
        };

        try {
            let response;
            if (isEditing) {
                // Update existing feedback
                response = await axios.put(`http://localhost:8020/feedback/feedback/${feedbackId}`, feedbackData);
            } else {
                // Create new feedback
                response = await axios.post('http://localhost:8020/feedback/feedback', feedbackData);
            }

            alert(response.data.message); // Show success message
            setDescription(''); // Reset description
            setStarRating(1); // Reset star rating
            setIsEditing(false); // Exit editing mode
        } catch (error) {
            console.error('Error submitting feedback:', error.response?.data || error.message);
            alert(error.response?.data?.error || 'An error occurred while submitting feedback.');
        }
    };

    // Handle delete feedback
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:8020/feedback/feedback/${feedbackId}`);
            alert(response.data.message); // Show success message
            setDescription(''); // Reset description
            setStarRating(1); // Reset star rating
            setIsEditing(false); // Exit editing mode
        } catch (error) {
            console.error('Error deleting feedback:', error.response?.data || error.message);
            alert(error.response?.data?.error || 'An error occurred while deleting feedback.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Update Feedback' : 'Submit Feedback'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
                        Customer ID
                    </label>
                    <input
                        type="text"
                        id="customerId"
                        value={customerId}
                        readOnly
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Feedback Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        rows="4"
                        required
                        className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 ${errorMessage ? 'border-red-500' : ''}`}
                    />
                    {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Star Rating</label>
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                onClick={() => setStarRating(star)}
                                className={`h-6 w-6 cursor-pointer ${star <= starRating ? 'text-yellow-500' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 .587l3.668 7.425 8.197 1.185-5.938 5.268 1.407 8.078L12 18.897l-7.334 3.867 1.407-8.078-5.938-5.268 8.197-1.185z" />
                            </svg>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    {isEditing ? 'Update Feedback' : 'Submit Feedback'}
                </button>

                {isEditing && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="ml-4 mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition"
                    >
                        Delete Feedback
                    </button>
                )}
            </form>
        </div>
    );
};

export default FeedbackPage;
