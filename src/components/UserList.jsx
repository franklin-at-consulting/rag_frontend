import React, { useState, useEffect } from "react";

const UserList = ({ onClose }) => {
  const [users, setUsers] = useState([]);

  // Fetch the list of users when the component is mounted
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/users", {
          method: "GET",
          credentials: "include", // Ensure session cookies are sent
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data.users); // Use the "users" field from the response
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle the block/unblock toggle and send the update to the server
  const handleToggleBlock = async (userEmail, isBlocked) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/update-block-status",
        {
          method: "POST",
          credentials: "include", // Ensure session cookies are sent
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail, block: !isBlocked }), // Toggle block status
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update block status");
      }

      // Update the block status in the users list without refetching the entire list
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === userEmail ? { ...user, block: !isBlocked } : user
        )
      );
    } catch (error) {
      console.error("Error updating block status:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white shadow-2xl rounded-lg w-full max-w-4xl relative p-6 z-50">

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
          User List
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left text-gray-600 font-semibold border-b">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold border-b">
                  Last Login
                </th>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold border-b">
                  Last Logout
                </th>
                <th className="px-4 py-3 text-center text-gray-600 font-semibold border-b">
                  Session Status
                </th>
                <th
                  className="px-4 py-3 text-center text-gray-600 font-semibold border-b"
                  style={{ width: "150px" }}
                >
                  Blocked
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.email} className="hover:bg-gray-50">
                  <td className="border px-4 py-3 text-gray-800">
                    {user.email}
                  </td>
                  <td className="border px-4 py-3 text-gray-600">
                    {user.login_date || "N/A"}
                  </td>
                  <td className="border px-4 py-3 text-gray-600">
                    {user.logout_date || "N/A"}
                  </td>
                  <td className="border px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 inline-flex leading-5 font-semibold rounded-full ${user.is_connected
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {user.is_connected ? "Connected" : "Disconnected"}
                    </span>
                  </td>
                  <td
                    className="border px-4 py-3 text-center"
                    style={{ width: "150px" }}
                  >
                    <label className="inline-flex items-center">
                      <span className="mr-2">
                        {user.block ? "Locked" : "Unlocked"}
                      </span>
                      <input
                        type="checkbox"
                        className="toggle-checkbox"
                        checked={user.block}
                        onChange={() =>
                          handleToggleBlock(user.email, user.block)
                        }
                      />
                      <span className="toggle-switch"></span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
