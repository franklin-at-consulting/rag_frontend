import React, { useState } from 'react';
import { Header } from "./components/Header";
import SearchBar from "./components/SearchBar";
import ShowResults from "./components/ShowResults";
import { Outlet } from 'react-router-dom';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (searchTerm) => {
    // Reset states
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/query', {
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
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">
      <Header />
      <Outlet />
      <SearchBar onSearch={handleSearch} />
      
      {loading && <p style={{marginTop: 25 }}>Thinking...</p>}
      {error && <p style={{ color: 'red', marginTop: 25  }}>Error: {error}</p>}

      <div id="results-container">
        {results && <ShowResults data={results} />}
      </div>
    </main>
  );
}

export default App;
