// DataList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LocationComponent from './LocationComponent';

function DataList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4001/api/data')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div>
      {data.map((item, index) => (
        <LocationComponent key={index} location={item} />
      ))}
    </div>
  );
}

export default DataList;
