import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataList from './Location/DataList.js';

function App() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = (query = '') => {
    axios.get(`http://localhost:4001/api/data?search=${query}`)
      .then(response => {
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
    fetchData(searchTerm);
  };

  return (
    <div className="App">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Data from MySQL Database</h1>
        <form onSubmit={handleSearchSubmit}>
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
      <DataList data={data} />
    </div>
  );
}

export default App;
