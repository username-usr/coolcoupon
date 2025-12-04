"use client";

import React, { useState } from 'react';

const COUNTRIES = [
  { code: '+1', name: 'US' },
  { code: '+91', name: 'IN' },
  { code: '+44', name: 'UK' },
  { code: '+49', name: 'DE' },
];

export default function CouponForm() {
  const [countryCode, setCountryCode] = useState('+91'); 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const fullPhoneNumber = countryCode + phoneNumber;

    if (!phoneNumber || phoneNumber.length < 10 || isNaN(Number(phoneNumber))) {
      setMessage('❌ Please enter a valid 10-digit number.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber }), 
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Coupon sent successfully via SMS!');
      } else {
        setMessage(`❌ Error: ${data.error || 'Failed to send coupon.'}`);
      }
    } catch (error) {
      setMessage('❌ An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4">
        <label htmlFor="phone-input" className="block mb-2.5 text-sm font-medium text-gray-700">
            Phone Number:
        </label>
        
        <div className="relative flex flex-col sm:flex-row shadow-md rounded-lg"> 
          
          {/* Country Code Dropdown */}
          <select
            id="country-code"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-t-lg sm:rounded-r-none sm:rounded-l-lg focus:ring-4 focus:outline-none focus:ring-gray-300"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
          
          {/* Phone Number Input */}
          <div className="relative w-full">
            <input
              type="tel"
              id="phone-input"
              className="block w-full z-20 ps-4 pe-3 py-2.5 text-gray-900 bg-white border border-gray-300 
                         rounded-b-lg sm:rounded-l-none sm:rounded-r-lg 
                         
                         /* FIX: Explicitly set focus styles to remove all glow */
                         focus:ring-transparent focus:border-gray-300 focus:ring-0" 
              placeholder="e.g., 9876543210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>
        </div>
        
        <p id="helper-text-explanation" className="mt-2.5 text-sm text-gray-500">
          We will text your 4-digit code to this number.
        </p>
      </div>

      {/* Button with GLOW EFFECT */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg text-white font-extrabold text-lg transition duration-300 
          shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-300/50 
          ${loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transform active:scale-95'
          }
        `}
      >
        {loading ? 'Sending...' : 'Redeem Now'}
      </button>

      {message && (
        <p className={`mt-4 text-center text-sm font-medium ${message.startsWith('❌') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
}