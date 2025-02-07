import logo from "../assets/digger.png";

function About({onClose}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto my-10">
        <div className="text-center mb-6">
          <img src={logo} alt="App Icon" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-black">
            About Packo's Digger
          </h2>
        </div>
        <div className="text-gray-700 dark:text-gray-900 mb-6">
          <p className="mb-4">
            Packos Digger is a powerful tool designed to scrape and extract
            valuable information from various documents. Whether you need to
            gather data from PDFs, Word documents, or web pages, Packos Digger
            simplifies the process with just a few clicks.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-900 mb-2">
            How It Works
          </h3>
          <ul className="list-disc list-inside mb-4">
            <li>Upload your document using our intuitive interface.</li>
            <li>Select the specific data points you want to extract.</li>
            <li>Click the "Dig Up" button to retrieve the information.</li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gary-900 mb-2">
            Expected Results
          </h3>
          <ul className="list-disc list-inside">
            <li>Accurate data extraction from your documents.</li>
            <li>Easy-to-read results in various formats (CSV, JSON, etc.).</li>
            <li>Time-saving automation for data collection tasks.</li>
          </ul>
        </div>
        <div className="text-center">
          <button onClick={onClose} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
export default About;
