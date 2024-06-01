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
  const query = 'SELECT * FROM `location_info`'; // 你的查询语句
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器正在运行在 http://localhost:${port}`);
});
