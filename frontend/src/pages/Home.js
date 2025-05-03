import React from 'react';
import sideImage from './Assets/side-image.png';
import residence_waste from './Assets/recycling-concept-illustration.png';
import hazardous_waste from './Assets/toxic-chemicals-concept-illustration.png';
import recycle_material from './Assets/recycle-material-illustration.png';

const HomePage = () => {
  return (
    <div className="bg-[#FFFFF] min-h-screen flex flex-col">
      {/* Hero Section */}<br></br><br></br>
      <div className="flex-grow flex flex-col md:flex-row items-center justify-between px-4 md:px-16 py-16">
        <div className="text-center md:text-left mt-8 md:mt-0 md:w-1/2">
          <h1 className="text-5xl md:text-7xl font-bold text-[#41A64F]">
            Welcome to IV Waste Management
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mt-4">
            Leading the Way in Sustainable Waste Solutions for 20 Years
          </p>
          <button className="mt-8 bg-[#41A64F] text-white font-bold py-3 px-8 rounded hover:bg-green-800 transition">
            Explore Our Services
          </button>
        </div>

        <div className="mt-12 md:mt-0 md:w-1/2 flex justify-center">
          <img
            src={sideImage}
            alt="Waste Management"
            className="w-80 h-80 object-cover"
          />
        </div>
      </div>

      {/* Our Services Section */}
      <div className="py-20 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#41A64F]">
            Our Services
          </h2>
          <p className="text-gray-600 text-lg md:text-xl mt-4">
            We provide the best waste management solutions to keep the environment clean and green.
          </p>
        </div>

        <div className="flex justify-center space-x-10">
          {/* Service 1 */}
          <div className="bg-[#ecffe6] p-10 rounded-lg shadow-md max-w-xs text-center">
            <img
              src={hazardous_waste}
              alt="Mass and Hazardous Waste"
              className="w-28 h-28 mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold text-[#41A64F]">Mass and Hazardous Waste</h3>
            <p className="text-gray-600 mt-4">
              Comprehensive solutions for managing and disposing of mass and hazardous waste.
            </p>
          </div>

          {/* Service 2 */}
          <div className="bg-[#ecffe6] p-10 rounded-lg shadow-md max-w-xs text-center">
            <img
              src={residence_waste}
              alt="Residential Waste"
              className="w-28 h-28 mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold text-[#41A64F]">Residential Waste</h3>
            <p className="text-gray-600 mt-4">
              Efficient and eco-friendly waste management solutions for residential areas.
            </p>
          </div>

          {/* Service 3 */}
          <div className="bg-[#ecffe6] p-10 rounded-lg shadow-md max-w-xs text-center">
            <img
              src={recycle_material}
              alt="Buy Recycled Material"
              className="w-28 h-28 mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold text-[#41A64F]">Buy Recycled Material</h3>
            <p className="text-gray-600 mt-4">
              Purchase high-quality recycled materials for various industrial and commercial uses.
            </p>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="py-20 bg-white">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#41A64F]">About Us</h2>
          <p className="text-gray-600 text-lg md:text-xl mt-6 text-center mx-4">
            IV Waste Management has been a leader in providing sustainable waste solutions for over 20 years.<br></br>
            Our mission is to ensure that waste is managed in the most eco-friendly way possible,<br></br> reducing the
            environmental impact and promoting sustainability in communities.
          </p>
          <button className="mt-8 bg-[#41A64F] text-white font-bold py-3 px-8 rounded hover:bg-green-500 transition">
            Learn More
          </button>
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="py-20 bg-white">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#41A64F]">Contact Us</h2>
          <p className="text-gray-600 text-lg md:text-xl mt-6 text-center mx-4">
            Reach out to us for any inquiries or support.<br></br> We are here to assist you with all your waste management needs.
          </p>
          <button className="mt-8 bg-[#41A64F] text-white font-bold py-3 px-8 rounded hover:bg-green-500 transition">
            Get in Touch
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
