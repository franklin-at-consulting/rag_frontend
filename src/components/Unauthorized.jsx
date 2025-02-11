import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Unauthorized = () => {
  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    // Fetch the public IP using ipify
    axios.get('https://api.ipify.org?format=json')
      .then((response) => {
        setIpAddress(response.data.ip);
      })
      .catch((error) => {
        console.error('Error fetching the IP address:', error);
      });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-700 mb-6">
          You are not allowed to access this page.
        </p>
        <p className="text-gray-500">Please check the URL or go back to the homepage.</p>
        {ipAddress && (
          <p className="text-sm text-gray-500 mt-4">Your IP Address: {ipAddress}</p>
        )}
      </div>
    </div>
  );
};

export default Unauthorized;
