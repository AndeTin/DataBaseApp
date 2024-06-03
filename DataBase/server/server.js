const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 4001;
const GOOGLE_MAPS_API_KEY = 'AIzaSyC3IGPH_lg81YqEOY6tik4DV5vMAaCv-zE'; // Replace with your actual API key

app.use(cors());
app.use(express.json());

// 创建MySQL连接
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root', // 你的MySQL用户名
  password: '', // 你的MySQL密码
  database: 'Database HW' // 你的数据库名称
});

// 连接到MySQL
db.connect(err => {
  if (err) {
    console.error('连接错误:', err);
    return;
  }
  console.log('连接成功');
});

// Geocoding function using Google Maps API
async function geocodeAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
  try {
    const response = await axios.get(url);
    const data = response.data;
    if (data.status === 'OK' && data.results.length > 0) {
      return { latitude: data.results[0].geometry.location.lat, longitude: data.results[0].geometry.location.lng };
    } else {
      throw new Error(`Geocoding failed: ${data.status}`);
    }
  } catch (error) {
    console.error(`Error geocoding address "${address}": ${error.message}`);
    throw error;
  }
}

// Sleep function to respect rate limits
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 新增的API端点，用于获取所有位置的信息并进行地理编码
app.get('/api/locations', async (req, res) => {
  const query = 'SELECT * FROM `location_info`';

  console.log(`Executing query: ${query}`); // Log the query for debugging

  db.query(query, async (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send(err);
    } else {
      try {
        // Geocode addresses with a delay between requests
        const geocodedResults = [];
        for (const location of results) {
          try {
            const coords = await geocodeAddress(location.address);
            geocodedResults.push({ ...location, latitude: coords.latitude, longitude: coords.longitude });
          } catch (geocodingError) {
            console.error(`Skipping address "${location.address}" due to geocoding error.`);
          }
          await sleep(1000); // 1 second delay between requests to respect rate limits
        }
        res.json(geocodedResults);
      } catch (geocodingError) {
        console.error('Error during geocoding:', geocodingError);
        res.status(500).send('Error during geocoding');
      }
    }
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器正在运行在 http://localhost:${port}`);
});
