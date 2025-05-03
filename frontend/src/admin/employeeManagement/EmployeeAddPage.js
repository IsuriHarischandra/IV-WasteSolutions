import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './employeeSideBar'; // Import your Sidebar component

const EmployeeAddPage = () => {
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [isNameVisible, setIsNameVisible] = useState(true);
    const [nic, setNic] = useState('');
    const [nicError, setNicError] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState(''); // State for address error
    const [contactNumber, setContactNumber] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [designation, setDesignation] = useState('Manager');
    const [emergencyContactNumber, setEmergencyContactNumber] = useState('');
    const [emergencyContactNumberError, setEmergencyContactNumberError] = useState('');
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [isEmergencyNameVisible, setIsEmergencyNameVisible] = useState(true);
    const [emergencyEmail, setEmergencyEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ageError, setAgeError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emergencyEmailError, setEmergencyEmailError] = useState('');
    const [emergencyNameError, setEmergencyNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [contactNumberError, setContactNumberError] = useState('');

    const navigate = useNavigate();

    const validateEmergencyName = (name) => {
        const namePattern = /^[A-Z][a-z]*(?:\s[A-Z][a-z]*)?$/;
        if (!name) {
            setEmergencyNameError('Emergency Name is required');
            setIsEmergencyNameVisible(false);
        } else if (!namePattern.test(name)) {
            setEmergencyNameError('Emergency Name must start with a capital letter and only contain letters.');
            setIsEmergencyNameVisible(false); // Hide the input value
        } else {
            setEmergencyNameError('');
            setIsEmergencyNameVisible(true); // Show the input value
        }
    };

    const validateName = (name) => {
        const namePattern = /^[A-Z][a-z]*(?:\s[A-Z][a-z]*)?$/;
        if (!name) {
            setNameError('Name is required');
            setIsNameVisible(false);
        } else if (!namePattern.test(name)) {
            setNameError('Name must start with a capital letter and only contain letters.');
            setIsNameVisible(false); // Hide the input value
        } else {
            setNameError('');
            setIsNameVisible(true); // Show the input value
        }
    };
    

    const validateEmail = (inputValue) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(inputValue)) {
            setEmailError('Invalid email format. Please enter a valid email.');
        } else {
            setEmailError('');
        }
    };

    // Validation for NIC
    const validateNic = (nic) => {
        const nicPattern = /^\d{12}$/;
        if (!nic) {
            setNicError('NIC is required');
        } else if (!nicPattern.test(nic)) {
            setNicError('NIC must be exactly 12 digits.');
        } else {
            setNicError('');
        }
    };

    // Validation for the address field (allow letters, numbers, spaces, and special characters /, and ,)
    const validateAddress = (address) => {
        const addressPattern = /^[a-zA-Z0-9\s\/,]*$/; // Only allows letters, numbers, spaces, /, and ,
        if (!addressPattern.test(address)) {
            setAddressError('Address can only contain letters, numbers, spaces, and the characters / and ,.');
        } else {
            setAddressError('');
        }
    };

    // Validation for the age field (only numbers between 18 and 50)
    const validateAge = (inputValue) => {
        const agePattern = /^\d*$/; // Allow only numeric input

        if (!agePattern.test(inputValue)) {
            setAgeError('Age must be a valid number.');
        } else {
            const ageNumber = parseInt(inputValue);

            // Only update age if it's within the valid range (18-50)
            if (inputValue === '' || (ageNumber >= 18 && ageNumber <= 50)) {
                setAge(inputValue);
                setAgeError('');
            } else {
                setAgeError('Age must be between 18 and 50.');
            }
        }
    };

    // Emergency Email validation function
    const validateEmergencyEmail = (inputValue) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(inputValue)) {
            setEmergencyEmailError('Invalid email format. Please enter a valid emergency email.');
        } else {
            setEmergencyEmailError('');
        }
    };

    // Password validation function
    const validatePassword = (inputValue) => {
        if (inputValue.length <= 6) {
            setPasswordError('Password must be longer than 6 characters.');
        } else {
            setPasswordError('');
        }
    };

    // Contact number validation function
    const validateContactNumber = (inputValue) => {
        const contactNumberPattern = /^0\d{9}$/; // Must start with 0 and have 10 digits
        if (!contactNumberPattern.test(inputValue)) {
            setContactNumberError('Contact number must be 10 digits and start with 0.');
        } else {
            setContactNumberError('');
        }
    };

   // Emergency Contact number validation function
   const validateEmergencyContactNumber = (inputValue) => {
    const contactNumberPattern = /^0\d{9}$/; // Must start with 0 and have 10 digits
    if (!contactNumberPattern.test(inputValue)) {
        setEmergencyContactNumberError('Emergency contact number must be 10 digits and start with 0.');
    } else {
        setEmergencyContactNumberError('');
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Perform name, NIC, and address validation before submitting
        validateName(name);
        validateEmergencyName(emergencyContactName)
        validateNic(nic);
        validateAddress(address);
        validateAge(age);
        validatePassword(password);
        validateContactNumber(contactNumber);
        validateEmergencyContactNumber(emergencyContactNumber);

        // Ensure that no errors exist before submission
        if (!nameError && !emergencyNameError && !nicError && !addressError && !ageError && !emailError && !emergencyEmailError && !passwordError && !contactNumberError && !emergencyContactNumberError) {
            const employeeData = {
                name,
                nic,
                email,
                address,
                contactNumber,
                age,
                gender,
                designation,
                emergencyContactNumber,
                emergencyContactName,
                emergencyEmail,
                password,
            };

            try {
                const response = await axios.post('http://localhost:8020/employee/add', employeeData);
                alert(response.data.message);
                navigate('/employeeview');
            } catch (error) {
                alert(error.response.data.error || 'An error occurred while adding the employee.');
            }
        }
    }
    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-8 bg-[#ffffff] min-h-screen">
                <h2 className="text-5xl font-extrabold mb-8 text-center text-black ">Add Employee</h2>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/** Employee Form Fields **/}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={isNameVisible ? name : ''}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                setName(inputValue);
                                validateName(inputValue);
                            }}
                            required
                            className={`mt-1 block w-full border h-10 rounded-md shadow-sm ${nameError ? 'border-red-500' : 'border-gray-300'
                                } focus:ring focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {nameError && (
                            <p className="text-red-500 text-sm mt-1">{nameError}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="nic" className="block text-sm font-medium text-gray-700">NIC</label>
                        <input
                            type="text"
                            id="nic"
                            value={nic}
                            onChange={(e) => {
                                const inputValue = e.target.value;

                                // Validate NIC input for digits and length
                                if (/^\d*$/.test(inputValue) && inputValue.length <= 12) {
                                    setNic(inputValue);
                                    validateNic(inputValue);
                                } else {
                                    // Show error if input contains letters or is too long
                                    if (inputValue.length > 0) {
                                        setNicError('NIC must be numeric and contain only digits.');
                                    } else {
                                        setNicError('');
                                    }
                                }
                            }}
                            required
                            className={`mt-1 block w-full border h-10 rounded-md shadow-sm ${nicError ? 'border-red-500' : 'border-gray-300'
                                } focus:ring focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {nicError && (
                            <p className="text-red-500 text-sm mt-1">{nicError}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                setEmail(inputValue);
                                validateEmail(inputValue); // Validate email in real time
                            }}
                            required
                            className={`mt-1 block w-full border h-10 rounded-md shadow-sm ${emailError ? 'border-red-500' : 'border-gray-300'
                                } focus:ring focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {emailError && (
                            <p className="text-red-500 text-sm mt-1">{emailError}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => {
                                const inputValue = e.target.value;

                                // Validate the input against the pattern
                                if (/^[a-zA-Z0-9\s\/,]*$/.test(inputValue)) {
                                    setAddress(inputValue);
                                    validateAddress(inputValue);
                                } else {
                                    setAddressError('Address can only contain letters, numbers, spaces, and the characters / and ,.');
                                }
                            }}
                            required
                            className="mt-1 block w-full border h-10 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                        />
                        {addressError && (
                            <p className="text-red-500 text-sm mt-1">{addressError}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                        <input
        type="text"
        id="contactNumber"
        value={contactNumber}
        onChange={(e) => {
            const inputValue = e.target.value;

            // Check if the first digit is not '0'
            if (inputValue.length === 1 && inputValue !== '0') {
                setContactNumberError('Contact number must start with 0.');
            }
            // Allow only digits and ensure the length is exactly 10 digits
            else if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
                setContactNumber(inputValue);
                setContactNumberError('');
            }
            // Prevent more than 10 digits
            else if (inputValue.length > 10) {
                setContactNumberError('Contact number must be exactly 10 digits.');
            }
            // Handle empty input
            else if (inputValue.length === 0) {
                setContactNumber('');
                setContactNumberError('');
            } else {
                setContactNumberError('Contact number must contain only digits and start with 0.');
            }
        }}
        required
        className={`mt-1 block w-full border h-10 rounded-md shadow-sm ${contactNumberError ? 'border-red-500' : 'border-gray-300'
            } focus:ring focus:ring-blue-500 focus:border-blue-500`}
    />
    {contactNumberError && (
        <p className="text-red-500 text-sm mt-1">{contactNumberError}</p>
    )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                        <input
                            type="text"
                            id="age"
                            value={age}
                            onChange={(e) => {
                                const inputValue = e.target.value;

                                // Allow only numeric input and validate within the range of 18 to 50
                                if (/^\d*$/.test(inputValue)) {
                                    setAge(inputValue);
                                    validateAge(inputValue);
                                } else {
                                    setAgeError('Age must be a number between 18 and 50.');
                                }
                            }}
                            required
                            className={`mt-1 block w-full border h-10 rounded-md shadow-sm ${ageError ? 'border-red-500' : 'border-gray-300'
                                } focus:ring focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {ageError && (
                            <p className="text-red-500 text-sm mt-1">{ageError}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                            className="mt-1 block w-full border h-10 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
                        <select
                            id="designation"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            required
                            className="mt-1 block w-full border h-10 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Manager">Manager</option>
                            <option value="HR Manager">HR Manager</option>
                            <option value="Finance Manager">Finance Manager</option>
                            <option value="Waste Sorter">Waste Sorter</option>
                            <option value="Mass and Hazardous Waste Manager">Mass and Hazardous Waste Manager</option>
                            <option value="Driver">Driver</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="emergencyContactNumber" className="block text-sm font-medium text-gray-700">Emergency Contact Number</label>
                        <input
                            type="text"
                            id="emergencyContactNumber"
                            value={emergencyContactNumber}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                    
                                // Check if the first digit is not '0'
                                if (inputValue.length === 1 && inputValue !== '0') {
                                    setEmergencyContactNumberError('Contact number must start with 0.');
                                }
                                // Allow only digits and ensure the length is exactly 10 digits
                                else if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
                                    setEmergencyContactNumber(inputValue);
                                    setEmergencyContactNumberError('');
                                }
                                // Prevent more than 10 digits
                                else if (inputValue.length > 10) {
                                    setEmergencyContactNumberError('Contact number must be exactly 10 digits.');
                                }
                                // Handle empty input
                                else if (inputValue.length === 0) {
                                    setEmergencyContactNumber('');
                                    setEmergencyContactNumberError('');
                                } else {
                                    setEmergencyContactNumberError('Contact number must contain only digits and start with 0.');
                                }
                            }}
                            required
                            className={`mt-1 block w-full border h-10 rounded-md shadow-sm ${emergencyContactNumberError ? 'border-red-500' : 'border-gray-300'
                                } focus:ring focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {emergencyContactNumberError && (
                            <p className="text-red-500 text-sm mt-1">{emergencyContactNumberError}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700">Emergency Contact Name</label>
                        <input
                            type="text"
                            id="emergencyContactName"
                            value={isEmergencyNameVisible ? emergencyContactName : ''}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                setEmergencyContactName(inputValue);
                                validateEmergencyName(inputValue);
                            }}
                            required
                            className={`mt-1 block w-full border h-10 rounded-md shadow-sm ${emergencyNameError ? 'border-red-500' : 'border-gray-300'
                                } focus:ring focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {emergencyNameError && (
                            <p className="text-red-500 text-sm mt-1">{emergencyNameError}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="emergencyEmail" className="block text-sm font-medium text-gray-700">Emergency Email</label>
                        <input
                            type="email"
                            id="emergencyEmail"
                            value={emergencyEmail}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                setEmergencyEmail(inputValue);
                                validateEmergencyEmail(inputValue); // Validate emergency email in real time
                            }}
                            required
                            className={`mt-1 block w-full border h-10 rounded-md shadow-sm ${emergencyEmailError ? 'border-red-500' : 'border-gray-300'
                                } focus:ring focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {emergencyEmailError && (
                            <p className="text-red-500 text-sm mt-1">{emergencyEmailError}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                setPassword(inputValue);
                                validatePassword(inputValue); // Validate password in real time
                            }}
                            required
                            className={`mt-1 block w-full border h-10 rounded-md shadow-sm ${passwordError ? 'border-red-500' : 'border-gray-300'
                                } focus:ring focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {passwordError && (
                            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                        )}
                    </div>
                    <div className="col-span-2 flex justify-center">
                        <button
                            type="submit"
                            className="mt-4 w-2/4 bg-[#1d8b1d] text-white font-bold py-2 px-4 rounded-md hover:bg-[#A5D6A7]"
                        >
                            Add Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeAddPage;
