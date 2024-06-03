const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const port = 4001;
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your actual API key

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

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

// 定义一个API端点
app.get('/api/data', (req, res) => {
  const searchQuery = req.query.search || ''; // 获取搜索查询参数
  let query = 'SELECT * FROM `location_info`'; // 你的查询语句

  if (searchQuery) {
    query += ` WHERE location_name LIKE '%${searchQuery}%' OR address LIKE '%${searchQuery}%'`; // 搜索name和address列
  }

  console.log(`Executing query: ${query}`); // Log the query for debugging

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// 新增的API端点，用于根据ID获取特定位置的信息
app.get('/api/location/:id', (req, res) => {
  const locationId = req.params.id;
  const query = 'SELECT * FROM `location_info` WHERE id = ?';

  console.log(`Executing query: ${query} with ID: ${locationId}`); // Log the query for debugging

  db.query(query, [locationId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send(err);
    } else if (results.length === 0) {
      res.status(404).send('Location not found');
    } else {
      res.json(results[0]); // Assuming IDs are unique and returning the first match
    }
  });
});

// 用户注册API端点
app.post('/signup', (req, res) => {
  const { firstName, lastName, email, gender, password, birthday } = req.body;

  // 检查用户是否已经存在
  db.query('SELECT * FROM users WHERE User_email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).send('Server error');
    }
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // 哈希密码
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).send('Server error');
      }

      // 插入新用户
      const query = 'INSERT INTO users (User_first_name, User_last_name, User_gender, User_email, User_birthday, User_passwd, User_permission) VALUES (?, ?, ?, ?, ?, ?, 0)';
      db.query(query, [firstName, lastName, gender, email, birthday, hashedPassword], (err, results) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).send('Server error');
        }
        res.json({ success: true });
      });
    });
  });
});

// 用户登录API端点
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // 检查用户是否存在
  db.query('SELECT * FROM users WHERE User_email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).send('Server error');
    }
    if (results.length === 0) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const user = results[0];

    // 验证密码
    bcrypt.compare(password, user.User_passwd, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).send('Server error');
      }
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid password' });
      }

      res.json({ success: true });
    });
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
