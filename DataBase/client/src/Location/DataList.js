import React from 'react';
import LocationComponent from './LocationComponent';

function DataList({ data }) {
  return (
    <div>
      {data.length === 0 ? (
        <p>No data available</p>
      ) : (
        data.map((item, index) => (
          <LocationComponent key={index} location={item} />
        ))
      )}
    </div>
  );
}

export default DataList;
