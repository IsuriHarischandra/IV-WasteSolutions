import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    let errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      errors.email = 'Email is not valid';
    }
    if (credentials.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      const isAdmin = credentials.email.includes('admin');
      const endpoint = isAdmin ? 'http://localhost:8020/employee/login' : 'http://localhost:8020/customer/login';

      axios
        .post(endpoint, credentials)
        .then((response) => {
          const userData = isAdmin ? response.data.employee : response.data.customer;

          Cookies.set('token', response.data.token, { expires: 1 });
          Cookies.set('userId', userData.customerId || userData.employeeId, { expires: 1 });
          Cookies.set('email', userData.email, { expires: 1 });
          Cookies.set('userRole', isAdmin ? 'admin' : 'customer', { expires: 1 });

          setSuccessMessage('Login successful!');
          setErrors({});

          if (isAdmin) {
            navigate('/mainadmindashboard');
          } else {
            navigate('/');
          }
        })
        .catch((error) => {
          console.error('Login failed!', error);
          setErrors({ general: 'Login failed. Please check your credentials.' });
        });
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#F6F1E5]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-100">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-900">Login</h2>

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded-md shadow-sm">
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-md shadow-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              value={credentials.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg hover:shadow-lg hover:from-green-600 hover:to-green-800 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/customerregister" className="text-blue-500 hover:text-blue-600 hover:underline transition duration-200">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerLogin;
