import React, { useState, useRef, useEffect } from 'react';

const SearchBar = ({ onSearch, disabled = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const textareaRef = useRef(null);

  const performSearch = (event) => {
    event.preventDefault();
    if (disabled || searchTerm.trim() === '') return;
    onSearch(searchTerm.trim());
    setSearchTerm('');
    resizeTextarea();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      performSearch(event);
    }
  };

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [searchTerm]);

  return (
    <form
      onSubmit={performSearch}
      className="flex justify-center items-center w-full px-4 py-2"
    >
      <div className="relative w-full max-w-3xl bg-white border border-gray-300 rounded-2xl shadow-sm px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
        {/* Lens Icon - absolute and centered */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>

        <div className="flex items-end">
          <textarea
            ref={textareaRef}
            rows={1}
            className="flex-grow max-h-[120px] overflow-y-auto resize-none bg-transparent text-base focus:outline-none pl-10 pr-4 placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Make a query here..."
            value={searchTerm}
            disabled={disabled}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            disabled={disabled}
            className="ml-2 text-white bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            aria-label="Send query"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-arrow-right"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
