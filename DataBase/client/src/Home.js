import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locations, setLocations] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
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

  const handleLogout = () => {
    // Clear login status and perform any other necessary actions
    setIsLoggedIn(false);
  };

  useEffect(() => {
    // Fetch locations data
    fetch('http://localhost:4001/api/locations')
      .then(response => response.json())
      .then(data => setLocations(data))
      .catch(error => console.error('Error fetching locations:', error));

    // Check if user is logged in (you can implement your logic here)
    // For demonstration, assume user is logged in
    setIsLoggedIn(true);
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
            placeholder="景點名稱或地點..."
            style={{ marginRight: '10px' }}
          />
          <button type="submit">搜尋</button>
          {isLoggedIn ? ( // If user is logged in, display logout button
            <button type="button" onClick={handleLogout} className="logout-button">
              登出
            </button>
          ) : ( // If user is not logged in, display login/register button
            <Link to="/login">
              <button className="login-button" style={{ marginLeft: '10px' }}>
                登入/註冊會員
              </button>
            </Link>
          )}
        </form>
      </header>
      <div className="map-container">
        {/* Map rendering code will be added here */}
      </div>
    </div>
  );
}

export default Home;
