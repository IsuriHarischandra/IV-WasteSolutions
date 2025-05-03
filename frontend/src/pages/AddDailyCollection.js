import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaPlusCircle, FaEye, FaUser } from "react-icons/fa";

const AddDailyCollection = () => {
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    nic: "",
    address: "",
    email: "",
    contactNumber: "",
    location: "",
    status: "pending", // Default status
  });

  const [error, setError] = useState("");

  const [errors, setErrors] = useState({});

  const validate = () => {
    let errors = {};

    // Name Validation: First letter should be uppercase
    if (!/^[A-Z][a-zA-Z\s]*$/.test(formData.name)) {
      errors.name =
        "Name must start with a capital letter and contain only letters and spaces";
    }

    // Email Validation: Contains '@' and valid format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email is not valid";
    }

    // Contact Number Validation: Starts with 0, contains only numbers, and is exactly 10 digits
    if (!/^0[0-9]{9}$/.test(formData.contactNumber)) {
      errors.contactNumber =
        "Contact number must start with 0 and contain exactly 10 digits";
    }

    // Address Validation: Only letters, numbers, / and , allowed
    if (!/^[a-zA-Z0-9\s,\/]+$/.test(formData.address)) {
      errors.address =
        'Address can only contain letters, numbers, spaces, "/" and ","';
    }

    // Address Validation: Only letters, numbers, / and , allowed
    if (!/^[a-zA-Z0-9\s,\/]+$/.test(formData.location)) {
      errors.location =
        'location can only contain letters, numbers, spaces, "/" and ","';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      // Name validation code
      const validName = value.replace(/[^a-zA-Z\s]/g, "");
      if (/^[A-Z][a-zA-Z\s]*$/.test(value) || value === "") {
        setFormData({ ...formData, name: value });
        const { name, ...restErrors } = errors;
        setErrors(restErrors);
      } else {
        setErrors({
          ...errors,
          name: "Name must start with a capital letter and contain only letters and spaces",
        });
      }
    } else if (name === "nic") {
      // Allow only digits and 'V' or 'v'
      let formattedNic = value.replace(/[^0-9Vv]/g, "");

      // Check if the length is more than 12 for digits or more than 10 with 'V'/'v'
      if (
        formattedNic.length > 11 &&
        formattedNic.length <= 12 &&
        !/[Vv]$/.test(formattedNic)
      ) {
        formattedNic = formattedNic.slice(0, 12); // Allow up to 12 digits
      } else if (formattedNic.length > 11 && /[Vv]$/.test(formattedNic)) {
        formattedNic = formattedNic.slice(0, 11); // Allow up to 10 chars if 'V'/'v' is at the end
      }

      // Update state with validated NIC
      setFormData({ ...formData, nic: formattedNic });

      // Real-time validation: NIC must be either 10 chars with 'V'/'v' at the end or 12 digits
      if (!/^([0-9]{9}[Vv]|[0-9]{12})$/.test(formattedNic)) {
        setErrors({
          ...errors,
          nic: "NIC must be 9 digits followed by 'V' or 12 digits",
        });
      } else {
        const { nic, ...restErrors } = errors;
        setErrors(restErrors); // Clear the error if valid
      }
    } else if (name === "contactNumber") {
      // Contact number validation code
      const formattedValue = value.replace(/[^0-9]/g, "");
      if (formattedValue.length === 0 || formattedValue.startsWith("0")) {
        if (formattedValue.length <= 10) {
          setFormData({ ...formData, contactNumber: formattedValue });
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
      // Email validation code
      const validEmail = value.replace(/[^a-zA-Z0-9@._-]/g, "");
      setFormData({ ...formData, email: validEmail });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validEmail)) {
        setErrors({ ...errors, email: "Email is not valid" });
      } else {
        const { email, ...restErrors } = errors;
        setErrors(restErrors);
      }
    } else if (name === "address") {
      // Address validation code
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
    } else if (name === "location") {
      // Location validation code
      const validLocation = value.replace(/[^a-zA-Z0-9\s,\/]/g, "");
      setFormData({ ...formData, location: validLocation });
      if (!/^[a-zA-Z0-9\s,\/]+$/.test(validLocation)) {
        setErrors({
          ...errors,
          location:
            'Location can only contain letters, numbers, spaces, "/" and ","',
        });
      } else {
        const { location, ...restErrors } = errors;
        setErrors(restErrors);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const namePattern = /^[A-Z][a-zA-Z\s]*$/;
    const nicPattern = /^(\d{11}[V]|[0-9]{12})$/;
    const addressPattern = /^[a-zA-Z0-9\s,\/]*$/;
    const contactPattern = /^0\d{9}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.category) return "Category is required";
    if (!namePattern.test(formData.name))
      return "Name must start with a capital letter and contain only letters";
    if (!addressPattern.test(formData.address))
      return "Address can contain letters, numbers, spaces, commas, and slashes only";
    if (!contactPattern.test(formData.contactNumber))
      return "Contact number must start with 0 and be exactly 10 digits";
    if (!emailPattern.test(formData.email)) return "Invalid email format";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8020/dailycollection",
        formData
      );
      alert("Daily collection added successfully");
      setFormData({
        category: "",
        name: "",
        nic: "",
        address: "",
        email: "",
        contactNumber: "",
        location: "",
        status: "pending",
      });
      setError("");
    } catch (err) {
      setError("Error adding daily collection");
    }
  };

  return (
    <div className="flex h-screen bg-[#F6F1E5]">
      <div className="bg-[#E2E8CE] w-1/5 min-h-screen p-4 shadow-lg">
        <ul className="space-y-4">
          <li className="transition duration-300 ease-in-out transform hover:scale-105">
            <Link
              to="/profile"
              className="flex items-center text-gray-800 hover:bg-gray-200 p-2 rounded-lg"
            >
              <FaUser className="mr-2 text-[#41A64F]" />
              <span>My Profile</span>
            </Link>
          </li>
          <li className="transition duration-300 ease-in-out transform hover:scale-105">
            <Link
              to="/addpickup"
              className="flex items-center text-gray-800 hover:bg-gray-200 p-2 rounded-lg"
            >
              <FaPlusCircle className="mr-2 text-[#41A64F]" />
              <span>Add Pick-Up Request</span>
            </Link>
          </li>
          <li className="transition duration-300 ease-in-out transform hover:scale-105">
            <Link
              to="/viewpickup"
              className="flex items-center text-gray-800 hover:bg-gray-200 p-2 rounded-lg"
            >
              <FaEye className="mr-2 text-[#41A64F]" />
              <span>View Pick-Up Requests</span>
            </Link>
          </li>
          <li className="transition duration-300 ease-in-out transform hover:scale-105">
            <Link
              to="/adddailycollection"
              className="flex items-center text-gray-800 hover:bg-gray-200 p-2 rounded-lg"
            >
              <FaPlusCircle className="mr-2 text-[#41A64F]" />
              <span>Add Daily Collection</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex justify-center items-center w-full">
        <div className="max-w-4xl w-4/5 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center mb-6">
            Add Daily Collection
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="category" className="block text-sm font-medium">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border rounded-md"
                >
                  <option value="">Select a category</option>
                  <option value="organic">Organic</option>
                  <option value="e-waste">E-waste</option>
                  <option value="plastic">Plastic</option>
                  <option value="mix">Mix</option>
                  <option value="metallic/copper/glass">
                    Metallic/Copper/Glass
                  </option>
                </select>
              </div>

              <div className="w-1/2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border rounded-md"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">{errors.name}</span>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="nic" className="block text-sm font-medium">
                  NIC
                </label>
                <input
                  type="text"
                  name="nic"
                  value={formData.nic}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border rounded-md"
                  placeholder="12345678901V or 123456789012"
                />
                {errors.nic && (
                  <span className="text-red-500 text-sm">{errors.nic}</span>
                )}
              </div>

              <div className="w-1/2">
                <label htmlFor="address" className="block text-sm font-medium">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border rounded-md"
                  placeholder="123 Main St, City"
                />
                {errors.address && (
                  <span className="text-red-500 text-sm">{errors.address}</span>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border rounded-md"
                  placeholder="example@example.com"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email}</span>
                )}
              </div>

              <div className="w-1/2">
                <label
                  htmlFor="contactNumber"
                  className="block text-sm font-medium"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border rounded-md"
                  placeholder="0712345678"
                />
                {errors.contactNumber && (
                  <span className="text-red-500 text-sm">
                    {errors.contactNumber}
                  </span>
                )}
              </div>
            </div>

            <div className="w-full">
              <label htmlFor="location" className="block text-sm font-medium">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                placeholder="City, Region"
              />
              {errors.location && (
                <span className="text-red-500 text-sm">{errors.location}</span>
              )}
            </div>

            <button
              type="submit"
              className="col-span-1 md:col-span-2 mt-4 w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg hover:shadow-lg hover:from-green-600 hover:to-green-800 transition duration-300"
            >
              Add Daily Collection
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDailyCollection;
