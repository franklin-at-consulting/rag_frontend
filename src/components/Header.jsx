import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/digger.png"; // Your logo image
import UploadDocument from "./UploadDocument";
import About from "./About";
import{
  PlusCircleIcon,
  MinusCircleIcon,
  NoSymbolIcon,
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowUpIcon,  
  ArrowLeftStartOnRectangleIcon,
  InformationCircleIcon,
  Bars4Icon,
  CircleStackIcon,  
}from "@heroicons/react/24/outline";

export function Header() {
  const [menuVisible, setMenuVisible] = useState(false);  
  const [showAboutPopup, setShowAboutPopup] = useState(false);
  
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  }; 

  const toggleAboutPopup = () => {
    setShowAboutPopup(!showAboutPopup);
    document.body.style.overflow = "auto";
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("role");
        navigate("/"); // Redirect to login page
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout", error);
    }
  };

  return (
    <header className="flex justify-between pr-4 pb-3 pt-3">
      {/* Logo and App Name */}
      <div className="flex items-center space-x-2">
        <img src={logo} alt="App Logo" className="w-8 h-8" />
        <h1 className="text-1xl text-gray-800">Packos Digger RAG App</h1>
      </div>

      {/* User Options */}
      <div className="flex items-center space-x-4">
        <button onClick={toggleMenu} className="relative">
          <Bars4Icon className="w-5 h-5 mr-2" />
        </button>
        <div
          id="dropdownDots"
          className={`${menuVisible ? "" : "hidden"
            } bg-white divide-y divide-gray-700 rounded-lg shadow w-48 absolute top-16 right-10 mt-2 z-10`}
        >
          <ul className="py-1 text-sm cursor-pointer text-gray-700">
            <li onClick={toggleAboutPopup} className="px-4 py-1 hover:bg-gray-100 flex items-center space-x-2">              
              <InformationCircleIcon className="w-5 h-5 mr-2" /> 
              <a href="#">About</a>
            </li>             
            <li onClick={handleLogout} className="px-4 py-1 hover:bg-gray-100 flex items-center space-x-2">
              <ArrowLeftStartOnRectangleIcon className="w-5 h-5 mr-2" />
              <a href="#">Logout</a>
            </li>            
          </ul>
        </div>
      </div>
            
      {showAboutPopup && <About onClose={toggleAboutPopup} />}
    </header>
  );
}