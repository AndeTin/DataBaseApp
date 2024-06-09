import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css'; // Import the CSS file

// Fix the default icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
  iconUrl: require('leaflet/dist/images/marker-icon.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});

function LocationInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:4001/api/location/${id}`)
      .then(response => {
        setLocation(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [id]);

  if (!location) {
    return <div>Loading...</div>;
  }

  // Assuming coordinates are in the format "POINT(lat lon)"
  const extractCoordinates = (geometry) => {
    if (typeof geometry !== 'string') {
      console.error('Invalid geometry format:', geometry);
      return [0, 0];
    }
    const matches = geometry.match(/POINT\(([^ ]+) ([^ ]+)\)/);
    return matches ? [parseFloat(matches[2]), parseFloat(matches[1])] : [0, 0];
  };

  console.log('Location coordinates:', location.coordinates);
  const coordinates = extractCoordinates(location.coordinates);
  const hasValidCoordinates = coordinates && coordinates.length === 2 && coordinates[0] !== 0 && coordinates[1] !== 0;

  return (
    <div className="LocationInfo">
      <div className="button-container">
        <button onClick={() => navigate(-1)}>回到列表</button>
        <button onClick={() => navigate('/')}>首頁</button>
      </div>
      <div className="info-container">
        <h1>{location.location_name}</h1>
        <p><strong>Opening Time:</strong> {location.opening_time}</p>
        <p><strong>Closing Time:</strong> {location.closing_time}</p>
        <p><strong>Address:</strong> {location.address}</p>
        <p><strong>Altitude Min:</strong> {location.altitude_min}</p>
        <p><strong>Altitude Max:</strong> {location.altitude_max}</p>
        <p><strong>Description:</strong></p>
        <p className="description-content">{location.description}</p>
        <p><strong>Managing Department:</strong> {location.managing_department}</p>
        <p><strong>Small Vehicle Allowed:</strong> {location.small_vehicle_allowed ? 'Yes' : 'No'}</p>
        <p><strong>Large Vehicle Allowed:</strong> {location.large_vehicle_allowed ? 'Yes' : 'No'}</p>
      </div>
      {hasValidCoordinates && (
        <div className="map-container">
          <MapContainer center={coordinates} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={coordinates}>
              <Popup>{location.location_name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default LocationInfo;
