import React, { useState } from 'react';

const ShowResults = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data.content || '';
    await navigator.clipboard.writeText(tempDiv.textContent || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sources = data.sources || [];

  return (
    <div
      className={`max-w-3xl rounded-2xl rounded-bl-sm border px-4 py-3 shadow-md ${
        data.isError
          ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200"
          : "border-gray-200 bg-white text-gray-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
          Assistant
        </div>
        <div className="relative">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-gray-500 transition-colors hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-100"
            type="button"
            aria-label="Copy assistant response"
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
                <span className="text-xs">Copied!</span>
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
          className={`prose prose-indigo max-w-none text-sm leading-6 ${
            sources.length > 0 ? "mb-5" : ""
          } dark:text-slate-100`}
          dangerouslySetInnerHTML={{ __html: data.content || '' }}
        />
      </div>

      {sources.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/70 dark:bg-amber-950/30">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
            Sources for this answer
          </h3>
          <ul className="space-y-3">
            {sources.map((source, index) => (
              <li
                key={`${source.document_name}-${index}`}
                className="flex items-start rounded-lg border border-amber-100 bg-white p-3 dark:border-amber-900/60 dark:bg-slate-950"
              >
                {source.thumbnail_url && (
                  <img
                    src={source.thumbnail_url}
                    alt={source.document_name}
                    className="mr-4 h-20 w-20 rounded border object-cover"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-slate-100">{source.document_name}</h4>
                  {source.score !== undefined && (
                    <p className="mb-2 text-xs text-gray-500 dark:text-slate-400">
                      Score: {source.score}
                    </p>
                  )}
                  {source.paragraph && (
                    <p className="mb-2 text-sm text-gray-700 dark:text-slate-300">{source.paragraph}</p>
                  )}
                  <a
                    href={source.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Document
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ShowResults;
