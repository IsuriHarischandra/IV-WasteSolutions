import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemId, itemName, itemPrice } = location.state || {};

  // State for payment details
  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [creditCardError, setCreditCardError] = useState("");
  const [cvv, setCvv] = useState("");
  const [cvvError, setCvvError] = useState("");
  const [expDate, setExpDate] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [message, setMessage] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false); // New state for payment success

  // Get userId from cookies
  const userId = Cookies.get("userId");

  // Calculate tomorrow's date for setting the minimum date in the date picker
  const getTomorrowDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tomorrow.toISOString().split("T")[0];
  };

  // Handle credit card input change and validation
  const handleCreditCardChange = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]{0,16}$/;

    if (regex.test(value)) {
      setCreditCardNumber(value);
      setCreditCardError("");
    } else {
      setCreditCardError(
        "Credit Card Number must be exactly 16 digits and contain only numbers."
      );
    }
  };

  // Handle CVV input change and validation
  const handleCvvChange = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]{0,3}$/;

    if (regex.test(value)) {
      setCvv(value);
      setCvvError("");
    } else {
      setCvvError("CVV must be 3 digits and contain only numbers.");
    }
  };

  // Handle payment submission
  const handlePayment = async (e) => {
    e.preventDefault();

    // Validation before submitting
    if (creditCardNumber.length !== 16) {
      setCreditCardError("Credit Card Number must be exactly 16 digits.");
      return;
    }
    if (cvv.length !== 3) {
      setCvvError("CVV must be exactly 3 digits.");
      return;
    }

    // Payment data
    const paymentData = {
      customerId: userId,
      itemId,
      itemName,
      itemPrice,
      creditCardNumber,
      cvv,
      expDate,
      name: nameOnCard,
    };

    try {
      const response = await fetch("http://localhost:8020/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        setMessage("Payment successful!");
        setPaymentSuccess(true); // Set payment success to true
      } else {
        setMessage("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-8 bg-[#F6F1E5] min-h-screen">
      <h2 className="text-4xl font-bold text-center text-[#cfa226] mb-6">
        Payment
      </h2>
      {itemName ? (
        !paymentSuccess ? (
          <div className="flex max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
            {/* Left Side: Item Details */}
            <div className="w-1/2 p-6 border-r border-gray-300">
              <h3 className="text-2xl mb-4">Item: {itemName}</h3>
              <p className="text-lg mb-2">Price: ${itemPrice.toFixed(2)}</p>
              <p className="text-lg mb-4">Item ID: {itemId}</p>
            </div>

            {/* Right Side: Payment Form */}
            <div className="w-1/2 p-6">
              <form onSubmit={handlePayment}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="creditCardNumber"
                  >
                    Credit Card Number
                  </label>
                  <input
                    type="text"
                    id="creditCardNumber"
                    value={creditCardNumber}
                    onChange={handleCreditCardChange}
                    className={`border p-2 w-full rounded ${
                      creditCardError ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {creditCardError && (
                    <p className="text-red-500 mt-2">{creditCardError}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="cvv">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    value={cvv}
                    onChange={handleCvvChange}
                    className={`border p-2 w-full rounded ${
                      cvvError ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {cvvError && <p className="text-red-500 mt-2">{cvvError}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="expDate">
                    Expiration Date (MM/YYYY)
                  </label>
                  <input
                    type="text"
                    id="expDate"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="border border-gray-300 p-2 w-full rounded"
                    min={getTomorrowDate()} // Set the minimum selectable date to tomorrow
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="nameOnCard"
                  >
                    Name on Card
                  </label>
                  <input
                    type="text"
                    id="nameOnCard"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    className="border border-gray-300 p-2 w-full rounded"
                    required
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#FFC107] to-[#FFA000] text-white py-3 px-6 rounded-lg hover:shadow-lg transition duration-300"
                  >
                    Pay
                  </button>
                </div>
              </form>
              {message && <p className="text-center mt-4">{message}</p>}
            </div>
          </div>
        ) : (
          // Render payment success details
          <div className="flex flex-col items-center">
            <h3 className="text-2xl mb-4 text-green-600">Payment Successful!</h3>
            <p className="text-lg mb-2">Item: {itemName}</p>
            <p className="text-lg mb-2">Price: ${itemPrice.toFixed(2)}</p>
            <p className="text-lg mb-2">Card ending in: {creditCardNumber.slice(-4)}</p>
            <button
              onClick={() => navigate("/stockview")}
              className="mt-6 bg-gradient-to-r from-green-400 to-green-600 text-white py-2 px-4 rounded-lg"
            >
              Go to Stock View
            </button>
          </div>
        )
      ) : (
        <p>No item details available.</p>
      )}
    </div>
  );
};

export default PaymentPage;
