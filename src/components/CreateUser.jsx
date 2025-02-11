import React, { useState } from "react";
import { XMarkIcon, UserIcon, LockClosedIcon, ShieldCheckIcon,EnvelopeIcon} from "@heroicons/react/24/outline";

const CreateUser = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role

  // Handle form submission to create a new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/api/create-user", {
        method: "POST",
        credentials: 'include',  // This ensures that cookies (including session cookies) are sent
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username,email, password, role }), // Send username, email, password, and role to the backend
      });
      /*
      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized access (e.g., redirect to login)
          //console.log("Unauthorized access, redirecting to login.");
          //alert("Unauthorized access, redirecting to login.")
          navigate("/open-imb");
        }
        throw new Error('Network response was not ok');
      }
      */

      const data = await response.json();
      if (response.ok) {
        alert("User created successfully!");
        onClose(); // Close the modal after successful creation
      } else {
        alert(data.message || "Failed to create user.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during user creation.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg w-96 p-6 relative transform transition-all duration-300 scale-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-all"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
          Create New User
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username Input */}
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="User"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          {/* Email Input */}
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role Selection */}
          <div className="relative">
            <ShieldCheckIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all focus:ring-2 focus:ring-blue-500"
            >
              Create User
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all focus:ring-2 focus:ring-red-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser