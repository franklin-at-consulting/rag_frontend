import React, { useState, useEffect } from "react";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import DeleteUser from "./DeleteUser";
import { PlusCircleIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

const UserList = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdateUserOpen, setIsUpdateUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/users", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (!response.ok) {
          console.error("Some problems have happened: ", data.message);
        }
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const refreshUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/users", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
      } else {
        console.error("Failed to refresh users:", data.message);
      }
    } catch (error) {
      console.error("Error refreshing users:", error);
    }
  };

  const handleToggleBlock = async (userEmail, isBlocked) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/update-block-status", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, block: !isBlocked }),
      });
      if (!response.ok) throw new Error("Failed to update block status");
      setUsers(prevUsers => prevUsers.map(user => user.email === userEmail ? { ...user, block: !isBlocked } : user));
    } catch (error) {
      console.error("Error updating block status:", error);
    }
  };

  const filteredUsers = users.filter(user => user.email.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white shadow-2xl rounded-lg w-full max-w-4xl relative p-6 z-50">
        <button onClick={() => onClose && onClose()} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">User Management</h2>

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 p-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setIsCreateUserOpen(true)}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <PlusCircleIcon className="w-4 h-4 mr-2" /> Add User
          </button>
        </div>

        <div className="overflow-x-auto max-h-96 scrollbar-hide">
          <table className="w-full table-auto border-collapse">
            <thead className="text-left sticky top-0 z-10 bg-gray-200">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Last Login</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Lock</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.email} className="hover:bg-gray-100">
                    <td className="border px-4 py-3">{user.email}</td>
                    <td className="border px-4 py-3">{user.login_date || "N/A"}</td>
                    <td className="border px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full ${
                          user.is_connected ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                        }`}
                      >
                        {user.is_connected ? "Connected" : "Disconnected"}
                      </span>
                    </td>
                    <td className="border px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={user.block}
                        onChange={() => handleToggleBlock(user.email, user.block)}
                      />
                    </td>
                    <td className="border px-4 py-3 text-center">
                      <div className="flex space-x-2 justify-center">
                        {/* Change Password Button */}
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsUpdateUserOpen(true);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteUserOpen(true);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isCreateUserOpen && <CreateUser onClose={() => setIsCreateUserOpen(false)} refreshUser = {refreshUsers}/>}
        {isUpdateUserOpen && <UpdateUser user={selectedUser} onClose={() => setIsUpdateUserOpen(false)} />}
        {isDeleteUserOpen && <DeleteUser user={selectedUser} onClose={() => setIsDeleteUserOpen(false)} refreshUser={refreshUsers}/>}
      </div>
    </div>
  );
};

export default UserList;
