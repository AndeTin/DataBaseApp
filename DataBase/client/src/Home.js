// Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Import the CSS file

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchTerm}`);
  };

  return (
    <div className="Home">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome to the Home Page</h1>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            style={{ marginRight: '10px' }}
          />
          <button type="submit">Search</button>
        </form>
      </header>
      <div className="image-placeholder-container">
        <div className="image-placeholder"></div>
        <div className="image-placeholder"></div>
        <div className="image-placeholder"></div>
        <div className="image-placeholder"></div>
      </div>
    </div>
  );
}

export default Home;
