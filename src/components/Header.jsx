import React, { useState,useRef,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Your logo image
import About from "./About";
import UserList from "./UserList";
import {
  ArrowLeftStartOnRectangleIcon,
  Bars4Icon,
  InformationCircleIcon,
  MoonIcon,
  SunIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { apiUrl } from "../config";

const THEME_STORAGE_KEY = "ragTheme";

const getInitialTheme = () => {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export function Header({ role }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showAboutPopup, setShowAboutPopup] = useState(false);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const isDarkMode = theme === "dark";

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [isDarkMode, theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };

    if (menuVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuVisible]);

  const toggleAboutPopup = () => {
    setShowAboutPopup(!showAboutPopup);
    setMenuVisible(false);
    document.body.style.overflow = "auto";
  };

  const handleUserList = (setModalState) => {
    setIsUserListOpen(true);
    setMenuVisible(false);
    document.body.classList.remove("modal-open");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(apiUrl('/logout'), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("role");
        console.log(data.message);
        navigate("/"); // Redirect to login page
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout", error);
    }
    setMenuVisible(false);
  };

  return (
    <header className="flex justify-between pr-4 pb-3 pt-3 relative">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="App Logo" className="w-8 h-12" />
        <h1 className="text-xl text-gray-800 dark:text-slate-100">RAG Document Application</h1>
      </div>

      <div className="relative flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="rounded-lg border border-gray-300 p-2 text-gray-700 transition hover:bg-gray-200 focus:outline-none dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700"
          type="button"
          aria-label={isDarkMode ? "Switch to lite mode" : "Switch to dark mode"}
          title={isDarkMode ? "Lite mode" : "Dark mode"}
        >
          {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
        </button>
        <button onClick={toggleMenu} className="rounded-lg p-2 transition hover:bg-gray-200 focus:outline-none dark:hover:bg-slate-700">
          <Bars4Icon className="w-6 h-6 text-gray-700 dark:text-slate-100" />
        </button>

        {menuVisible && (
          <div
            ref={menuRef}
            className="absolute top-10 right-10 bg-white divide-y divide-gray-200 rounded-sm drop-shadow-lg w-60 z-10 dark:divide-slate-700 dark:bg-slate-800"
          >
            <ul className="text-lg py-1 mt-2 mb-2 text-gray-700 cursor-pointer dark:text-slate-100">
              {role === "admin" && (
                <li
                  className="px-4 py-1 hover:bg-gray-100 flex items-center space-x-2 rounded-sm relative dark:hover:bg-slate-700"
                  onClick={handleUserList}
                >
                  <UsersIcon className="w-6 h-6" />
                  <span>User Management</span>
                </li>
              )}
              <li
                onClick={toggleAboutPopup}
                className="px-4 py-1 hover:bg-gray-100 flex items-center rounded-sm space-x-2 dark:hover:bg-slate-700"
              >
                <InformationCircleIcon className="w-6 h-6" />
                <span>About</span>
              </li>
              <li
                onClick={handleLogout}
                className="px-4 py-1 hover:bg-gray-100 flex items-center rounded-sm space-x-2 dark:hover:bg-slate-700"
              >
                <ArrowLeftStartOnRectangleIcon className="w-6 h-6" />
                <span>Logout</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {showAboutPopup && <About onClose={toggleAboutPopup} />}
      {isUserListOpen && <UserList onClose={() => setIsUserListOpen(false)} />}


    </header>
  );
}
