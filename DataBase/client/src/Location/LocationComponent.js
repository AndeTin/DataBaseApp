// LocationComponent.js
import React from 'react';

function LocationComponent({ location }) {
  return (
    <div>
      <h2>{location.location_name}</h2>
      <p>Address: {location.address}</p>
      <p>Opening Time: {location.opening_time}</p>
      <p>Closing Time: {location.closing_time}</p>
      {/* 可以根據需要顯示更多資訊 */}
    </div>
  );
}

export default LocationComponent;
