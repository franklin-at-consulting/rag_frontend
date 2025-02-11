import React, { useState } from "react";

const UpdateUser = ({ onClose }) => {
  const [email, setEmail] = useState("");
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
      const response = await fetch("http://127.0.0.1:5000/api/update-user", {
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
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg rounded-lg w-96 relative p-6 z-50">
        <h2 className="text-center text-2xl font-bold mb-4">Update User Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">            
            <input
              type="email"
              placeholder="Email"
              id="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">            
            <input
              type="password"
              id="newPassword"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">            
            <input
              type="password"
              placeholder="Confirm Password"
              id="confirmPassword"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Update Password
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
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
