const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const port = 4001;

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
