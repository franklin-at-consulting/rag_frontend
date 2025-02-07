import React, { useState } from "react";
import { XMarkIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";

const UploadDocument = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage({ text: "", type: "" }); // Clear any previous message
  };

  const uploadDocument = async () => {
    if (!file) {
      setMessage({ text: "Please select a file to upload.", type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ text: data.message, type: "success" });
        setFile(null);
      } else {
        setMessage({ text: data.message, type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ text: "An error occurred while uploading.", type: "error" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 relative w-full max-w-md">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white focus:outline-none"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <ArrowUpTrayIcon className="w-6 h-6 mr-2 text-blue-600" />
          Upload Source
        </h2>

        {/* File Input */}
        <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800">
          <input
            type="file"
            id="file_input"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file_input"
            className="cursor-pointer text-gray-600 dark:text-gray-300 text-sm font-medium hover:underline"
          >
            Click to select a file
          </label>
          {file && (
            <p
              className="mt-2 text-sm text-gray-600 truncate max-w-[250px] cursor-pointer"
              title={file.name}
            >
              {file.name}
            </p>
          )}
        </div>

        {/* Dynamic Message */}
        {message.text && (
          <div className="mt-4 text-sm font-medium text-center">
            <p className={message.type === "success" ? "text-green-600" : "text-red-600"}>
              {message.text}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={uploadDocument}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-all"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
