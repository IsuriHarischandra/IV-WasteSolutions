import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate to programmatically navigate

const UpdateEmployee = () => {
  const { id } = useParams(); // Fetch the employeeId from the URL
  const navigate = useNavigate(); // useNavigate hook for navigation

  // Extend the state to include all employee fields
  const [employeeData, setEmployeeData] = useState({
    name: "",
    nic: "",
    email: "",
    contactNumber: "",
    address: "",
    age: "",
    gender: "",
    designation: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    emergencyEmail: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let validationErrors = {};

    // Name Validation: First letter should be uppercase
    if (!/^[A-Z][a-zA-Z\s]*$/.test(employeeData.name)) {
      validationErrors.name =
        'Name must start with a capital letter and contain only letters and spaces';
    }

    if (!/^[A-Z][a-zA-Z\s]*$/.test(employeeData.emergencyContactName)) {
      validationErrors.emergencyContactName =
        'Name must start with a capital letter and contain only letters and spaces';
    }

    // Email Validation: Contains '@' and valid format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeData.email)) {
      validationErrors.email = 'Email is not valid';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeData.emergencyEmail)) {
      validationErrors.emergencyEmail = 'Email is not valid';
    }

    // Contact Number Validation: Starts with 0, contains only numbers, and is exactly 10 digits
    if (!/^0[0-9]{9}$/.test(employeeData.contactNumber)) {
      validationErrors.contactNumber =
        'Contact number must start with 0 and contain exactly 10 digits';
    }

    if (!/^0[0-9]{9}$/.test(employeeData.emergencyContactNumber)) {
      validationErrors.emergencyContactNumber =
        'Contact number must start with 0 and contain exactly 10 digits';
    }

    if (employeeData.age < 18 || employeeData.age > 50) {
      validationErrors.age = "Age must be between 18 and 50";
    }
    
    // Address Validation: Only letters, numbers, /, and , allowed
    if (!/^[a-zA-Z0-9\s,\/]+$/.test(employeeData.address)) {
      validationErrors.address =
        'Address can only contain letters, numbers, spaces, "/" and ","';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:8020/employee/get/${id}`);
        setEmployeeData(response.data); // Set employee data from the API response
      } catch (error) {
        console.error("Failed to fetch employee data", error);
      }
    };

    fetchEmployee();
  }, [id]);

  // const handleInputChange = (e) => {
  //   setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      // Ensure first letter is capitalized and allow letters and spaces only
      const validName = value.replace(/[^a-zA-Z\s]/g, '');
      if (/^[A-Z][a-zA-Z\s]*$/.test(validName) || validName === '') {
        setEmployeeData({ ...employeeData, name: validName });
        const { name, ...restErrors } = errors;
        setErrors(restErrors); // Clear error if valid
      } else {
        setErrors({
          ...errors,
          name: 'Name must start with a capital letter and contain only letters and spaces',
        });
      }
    }
    else if (name === 'emergencyContactName') {
     // Ensure first letter is capitalized and allow letters and spaces only
     const validName = value.replace(/[^a-zA-Z\s]/g, '');
     if (/^[A-Z][a-zA-Z\s]*$/.test(validName) || validName === '') {
       setEmployeeData({ ...employeeData, emergencyContactName: validName });
       const { emergencyContactName, ...restErrors } = errors;
       setErrors(restErrors); // Clear error if valid
     } else {
       setErrors({
         ...errors,
         emergencyContactName: 'Name must start with a capital letter and contain only letters and spaces',
       });
     }
    }
     else if (name === 'contactNumber') {
      // Prevent non-numeric input and restrict to 10 characters
      const formattedValue = value.replace(/[^0-9]/g, '');
      if (formattedValue.length === 0 || formattedValue.startsWith('0')) {
        if (formattedValue.length <= 10) {
          setEmployeeData({ ...employeeData, contactNumber: formattedValue });
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
    }else if (name === 'emergencyContactNumber') {
      // Prevent non-numeric input and restrict to 10 characters
      const formattedValue = value.replace(/[^0-9]/g, '');
      if (formattedValue.length === 0 || formattedValue.startsWith('0')) {
        if (formattedValue.length <= 10) {
          setEmployeeData({ ...employeeData, emergencyContactNumber: formattedValue });
          if (formattedValue.length !== 10) {
            setErrors({
              ...errors,
              emergencyContactNumber: 'Contact number must be exactly 10 digits long',
            });
          } else {
            const { emergencyContactNumber, ...restErrors } = errors;
            setErrors(restErrors);
          }
        }
      } else {
        setErrors({
          ...errors,
          emergencyContactNumber: 'Contact number must start with 0',
        });
      }
    } else if (name === 'email') {
      // Real-time email validation: Remove invalid characters
      const validEmail = value.replace(/[^a-zA-Z0-9@._-]/g, '');
      setEmployeeData({ ...employeeData, email: validEmail });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validEmail)) {
        setErrors({ ...errors, email: 'Email is not valid' });
      } else {
        const { email, ...restErrors } = errors;
        setErrors(restErrors);
      }
    }else if (name === 'emergencyEmail') {
      // Real-time email validation: Remove invalid characters
      const validEmail = value.replace(/[^a-zA-Z0-9@._-]/g, '');
      setEmployeeData({ ...employeeData, emergencyEmail: validEmail });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validEmail)) {
        setErrors({ ...errors, email: 'Email is not valid' });
      } else {
        const { email, ...restErrors } = errors;
        setErrors(restErrors);
      }
    } else if (name === 'address') {
      // Real-time address validation: Only allow letters, numbers, spaces, /, and ,
      const validAddress = value.replace(/[^a-zA-Z0-9\s,\/]/g, '');
      setEmployeeData({ ...employeeData, address: validAddress });
      if (!/^[a-zA-Z0-9\s,\/]+$/.test(validAddress)) {
        setErrors({
          ...errors,
          address: 'Address can only contain letters, numbers, spaces, "/" and ","',
        });
      } else {
        const { address, ...restErrors } = errors;
        setErrors(restErrors);
      }
    }else if (name === "age") {
      const ageValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric input
      setEmployeeData({ ...employeeData, age: ageValue });
    
      // You can do the validation here if you want to show an error message in real-time:
      // Validate only if the input is non-empty
      if (ageValue === "" || (Number(ageValue) >= 18 && Number(ageValue) <= 50)) {
        const { age, ...restErrors } = errors; // Clear error if valid
        setErrors(restErrors);
      } else {
        setErrors({ ...errors, age: "Age must be between 18 and 50" });
      }
    }else if (name === "nic") {
      // Ensure only numeric input, strip out non-numeric characters
      const nicValue = value.replace(/[^0-9]/g, ""); 
    
      // Prevent more than 12 digits
      if (nicValue.length <= 12) {
        setEmployeeData({ ...employeeData, nic: nicValue });
    
        // Real-time validation: if the NIC is exactly 12 digits, remove the error
        if (nicValue.length === 12) {
          const { nic, ...restErrors } = errors;
          setErrors(restErrors); // Clear error if valid
        } else {
          setErrors({
            ...errors,
            nic: "NIC must be exactly 12 digits",
          });
        }
      }
    }        
    else {
      setEmployeeData((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return; // If validation fails, prevent form submission
    }

    try {
      await axios.put(`http://localhost:8020/employee/${id}`, employeeData);
      alert("Employee updated successfully");
      navigate("/employeeview"); // Redirect to the employee list page after successful update
    } catch (error) {
      console.error("Failed to update employee", error);
      alert("An error occurred while updating the employee");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update Employee</h1>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={employeeData.name}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
          {errors.name && <p className="text-red-600">{errors.name}</p>}
        </div>

        {/* NIC */}
        <div className="mb-4">
          <label>NIC</label>
          <input
    type="text"
    name="nic"
    value={employeeData.nic}
    onChange={handleInputChange}
    className="border p-2 w-full"
  />
  {errors.nic && <p className="text-red-600">{errors.nic}</p>}

        </div>

        {/* Email */}
        <div className="mb-4">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={employeeData.email}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
          {errors.email && <p className="text-red-600">{errors.email}</p>}

        </div>

        {/* Contact Number */}
        <div className="mb-4">
          <label>Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            value={employeeData.contactNumber}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
          {errors.contactNumber && <p className="text-red-600">{errors.contactNumber}</p>}

        </div>

        {/* Address */}
        <div className="mb-4">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={employeeData.address}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
          {errors.address && <p className="text-red-600">{errors.address}</p>}
        </div>

        {/* Age */}
        <div className="mb-4">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={employeeData.age}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
          {errors.age && <p className="text-red-600">{errors.age}</p>}
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label>Gender</label>
          <select
            name="gender"
            value={employeeData.gender}
            onChange={handleInputChange}
            className="border p-2 w-full"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Designation */}
        <div className="mb-4">
          <label>Designation</label>
          <select
            name="designation"
            value={employeeData.designation}
            onChange={handleInputChange}
            className="border p-2 w-full"
          >
            <option value="">Select Designation</option>
            <option value="Manager">Manager</option>
            <option value="HR Manager">HR Manager</option>
            <option value="Finance Manager">Finance Manager</option>
            <option value="Waste Sorter">Waste Sorter</option>
            <option value="Mass and Hazardous Waste Manager">Mass and Hazardous Waste Manager</option>
            <option value="Driver">Driver</option>
          </select>
        </div>

        {/* Emergency Contact Name */}
        <div className="mb-4">
          <label>Emergency Contact Name</label>
          <input
            type="text"
            name="emergencyContactName"
            value={employeeData.emergencyContactName}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
          {errors.emergencyContactName && <p className="text-red-600">{errors.emergencyContactName}</p>}
        </div>

        {/* Emergency Contact Number */}
        <div className="mb-4">
          <label>Emergency Contact Number</label>
          <input
            type="text"
            name="emergencyContactNumber"
            value={employeeData.emergencyContactNumber}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
          {errors.emergencyContactNumber && <p className="text-red-600">{errors.emergencyContactNumber}</p>}
        </div>

        {/* Emergency Email */}
        <div className="mb-4">
          <label>Emergency Email</label>
          <input
            type="email"
            name="emergencyEmail"
            value={employeeData.emergencyEmail}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
          {errors.emergencyEmail && <p className="text-red-600">{errors.emergencyEmail}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Update Employee
        </button>
      </form>
    </div>
  );
};

export default UpdateEmployee;
