import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locations, setLocations] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchTerm}`);
  };

  const handleLogout = () => {
    // Clear user email from local storage
    localStorage.removeItem('userEmail');
    // Clear user login status from memory
    setUserEmail('');
    // Navigate to home page
    navigate('/');
  };

  useEffect(() => {
    // Fetch locations data
    fetch('http://localhost:4001/api/locations')
      .then(response => response.json())
      .then(data => setLocations(data))
      .catch(error => console.error('Error fetching locations:', error));

    // Retrieve user email from local storage
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  return (
    <div className="Home">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>山上優雅</h1>
        <div>
          {userEmail && ( // If user email is available, display it
            <p>Welcome {userEmail}</p>
          )}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="景點名稱或地點..."
              style={{ marginRight: '10px' }}
            />
            <button type="submit">搜尋</button>
            {userEmail ? ( // If user email is available, display logout button
              <button type="button" onClick={handleLogout} className="logout-button">
                登出
              </button>
            ) : ( // If user email is not available, display login/register button
              <Link to="/login">
                <button className="login-button" style={{ marginLeft: '10px' }}>
                  登入/註冊會員
                </button>
              </Link>
            )}
          </form>
        </div>
      </header>
      <div className="map-container">
        {/* Map rendering code will be added here */}
      </div>
    </div>
  );
}

export default Home;
