import React, { useState } from "react";
import { apiUrl } from "../config";
import {  
  TrashIcon,
  XMarkIcon, 
} from "@heroicons/react/24/outline";

const DeleteUser = ({ onClose,user,refreshUser }) => {
  const [email, setEmail] = useState(user.email);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Handle form submission to delete the user
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConfirmed) {
      alert("Please confirm the deletion by checking the box.");
      return;
    }

    try {
      const response = await fetch(apiUrl('/delete-user'), {
        method: "DELETE", // Use DELETE for removing the user
        credentials: 'include',  // This ensures that cookies (including session cookies) are sent
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Send email to the backend for deletion
      });

      const data = await response.json();
      if (response.ok) {
        alert("User deleted successfully!");
        refreshUser()
        onClose(); // Close the modal after successful deletion
      } else {
        alert(data.message || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during user deletion.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg rounded-lg w-96 relative p-6 z-50">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-all"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
          User Deletion
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <TrashIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              placeholder="User Email"
              type="email"
              id="email"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              value={email}              
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="ml-2 form-checkbox"
              />
              <span className="ml-2">Confirm Deletion</span>
            </label>
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Delete User
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteUser;
