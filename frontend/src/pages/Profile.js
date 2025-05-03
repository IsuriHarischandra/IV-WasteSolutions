import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPlusCircle, FaEye, FaUser } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    contactNumber: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let validationErrors = {};

    // Name Validation: First letter should be uppercase
    if (!/^[A-Z][a-zA-Z\s]*$/.test(user.name)) {
      validationErrors.name =
        'Name must start with a capital letter and contain only letters and spaces';
    }

    // Email Validation: Contains '@' and valid format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      validationErrors.email = 'Email is not valid';
    }

    // Contact Number Validation: Starts with 0, contains only numbers, and is exactly 10 digits
    if (!/^0[0-9]{9}$/.test(user.contactNumber)) {
      validationErrors.contactNumber =
        'Contact number must start with 0 and contain exactly 10 digits';
    }

    // Address Validation: Only letters, numbers, /, and , allowed
    if (!/^[a-zA-Z0-9\s,\/]+$/.test(user.address)) {
      validationErrors.address =
        'Address can only contain letters, numbers, spaces, "/" and ","';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const id = Cookies.get('userId');
        const response = await axios.get(`http://localhost:8020/customer/profile/${id}`);
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (id === 'name') {
      // Ensure first letter is capitalized and allow letters and spaces only
      const validName = value.replace(/[^a-zA-Z\s]/g, '');
      if (/^[A-Z][a-zA-Z\s]*$/.test(validName) || validName === '') {
        setUser({ ...user, name: validName });
        const { name, ...restErrors } = errors;
        setErrors(restErrors); // Clear error if valid
      } else {
        setErrors({
          ...errors,
          name: 'Name must start with a capital letter and contain only letters and spaces',
        });
      }
    } else if (id === 'contactNumber') {
      // Prevent non-numeric input and restrict to 10 characters
      const formattedValue = value.replace(/[^0-9]/g, '');
      if (formattedValue.length === 0 || formattedValue.startsWith('0')) {
        if (formattedValue.length <= 10) {
          setUser({ ...user, contactNumber: formattedValue });
          if (formattedValue.length !== 10) {
            setErrors({
              ...errors,
              contactNumber: 'Contact number must be exactly 10 digits long',
            });
          } else {
            const { contactNumber, ...restErrors } = errors;
            setErrors(restErrors);
          }
        }
      } else {
        setErrors({
          ...errors,
          contactNumber: 'Contact number must start with 0',
        });
      }
    } else if (id === 'email') {
      // Real-time email validation: Remove invalid characters
      const validEmail = value.replace(/[^a-zA-Z0-9@._-]/g, '');
      setUser({ ...user, email: validEmail });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validEmail)) {
        setErrors({ ...errors, email: 'Email is not valid' });
      } else {
        const { email, ...restErrors } = errors;
        setErrors(restErrors);
      }
    } else if (id === 'address') {
      // Real-time address validation: Only allow letters, numbers, spaces, /, and ,
      const validAddress = value.replace(/[^a-zA-Z0-9\s,\/]/g, '');
      setUser({ ...user, address: validAddress });
      if (!/^[a-zA-Z0-9\s,\/]+$/.test(validAddress)) {
        setErrors({
          ...errors,
          address: 'Address can only contain letters, numbers, spaces, "/" and ","',
        });
      } else {
        const { address, ...restErrors } = errors;
        setErrors(restErrors);
      }
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    setError(null);

    if (!validate()) {
      return; // If validation fails, prevent form submission
    }

    try {
      const Logged_Customer_Id = user._id;
      const response = await axios.put(
        `http://localhost:8020/customer/adminupdate/${Logged_Customer_Id}`,
        user
      );
      if (response.status === 200) {
        setUpdateSuccess(true);
      }
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">{error}</div>;
  }

  return (
    <div className="flex">
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
        </ul>
      </div>
      <div className="bg-[#F6F1E5] min-h-screen flex flex-col items-center py-12 w-full">
        <h1 className="text-4xl font-bold text-[#41A64F] mb-8">My Profile</h1>

        {user ? (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg space-y-6">
            {updateSuccess && (
              <div className="bg-green-100 text-green-700 p-3 mb-4 rounded-md border border-green-300">
                Profile updated successfully!
              </div>
            )}
            {error && <p className="text-red-600 mt-4">{error}</p>}

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={user.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
              {errors.name && <p className="text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={user.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
              {errors.email && <p className="text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="contactNumber">
                Phone
              </label>
              <input
                id="contactNumber"
                type="tel"
                value={user.contactNumber}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
              {errors.contactNumber && <p className="text-red-600">{errors.contactNumber}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="address">
                Address
              </label>
              <input
                id="address"
                type="text"
                value={user.address}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
              {errors.address && <p className="text-red-600">{errors.address}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#41A64F] text-white p-3 rounded-md shadow-lg hover:bg-green-600 transition duration-300"
            >
              Update Profile
            </button>
          </form>
        ) : (
          <p>No user data available</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
