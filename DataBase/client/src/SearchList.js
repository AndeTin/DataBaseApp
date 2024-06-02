import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css'; // Import the CSS file

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchList() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const query = useQuery();
  const navigate = useNavigate();
  const queryParam = query.get('query') || '';

  useEffect(() => {
    if (queryParam) {
      setSearchTerm(queryParam);
      fetchData(queryParam);
    }
  }, [queryParam]);

  const fetchData = (query = '') => {
    console.log(`Fetching data with query: ${query}`); // Log for debugging
    axios.get(`http://localhost:4001/api/data?search=${query}`)
      .then(response => {
        console.log('Response data:', response.data); // Log response for debugging
        setData(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchTerm}`);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="SearchList">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Data from MySQL Database</h1>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            style={{ marginRight: '10px' }}
          />
          <button type="submit" style={{ marginRight: '10px' }}>Search</button>
          <button type="button" onClick={handleGoHome}>回到首頁</button>
        </form>
      </header>
      <div>
        {data.map(location => (
          <div key={location.id} className="location-item">
            <span className="location-title">{location.location_name}</span>
            <div className="location-details">
              <p>Opening Time: {location.opening_time}</p>
              <p>Closing Time: {location.closing_time}</p>
              <p>Address: {location.address}</p>
            </div>
            <button 
              className="see-more-button" 
              onClick={() => navigate(`/location/${location.id}`)} 
              style={{ marginLeft: '10px' }}
            >
              See More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchList;
