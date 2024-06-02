import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css'; // Import the CSS file

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

  return (
    <div className="LocationInfo">
      <div className="button-container">
        <button onClick={() => navigate(-1)}>回到列表</button>
        <button onClick={() => navigate('/')}>首頁</button>
      </div>
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
  );
}

export default LocationInfo;
