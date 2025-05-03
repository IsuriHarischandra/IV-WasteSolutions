import React, { useState } from 'react';
import chemicalWasteImg from './Assets/chemical-waste.jpg';
import hazardousWasteImg from './Assets/hazardous-waste.jpg';
import massWasteImg from './Assets/mass-waste.jpg'; 

const wasteTypes = [
    {
        value: 'Chemical Waste',
        description: 'Chemical waste consists of discarded chemicals that are hazardous. They can be either liquid or solid.',
        image: chemicalWasteImg
    },
    {
        value: 'Hazardous Waste',
        description: 'Hazardous waste is any waste material that can be dangerous or harmful to human health or the environment.',
        image: hazardousWasteImg
    },
    {
        value: 'Mass Waste',
        description: 'Mass waste is a large quantity of waste that can come from industries, construction sites, or other sources.',
        image: massWasteImg
    }
];

const units = ['kg', 't', 'L', 'm³'];

const WasteForm = () => {
    const [formData, setFormData] = useState({
        type: '',
        location: '',
        quantity: '',
        unit: 'kg', // Default unit
        email: '',
        image: null
    });

    const [errors, setErrors] = useState({});
    const [submitSuccess, setSubmitSuccess] = useState(null);

    const validateForm = () => {
        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!formData.location) {
            newErrors.location = 'Location is required.';
        }

        if (!formData.quantity) {
            newErrors.quantity = 'Quantity is required.';
        } else if (isNaN(formData.quantity) || formData.quantity <= 0) {
            newErrors.quantity = 'Quantity must be a positive number.';
        }

        if (!formData.type) {
            newErrors.type = 'Please select a waste type.';
        }

        if (!formData.image) {
            newErrors.image = 'Please upload an image of the waste.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Stop submission if validation fails
        }

        const form = new FormData();
        form.append('type', formData.type);
        form.append('location', formData.location);
        form.append('quantity', `${formData.quantity} ${formData.unit}`);
        form.append('email', formData.email);
        if (formData.image) {
            form.append('image', formData.image);
        }

        fetch('http://localhost:8020/MnH/waste', {
            method: 'POST',
            body: form
        })
        .then(response => {
            if (response.ok) {
                setSubmitSuccess(true);
                setErrors({});
                alert('Order submitted successfully');
            } else {
                throw new Error('Failed to submit order');
            }
        })
        .catch(err => {
            setSubmitSuccess(false);
            console.error(err);
            alert('Failed to submit order');
        });
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Request Mass and Hazardous Waste Extraction</h2>

            {submitSuccess === true && <div className="alert alert-success">Order submitted successfully!</div>}
            {submitSuccess === false && <div className="alert alert-danger">Failed to submit order. Please try again.</div>}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {wasteTypes.map(wasteType => (
                        <div
                            key={wasteType.value}
                            className={`waste-type-container p-4 border ${formData.type === wasteType.value ? 'border-blue-500' : 'border-gray-300'} rounded cursor-pointer`}
                            onClick={() => setFormData({ ...formData, type: wasteType.value })}
                            aria-label={`Select ${wasteType.value}`}
                            role="button"
                        >
                            <div className="flex items-center">
                                <img
                                    src={wasteType.image}
                                    alt={wasteType.value}
                                    className="w-24 h-auto rounded mr-4"
                                    title={wasteType.description}
                                />
                                <div>
                                    <strong>{wasteType.value}</strong>
                                    <p className="text-sm text-gray-600">{wasteType.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {errors.type && <div className="text-red-500 text-sm mb-3">{errors.type}</div>}

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
                    />
                    {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                </div>

                <div className="mb-4">
                    <label htmlFor="location" className="block text-gray-700">Location</label>
                    <input
                        id="location"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter location"
                        className={`w-full p-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded`}
                    />
                    {errors.location && <div className="text-red-500 text-sm">{errors.location}</div>}
                </div>

                <div className="mb-4">
                    <label htmlFor="quantity" className="block text-gray-700">Quantity</label>
                    <div className="flex">
                        <input
                            id="quantity"
                            type="text"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="Enter quantity"
                            className={`w-full p-2 border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded`}
                        />
                        <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="ml-2 p-2 border border-gray-300 rounded"
                        >
                            {units.map(unit => (
                                <option key={unit} value={unit}>
                                    {unit}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.quantity && <div className="text-red-500 text-sm">{errors.quantity}</div>}
                </div>

                <div className="mb-4">
                    <label htmlFor="image" className="block text-gray-700">Image of Waste</label>
                    <input
                        id="image"
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className={`w-full p-2 border ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded`}
                    />
                    {errors.image && <div className="text-red-500 text-sm">{errors.image}</div>}
                </div>

                <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">Submit</button>
            </form>
        </div>
    );
};

export default WasteForm;
