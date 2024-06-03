import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

// Set default icon for leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

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

  useEffect(() => {
    fetch('http://localhost:4001/api/locations')
      .then(response => response.json())
      .then(data => setLocations(data))
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

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
      <div className="map-container">
        <MapContainer center={[23.6978, 120.9605]} zoom={7} style={{ height: "600px", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map(location => (
            <Marker key={location.id} position={[location.latitude, location.longitude]}>
              <Popup>
                <b>{location.location_name}</b><br />{location.address}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default Home;
