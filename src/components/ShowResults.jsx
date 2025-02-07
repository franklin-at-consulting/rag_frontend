const ShowResults = ({ data }) => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b pb-2">
        Response
      </h2>
      <div
        className="prose prose-indigo mb-6"
        dangerouslySetInnerHTML={{ __html: data.response }}
      />

      <h3 className="text-xl font-bold text-gray-700 mb-4">Sources</h3>
      <ul>
        {data.sources.map((source, index) => (
          <li
            key={index}
            className="flex items-start mb-6 p-4 bg-gray-50 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <img
              src={source.thumbnail_url}
              alt={source.document_name}
              className="w-24 h-24 mr-4 object-cover rounded-md border"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-lg text-gray-800 mb-1">
                {source.document_name}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium text-gray-700">Score:</span> {source.score}
              </p>
              <p className="text-sm text-gray-600 mb-4">{source.paragraph}</p>
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


/*
const ShowResults = ({data}) => {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Response</h2>
      <p className="mb-4">{data.response}</p>

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
*/
