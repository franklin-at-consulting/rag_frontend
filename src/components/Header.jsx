import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/digger.png";
import UploadDocument from "./UploadDocument";
import About from "./About";

export function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showAboutPopup, setShowAboutPopup] = useState(false);
  const [role, setRole] = useState(""); // State to store user role
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user role from session storage
    const storedRole = sessionStorage.getItem("role");
    if (storedRole) {
      console.log(storedRole)
      setRole(storedRole);
    }
  }, []);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleUploadPopup = () => {
    console.log("Show Upload Document popup");
    setShowUploadPopup(!showUploadPopup);
    document.body.style.overflow = "auto";
  };

  const toggleAboutPopup = () => {
    // Add your logic for showing the about section
    console.log("Show About");
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
    <header>
      <nav className="navbar">
        <button onClick={toggleMenu} type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-menu"
            viewBox="0 0 24 24"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div
          id="dropdownDots"
          className={`${
            menuVisible ? "" : "hidden"
          } bg-white divide-y divide-gray-700 rounded-lg shadow w-44 dark:bg-white dark:divide-gray-600 menu`}
        >
          <ul className="py-1 text-sm text-gray-700 dark:text-gray-700">
            <li onClick={handleLogout} className="block px-4 py-1">
              Logout
            </li>
            {role === "admin" && (
              <li onClick={toggleUploadPopup} className="block px-4 py-1">
                Upload Documents
              </li>
            )}
            <li onClick={toggleAboutPopup} className="block px-4 py-1">
              About
            </li>
          </ul>
        </div>
      </nav>
      <img src={logo} alt="Digger Rag Documents Logo" className="logo" />
      {showUploadPopup && <UploadDocument onClose={toggleUploadPopup} />}
      {showAboutPopup && <About onClose={toggleAboutPopup} />}
    </header>
  );
}
