import React from 'react';

const ShowResults = ({ data }) => {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Response</h2>
      <div
        className="prose prose-indigo mb-6"
        dangerouslySetInnerHTML={{ __html: data.response }}
      />
      
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
