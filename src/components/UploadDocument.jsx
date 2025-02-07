import React from "react";
import { useState } from "react";

const UploadDocument = ({ onClose }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadDocument = () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert("File uploaded successfully");
        onClose(); // Close the modal after successful upload
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while uploading the file.");
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-white rounded-lg shadow-lg p-6 relative w-full max-w-screen-sm">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-black focus:outline-none"
        >
          &times;
        </button>
        <label className="block mb-4 text-sm font-medium text-gray-900 dark:text-black">
          Upload file
        </label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-white dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          type="file"
          onChange={handleFileChange}
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={uploadDocument}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
