import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { FaPlusCircle, FaEye, FaUser } from 'react-icons/fa';

const AddPickUp = () => {
  const customerId = Cookies.get('userId'); // Fetch the customerId from cookies
  const [formData, setFormData] = useState({
    category: '',
    quantity: 1,
    date: '',
    time: '',
    description: '',
    location: '',
    address: '',
  });

  const [errors, setErrors] = useState({
    category: '',
    quantity: '',
    date: '',
    time: '',
    location: '',
    address: '',
  });
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    let errors = {};

    // Address Validation: Only letters, numbers, / and , allowed
    if (!/^[a-zA-Z0-9\s,\/]+$/.test(formData.address)) {
      errors.address =
        'Address can only contain letters, numbers, spaces, "/" and ","';
    }

    if (!/^[a-zA-Z0-9\s,\/]+$/.test(formData.location)) {
      errors.location =
        'Location can only contain letters, numbers, spaces, "/" and ","';
    }

    if (!/^[a-zA-Z0-9\s,\/]+$/.test(formData.description)) {
      errors.description =
        'Description can only contain letters, numbers, spaces, "/" and ","';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'quantity') {
      const quantity = parseInt(value, 10);
      // Validate quantity in real-time
      if (quantity >= 1 && quantity <= 10) {
        setFormData({
          ...formData,
          quantity: value,
        });
        setErrors((prev) => ({ ...prev, quantity: '' })); // Clear error message
      } else {
        setErrors((prev) => ({ ...prev, quantity: 'Quantity must be between 1 and 10.' }));
      }
    } else if (name === 'time') {
      // Real-time time validation
      const timePattern = /^(0[9]|1[0-5]):[0-5][0-9]$/; // Matches 09:00 - 15:59 (4 PM)
      if (timePattern.test(value)) {
        setFormData({
          ...formData,
          time: value,
        });
        setErrors((prev) => ({ ...prev, time: '' })); // Clear error message
      } else {
        setErrors((prev) => ({ ...prev, time: 'Time must be between 09:00 AM and 04:00 PM.' }));
      }
    } else if (name === "address") {
      // Real-time address validation: Only allow letters, numbers, spaces, /, and ,
      const validAddress = value.replace(/[^a-zA-Z0-9\s,\/]/g, "");
      setFormData({ ...formData, address: validAddress });

      if (!/^[a-zA-Z0-9\s,\/]+$/.test(validAddress)) {
        setErrors({
          ...errors,
          address:
            'Address can only contain letters, numbers, spaces, "/" and ","',
        });
      } else {
        const { address, ...restErrors } = errors;
        setErrors(restErrors);
      }
    }else if (name === "location") {
      // Real-time address validation: Only allow letters, numbers, spaces, /, and ,
      const validAddress = value.replace(/[^a-zA-Z0-9\s,\/]/g, "");
      setFormData({ ...formData, location: validAddress });

      if (!/^[a-zA-Z0-9\s,\/]+$/.test(validAddress)) {
        setErrors({
          ...errors,
          location:
            'Location can only contain letters, numbers, spaces, "/" and ","',
        });
      } else {
        const { location, ...restErrors } = errors;
        setErrors(restErrors);
      }
    }else if (name === "description") {
      // Real-time address validation: Only allow letters, numbers, spaces, /, and ,
      const validAddress = value.replace(/[^a-zA-Z0-9\s,\/]/g, "");
      setFormData({ ...formData, description: validAddress });

      if (!/^[a-zA-Z0-9\s,\/]+$/.test(validAddress)) {
        setErrors({
          ...errors,
          description:
            'Description can only contain letters, numbers, spaces, "/" and ","',
        });
      } else {
        const { description, ...restErrors } = errors;
        setErrors(restErrors);
      }
    }
    else {
      setFormData({
        ...formData,
        [name]: value,
      });

      // Clear error message for the field being edited
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error state
    setErrors({
      category: '',
      quantity: '',
      date: '',
      time: '',
      location: '',
      address: '',
    });

    // Validate form data
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    let hasError = false;

    if (!formData.category) {
      setErrors((prev) => ({ ...prev, category: 'Please select a category.' }));
      hasError = true;
    }

    if (formData.quantity < 1 || formData.quantity > 10) {
      setErrors((prev) => ({ ...prev, quantity: 'Quantity must be between 1 and 10.' }));
      hasError = true;
    }

    if (new Date(formData.date) < tomorrow || new Date(formData.date) > maxDate) {
      setErrors((prev) => ({ ...prev, date: 'Date must be between tomorrow and 60 days forward.' }));
      hasError = true;
    }

    // Validate time range
    const timePattern = /^(0[9]|1[0-5]):[0-5][0-9]$/; // Matches 09:00 AM - 04:00 PM
    if (!timePattern.test(formData.time)) {
      setErrors((prev) => ({ ...prev, time: 'Time must be between 09:00 AM and 04:00 PM.' }));
      hasError = true;
    }

    const addressPattern = /^[a-zA-Z0-9\s,\/]*$/; // Only allows letters, numbers, spaces, commas, and slashes
    if (!addressPattern.test(formData.address)) {
      setErrors((prev) => ({ ...prev, address: 'Address contains invalid characters. Only letters, numbers, spaces, commas, and slashes are allowed.' }));
      hasError = true;
    }

    if (hasError) return; // Stop if there are validation errors

    try {
      // Include customerId in the formData
      const completeFormData = {
        ...formData,
        customerId, // Attach the customerId from cookies
      };

      if (validate()) {
        await axios.post('http://localhost:8020/pickup/pickups', completeFormData);
      setSuccess('Pick-up request added successfully!');
      setFormData({
        category: '',
        quantity: 1,
        date: '',
        time: '',
        description: '',
        location: '',
        address: '',
      }); // Clear the form
      navigate('/viewpickup'); // Adjust the path as needed
      }
    } catch (err) {
      setErrors({ ...errors, general: 'Failed to add pick-up request. Please try again.' });
      setSuccess('');
    }
  };

  // Format dates for min and max attributes
  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  return (
    <div className="flex bg-[#F6F1E5]  items-center h-screen">
      <div className="bg-[#E2E8CE] w-1/5 min-h-screen p-4 shadow-lg">
        <ul className="space-y-4">
          <li className="transition duration-300 ease-in-out transform hover:scale-105">
            <Link to="/profile" className="flex items-center text-gray-800 hover:bg-gray-200 p-2 rounded-lg">
              <FaUser className="mr-2 text-[#41A64F]" />
              <span>My Profile</span>
            </Link>
          </li>
          <li className="transition duration-300 ease-in-out transform hover:scale-105">
            <Link to="/addpickup" className="flex items-center text-gray-800 hover:bg-gray-200 p-2 rounded-lg">
              <FaPlusCircle className="mr-2 text-[#41A64F]" />
              <span>Add Pick-Up Request</span>
            </Link>
          </li>
          <li className="transition duration-300 ease-in-out transform hover:scale-105">
            <Link to="/viewpickup" className="flex items-center text-gray-800 hover:bg-gray-200 p-2 rounded-lg">
              <FaEye className="mr-2 text-[#41A64F]" />
              <span>View Pick-Up Requests</span>
            </Link>
          </li>
          <li className="transition duration-300 ease-in-out transform hover:scale-105">
            <Link to="/adddailycollection" className="flex items-center text-gray-800 hover:bg-gray-200 p-2 rounded-lg">
              <FaPlusCircle className="mr-2 text-[#41A64F]" />
              <span>Add Daily Collection</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className='flex justify-center items-center w-full'>
        <div className="max-w-4xl w-4/5 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-black text-center">Add New Pick-up Request</h2>
          
          {errors.general && <div className="mb-4 text-red-600">{errors.general}</div>}
          {success && <div className="mb-4 text-green-600">{success}</div>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-black">Category:</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                required 
                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 ${errors.category ? 'border-red-500' : ''}`}
              >
                <option value="">Select category</option>
                <option value="organic">Organic</option>
                <option value="e-waste">E-Waste</option>
                <option value="plastic">Plastic</option>
                <option value="mix">Mix</option>
                <option value="metallic/copper/glass">Metallic/Copper/Glass</option>
              </select>
              {errors.category && <div className="text-red-600 text-sm">{errors.category}</div>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black">Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                max="10"
                required
                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 ${errors.quantity ? 'border-red-500' : ''}`}
              />
              {errors.quantity && <div className="text-red-600 text-sm">{errors.quantity}</div>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black">Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={formatDate(new Date(new Date().setDate(new Date().getDate() + 1)))} // Tomorrow
                max={formatDate(new Date(new Date().setDate(new Date().getDate() + 60)))} // 60 days from today
                required
                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 ${errors.date ? 'border-red-500' : ''}`}
              />
              {errors.date && <div className="text-red-600 text-sm">{errors.date}</div>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black">Time:</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 ${errors.time ? 'border-red-500' : ''}`}
              />
              {errors.time && <div className="text-red-600 text-sm">{errors.time}</div>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black">Description (optional):</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.description && <div className="text-red-600 text-sm">{errors.description}</div>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black">Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 ${errors.location ? 'border-red-500' : ''}`}
              />
              {errors.location && <div className="text-red-600 text-sm">{errors.location}</div>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black">Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                pattern="^[a-zA-Z0-9\s,\/]*$"  // Matches the back-end validation
                required
                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 ${errors.address ? 'border-red-500' : ''}`}
              />
              {errors.address && <div className="text-red-600 text-sm">{errors.address}</div>}
            </div>

            <button
              type="submit"
              className="col-span-1 md:col-span-2 mt-4 w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg hover:shadow-lg hover:from-green-600 hover:to-green-800 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPickUp;
