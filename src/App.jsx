import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "./components/Header";
import SearchBar from "./components/SearchBar";
import ShowResults from "./components/ShowResults";
import UploadDocument from './components/UploadDocument';
import { apiUrl } from "./config";
import {
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

const CHAT_HISTORY_KEY = "ragChatMessages";

const loadChatHistory = () => {
  try {
    const savedMessages = sessionStorage.getItem(CHAT_HISTORY_KEY);
    return savedMessages ? JSON.parse(savedMessages) : [];
  } catch (error) {
    console.error("Error loading chat history:", error);
    return [];
  }
};

function App() {
  const [messages, setMessages] = useState(loadChatHistory);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(""); // State to store user role
  const [showUploadPopup, setShowUploadPopup] = useState(false);  
  const latestMessageRef = useRef(null);
  const navigate = useNavigate();
  
    useEffect(() => {
      const checkSession = async () => {
        try {
          const response = await fetch(apiUrl('/check-session'), {
            method: "GET",
            credentials: "include",
          });
  
          if (response.status === 401) {  // 🔹 Handle session expiration
            alert("Your session has expired. Redirecting to login...");
            sessionStorage.removeItem("isAuthenticated");
            sessionStorage.removeItem("role");
            navigate("/");
          }
        } catch (error) {
          console.error("Error checking session:", error);
        }
      };
  
      const interval = setInterval(checkSession, 60000); // 🔹 Check every 60 seconds
      return () => clearInterval(interval); // Cleanup on unmount
    }, [navigate]);

  const toggleUploadPopup = () => {
    setShowUploadPopup(!showUploadPopup);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    // Retrieve user role from session storage
    const storedRole = sessionStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    sessionStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  }, [messages]);

  const handleSearch = async (searchTerm) => {
    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: searchTerm,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(apiUrl('/query'), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query_text: searchTerm }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      const data = await response.json();
      const assistantMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: data.response,
        sources: data.sources || [],
      };
      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
    } catch (err) {
      const errorMessage = {
        id: `${Date.now()}-assistant-error`,
        role: "assistant",
        content: `Can't Obtain The Information: ${err.message}`,
        sources: [],
        isError: true,
      };
      setMessages((currentMessages) => [...currentMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app flex flex-col h-screen overflow-hidden">
      <Header role={role} />

      {/* Main content container */}
      <div className="flex flex-grow w-full space-x-4 rounded-xl mb-4 pb-1 overflow-hidden">

        {/* Left Sidebar */}
        <div className="w-1/4 bg-gray-50 p-4 rounded-xl shadow-md">
          <h2 className="text-lg mb-6">Sources</h2>
          <hr className="border-t-2 border-gray-300 mb-4" />
          {role === "admin" && (
            <button
              onClick={toggleUploadPopup}
              className="center-button hover:bg-gray-200 hover:shadow-md flex items-center p-2"
            >
              <PlusCircleIcon className="w-5 h-5 mr-1" />
              <a href="#">Add Source</a>
            </button>
          )}
        </div>

        {/* Middle Section */}
        <div className="flex-1 p-4 bg-gray-50 rounded-xl shadow-md flex flex-col overflow-hidden">
          <h2 className="text-lg mb-6">Results</h2>
          <hr className="border-t-2 border-gray-300 mb-4" />

          {/* Chat thread */}
          <div
            id="results-container"
            className="mt-6 flex-grow overflow-y-auto pr-2"
          >
            {messages.length > 0 ? (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "user" ? (
                      <div className="max-w-3xl rounded-2xl rounded-br-sm bg-blue-600 px-4 py-3 text-white shadow-md">
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
                          You
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                      </div>
                    ) : (
                      <ShowResults data={message} />
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-3xl rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-md">
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Assistant
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                        <p className="text-sm">Thinking...</p>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={latestMessageRef} />
              </div>
            ) : (
              <div className="text-center mt-6 text-gray-500">
                <h3 className="text-xl">Welcome to the RAG Documents App!</h3>
                <p>Start by entering a query in the search box to explore your documents.</p>
              </div>
            )}
          </div>

          {/* SearchBar */}
          <div className="w-full pt-3 rounded-xl mt-4 self-end">
            <SearchBar onSearch={handleSearch} disabled={loading} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-1/4 bg-gray-50 p-4 rounded-xl shadow-md">
          <h2 className="text-lg mb-6">Options</h2>
          <hr className="border-t-2 border-gray-300 mb-4" />
          <div>
            {/* Put additional content here */}
          </div>
        </div>
      </div>

      {showUploadPopup && <UploadDocument onClose={toggleUploadPopup} />}
    </div>

  );
}

export default App;
