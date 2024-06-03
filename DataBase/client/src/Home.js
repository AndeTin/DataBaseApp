import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchTerm}`);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    fetch('http://localhost:4001/api/locations')
      .then(response => response.json())
      .then(data => setLocations(data))
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  return (
    <div className="Home">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>山上優雅</h1>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            style={{ marginRight: '10px' }}
          />
          <button type="submit">Search</button>
          <button
            type="button"
            onClick={handleLogin}
            className="login-button"
            style={{ marginLeft: '10px' }}  // Add margin-left for spacing
          >
            Login
          </button>
        </form>
      </header>
      <div className="map-container">
        {/* Map rendering code will be added here */}
      </div>
    </div>
  );
}

export default Home;
