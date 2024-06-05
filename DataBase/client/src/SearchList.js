import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import './App.css'; // Import the CSS file

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchList() {
  const [locationData, setLocationData] = useState([]);
  const [trailData, setTrailData] = useState([]);
  const [filteredTrailData, setFilteredTrailData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('location'); // State to manage the current view
  const [checkedClass, setCheckedClass] = useState(null);
  const query = useQuery();
  const navigate = useNavigate();
  const queryParam = query.get('query') || '';

  useEffect(() => {
    if (queryParam) {
      setSearchTerm(queryParam);
      fetchData(queryParam);
    } else {
      fetchData();
    }
  }, [queryParam]);

  useEffect(() => {
    if (checkedClass !== null) {
      setFilteredTrailData(trailData.filter(trail => trail.tr_dif_class === Number(checkedClass)));
    } else {
      setFilteredTrailData(trailData);
    }
  }, [trailData, checkedClass]);

  const fetchData = (query = '') => {
    console.log(`Fetching data with query: ${query}`); // Log for debugging
    axios.get(`http://localhost:4001/api/location?search=${query}`)
      .then(response => {
        console.log('Location data:', response.data); // Log response for debugging
        setLocationData(response.data);
      })
      .catch(error => {
        console.error('Error fetching location data:', error);
      });

    axios.get(`http://localhost:4001/api/trail?search=${query}`)
      .then(response => {
        console.log('Trail data:', response.data); // Log response for debugging
        setTrailData(response.data);
        setFilteredTrailData(response.data);
      })
      .catch(error => {
        console.error('Error fetching trail data:', error);
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

  const handleSeeMoreLocation = (id) => {
    navigate(`/location/${id}`);
  };

  const handleSeeMoreTrail = (id) => {
    navigate(`/trail/${id}`);
  };

  const toggleView = () => {
    setView((prevView) => (prevView === 'location' ? 'trail' : 'location'));
    setCheckedClass(null); // Reset the checkbox selection when toggling views
  };

  const handleClassChange = (event) => {
    const selectedClass = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setCheckedClass(selectedClass);
      setFilteredTrailData(trailData.filter(trail => trail.tr_dif_class === Number(selectedClass)));
    } else {
      setCheckedClass(null);
      setFilteredTrailData(trailData);
    }
  };

  return (
    <div className="SearchList">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>查詢結果</h1>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="輸入關鍵字搜尋..."
            style={{ marginRight: '10px' }}
          />
          <button type="submit" style={{ marginRight: '10px' }}>Search</button>
          <button type="button" onClick={handleGoHome}>回到首頁</button>
        </form>
      </header>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <span>Show Location Data</span>
        <Switch
          checked={view === 'trail'}
          onChange={toggleView}
          color="primary"
          inputProps={{ 'aria-label': 'toggle view' }}
          style={{ marginLeft: '0px', marginRight: '10px' }}
        />
        <span>Show Trail Data</span>
      </div>
      {view === 'location' ? (
        <div>
          <h2>Location Data</h2>
          {locationData.map(location => (
            <div key={location.id} className="item">
              <span className="title">{location.location_name}</span>
              <div className="details">
                <p>開門時間: {location.opening_time}</p>
                <p>打烊時間: {location.closing_time}</p>
                <p>地址: {location.address}</p>
              </div>
              <button 
                className="see-more-button" 
                onClick={() => handleSeeMoreLocation(location.id)} 
                style={{ marginLeft: '10px' }}
              >
                查看更多
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h2>Trail Data</h2>
          <div className="sorting-controls">
            <div className="sorting-class">
              <span>Filter by class:</span>
              <FormGroup row>
                {[1, 2, 3, 4, 5].map((num) => (
                  <FormControlLabel
                    key={num}
                    control={
                      <Checkbox
                        checked={checkedClass === `${num}`}
                        onChange={handleClassChange}
                        value={num}
                        name={`class-${num}`}
                      />
                    }
                    label={num}
                  />
                ))}
              </FormGroup>
            </div>
          </div>
          {filteredTrailData.map(trail => (
            <div key={trail.trailid} className="item">
              <span className="title">{trail.tr_cname}</span>
              <div className="details">
                <p>所屬城市: {trail.city}</p>
                <p>所屬區域: {trail.district}</p>
                <p>步道難度: {trail.tr_dif_class}</p>
                <p>步道長度: {trail.tr_length}</p>
              </div>
              <button 
                className="see-more-button" 
                onClick={() => handleSeeMoreTrail(trail.trailid)} 
                style={{ marginLeft: '10px' }}
              >
                查看更多
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchList;
