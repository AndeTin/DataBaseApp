const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 4001;

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

// 启动服务器
app.listen(port, () => {
  console.log(`服务器正在运行在 http://localhost:${port}`);
});
