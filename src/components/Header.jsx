import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/digger.png"; // Your logo image
import About from "./About";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import DeleteUser from "./DeleteUser";
import UserList from "./UserList"

import {
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  InformationCircleIcon,
  ArrowLeftStartOnRectangleIcon,
  Bars4Icon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";

export function Header({ role }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showAboutPopup, setShowAboutPopup] = useState(false);
  const [adminMenuVisible, setAdminMenuVisible] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isUpdateUserOpen, setIsUpdateUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [isUserListOpen, setIsUserListOpen] = useState(false);

  const navigate = useNavigate(); 

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    if (!menuVisible) setAdminMenuVisible(false); // Close admin menu when closing main menu
  };

  const toggleAboutPopup = () => {
    setShowAboutPopup(!showAboutPopup);
    document.body.style.overflow = "auto";
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/logout", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json()
      if (response.ok) {
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("role");        
        console.log(data.message)
        navigate("/"); // Redirect to login page
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout", error);
    }
  };

  //Handle CRUD OPtions

  const handleAddOption = () => {
    setIsCreateUserOpen(true);
    document.body.classList.add("modal-open");    
  };

  const handleUpdateOption = () => {
    setIsUpdateUserOpen(true);
    document.body.classList.add("modal-open");    
  };

  const handleDeleteOption = () => {
    setIsDeleteUserOpen(true);
    document.body.classList.add("modal-open");    
  };

  const handleCloseModal = (setModalState) => {
    setModalState(false);
    document.body.classList.remove("modal-open");
  };

  const handleUserList = (setModalState) => {
    setIsUserListOpen(true);
    document.body.classList.remove("modal-open");
  };

  return (
    <header className="flex justify-between pr-4 pb-3 pt-3 relative">
      {/* Logo and App Name on the Left */}
      <div className="flex items-center space-x-2">
        <img src={logo} alt="App Logo" className="w-8 h-8" />
        <h1 className="text-xl text-gray-800">RAG Document Aplication</h1>
      </div>

      {/* User Options on the Right */}
      <div className="relative flex items-center space-x-4">
        <button onClick={toggleMenu} className="p-2 focus:outline-none">
          <Bars4Icon className="w-6 h-6 text-gray-700" />
        </button>

        {/* Main Dropdown Menu */}
        {menuVisible && (
          <div className="absolute top-10 right-10 bg-white divide-y divide-gray-200 rounded-sm drop-shadow-lg w-60 z-10">
            <ul className="text-lg py-1 mt-2 mb-2 text-gray-700 cursor-pointer">

              {/* Admin Users - Hover to Show Submenu */}
              {role === "admin" && (
                <li
                  className="px-4 py-1 hover:bg-gray-100 flex items-center space-x-2 rounded-sm relative"
                  onMouseEnter={() => setAdminMenuVisible(true)}
                  onMouseLeave={() => setAdminMenuVisible(false)}
                >
                  <UsersIcon className="w-6 h-6" />
                  <span>User Management</span>

                  {/* Secondary Dropdown Menu - Appears on Hover */}
                  {adminMenuVisible && (
                    <div className="absolute right-60 top-0 bg-white w-60 rounded-sm">
                      <ul className="text-lg mt-2 mb-2 text-gray-700">
                        <li onClick={handleAddOption} className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-sm cursor-pointer">
                          <PlusCircleIcon className="w-6 h-6 mr-2" />
                          <span>Create User</span>
                        </li>
                        <li onClick={handleUserList} className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-sm cursor-pointer">
                          <CircleStackIcon className="w-6 h-6 mr-2" />
                          <span>View Users</span>
                        </li>
                        <li onClick={handleUpdateOption} className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-sm cursor-pointer">
                          <PencilIcon className="w-6 h-6 mr-2" />
                          <span>Change Passwords</span>
                        </li>
                        <li onClick={handleDeleteOption} className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-sm cursor-pointer">
                          <TrashIcon className="w-6 h-6 mr-2" />
                          <span>Delete User</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              )}
              {/* About */}
              <li
                onClick={toggleAboutPopup}
                className="px-4 py-1 hover:bg-gray-100 flex items-center rounded-sm space-x-2"
              >
                <InformationCircleIcon className="w-6 h-6" />
                <span>About</span>
              </li>

              {/* Logout */}
              <li
                onClick={handleLogout}
                className="px-4 py-1 hover:bg-gray-100 flex items-center rounded-sm space-x-2"
              >
                <ArrowLeftStartOnRectangleIcon className="w-6 h-6" />
                <span>Logout</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {showAboutPopup && <About onClose={toggleAboutPopup} />}

      {/* Render Admin Users Logic Modals */}
      {isCreateUserOpen && (
        <CreateUser onClose={() => handleCloseModal(setIsCreateUserOpen)} />
      )}
      {isUpdateUserOpen && (
        <UpdateUser onClose={() => handleCloseModal(setIsUpdateUserOpen)} />
      )}
      {isDeleteUserOpen && (
        <DeleteUser onClose={() => handleCloseModal(setIsDeleteUserOpen)} />
      )}
      {isUserListOpen && (
        <UserList onClose={() => handleCloseModal(setIsUserListOpen)} />
      )}
      
    </header>
  );
}
