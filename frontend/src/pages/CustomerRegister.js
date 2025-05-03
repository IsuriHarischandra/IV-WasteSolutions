import React, { useState } from "react";
import axios from "axios";

const CustomerRegister = () => {
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    email: "",
    contactNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    let errors = {};

     // Name Validation: First letter should be uppercase
     if (!/^[A-Z][a-zA-Z\s]*$/.test(customer.name)) {
      errors.name = "Name must start with a capital letter and contain only letters and spaces";
    }
    

    // Email Validation: Contains '@' and valid format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      errors.email = "Email is not valid";
    }

    // Contact Number Validation: Starts with 0, contains only numbers, and is exactly 10 digits
    if (!/^0[0-9]{9}$/.test(customer.contactNumber)) {
      errors.contactNumber =
        "Contact number must start with 0 and contain exactly 10 digits";
    }

    // Password Validation: Minimum 6 characters
    if (customer.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    // Address Validation: Only letters, numbers, / and , allowed
    if (!/^[a-zA-Z0-9\s,\/]+$/.test(customer.address)) {
      errors.address =
        'Address can only contain letters, numbers, spaces, "/" and ","';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      axios
        .post("http://localhost:8020/customer/register", customer)
        .then((response) => {
          setSuccessMessage("Customer registered successfully!");
          setCustomer({
            name: "",
            address: "",
            email: "",
            contactNumber: "",
            password: "",
          });
          setErrors({});
        })
        .catch((error) => {
          console.error("There was an error registering the customer!", error);
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      // Ensure first letter is capitalized and allow letters and spaces only
      const validName = value.replace(/[^a-zA-Z\s]/g, "");

      if (/^[A-Z][a-zA-Z\s]*$/.test(value) || value === "") {
        // If the name starts with an uppercase letter and contains only letters and spaces, or is empty
        setCustomer({ ...customer, name: value });
        const { name, ...restErrors } = errors;
        setErrors(restErrors);
      } else {
        setErrors({
          ...errors,
          name: "Name must start with a capital letter and contain only letters and spaces",
        });
      }
      
    } else if (name === "contactNumber") {
      // Prevent non-numeric input and restrict to 10 characters
      const formattedValue = value.replace(/[^0-9]/g, "");

      // Ensure the first digit is 0 and the length doesn't exceed 10 digits
      if (formattedValue.length === 0 || formattedValue.startsWith("0")) {
        if (formattedValue.length <= 10) {
          setCustomer({ ...customer, contactNumber: formattedValue });

          // Real-time validation for contact number
          if (formattedValue.length !== 10) {
            setErrors({
              ...errors,
              contactNumber: "Contact number must be exactly 10 digits long",
            });
          } else {
            const { contactNumber, ...restErrors } = errors;
            setErrors(restErrors);
          }
        }
      } else {
        setErrors({
          ...errors,
          contactNumber: "Contact number must start with 0",
        });
      }
    } else if (name === "email") {
      // Real-time email validation: Remove invalid characters
      const validEmail = value.replace(/[^a-zA-Z0-9@._-]/g, "");

      // Allow only a valid email structure
      setCustomer({ ...customer, email: validEmail });

      // Check for valid email format and display error
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validEmail)) {
        setErrors({ ...errors, email: "Email is not valid" });
      } else {
        const { email, ...restErrors } = errors;
        setErrors(restErrors);
      }
    } else if (name === "password") {
      // Real-time password validation: Ensure minimum length of 6
      setCustomer({ ...customer, password: value });

      if (value.length < 6) {
        setErrors({
          ...errors,
          password: "Password must be at least 6 characters long",
        });
      } else {
        const { password, ...restErrors } = errors;
        setErrors(restErrors);
      }
    } else if (name === "address") {
      // Real-time address validation: Only allow letters, numbers, spaces, /, and ,
      const validAddress = value.replace(/[^a-zA-Z0-9\s,\/]/g, "");
      setCustomer({ ...customer, address: validAddress });

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
    } else {
      setCustomer({ ...customer, [name]: value });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#F6F1E5]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-100">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-900">
          Customer Registration
        </h2>

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded-md shadow-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              value={customer.name}
              onChange={handleChange}
              required
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              value={customer.email}
              onChange={handleChange}
              required
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              value={customer.address}
              onChange={handleChange}
              required
            />
            {errors.address && (
              <span className="text-red-500 text-sm">{errors.address}</span>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Contact Number
            </label>
            <input
              type="text"
              name="contactNumber"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              value={customer.contactNumber}
              onChange={handleChange}
              required
            />
            {errors.contactNumber && (
              <span className="text-red-500 text-sm">
                {errors.contactNumber}
              </span>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              value={customer.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg hover:shadow-lg hover:from-green-600 hover:to-green-800 transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerRegister;