import React, { useState } from 'react';

const ShowResults = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data.response;
    await navigator.clipboard.writeText(tempDiv.textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Response</h2>
        <div className="relative">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
          >
            {copied ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Copied!</span>
              </>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="relative">
        <div
          className="prose prose-indigo mb-6 pr-10"
          dangerouslySetInnerHTML={{ __html: data.response }}
        />
      </div>

      <h3 className="text-lg font-semibold mb-2">Sources</h3>
      <ul>
        {data.sources.map((source, index) => (
          <li
            key={index}
            className="flex items-start mb-4 p-4 border rounded-lg"
          >
            <img
              src={source.thumbnail_url}
              alt={source.document_name}
              className="w-24 h-24 mr-4 object-cover"
            />
            <div>
              <h4 className="font-semibold">{source.document_name}</h4>
              <p className="text-sm text-gray-700 mb-2">
                Score: {source.score}
              </p>
              <p className="text-sm text-gray-700 mb-2">{source.paragraph}</p>
              <a
                href={source.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Document
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowResults;

