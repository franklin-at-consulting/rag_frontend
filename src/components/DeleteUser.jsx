import React, { useState } from "react";

const DeleteUser = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Handle form submission to delete the user
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConfirmed) {
      alert("Please confirm the deletion by checking the box.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/delete-user", {
        method: "DELETE", // Use DELETE for removing the user
        credentials: 'include',  // This ensures that cookies (including session cookies) are sent
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Send email to the backend for deletion
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
        alert("User deleted successfully!");
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
        <h2 className="text-center text-2xl font-bold mb-4">Delete User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">            
            <input
            placeholder="User Email"
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="form-checkbox"
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
