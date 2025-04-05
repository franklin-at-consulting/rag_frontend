import React, { useState } from "react";
import { XMarkIcon, UserIcon, LockClosedIcon, ShieldCheckIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

const UpdateUser = ({ onClose,user }) => {
  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle form submission to update the user's password
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the passwords match
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    try {
      const response = await fetch("http://54.237.145.9/api/update-user", {
        method: "PUT", // Use PUT for updates
        credentials: 'include',  // This ensures that cookies (including session cookies) are sent
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }), // Send email and new password to the backend
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
        alert("Password updated successfully!");
        onClose(); // Close the modal after successful update
      } else {
        alert(data.message || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during password update.");
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
          Password Change
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username Input */}
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              id="email"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="password"
              id="newPassword"
              placeholder="Password"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Confirm Password"
              id="confirmPassword"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all focus:ring-2 focus:ring-blue-500"
            >
              Update Password
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all focus:ring-2 focus:ring-red-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
