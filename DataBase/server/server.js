const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 4001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root', // Your MySQL username
  password: '', // Your MySQL password
  database: 'Database HW' // Your database name
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Connection error:', err);
    return;
  }
  console.log('Connected successfully');
});

// API endpoint to check if an email already exists
app.post('/api/check-email', (req, res) => {
  const { email } = req.body;
  const query = 'SELECT COUNT(*) AS count FROM user WHERE User_email = ?';
  
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      res.status(500).send(err);
    } else {
      const { count } = results[0];
      res.json({ exists: count > 0 });
    }
  });
});

// API endpoint to register a new user
app.post('/api/register', (req, res) => {
  const { User_first_name, User_last_name, User_email, User_gender, User_birthday, User_passwd } = req.body;
  const query = 'INSERT INTO user (User_first_name, User_last_name, User_email, User_gender, User_birthday, User_passwd, User_permission) VALUES (?, ?, ?, ?, ?, ? , 0)';
  
  db.query(query, [User_first_name, User_last_name, User_email, User_gender, User_birthday, User_passwd], (err, results) => {
    if (err) {
      console.error('Error registering user:', err);
      res.status(500).send(err);
    } else {
      res.json({ success: true });
    }
  });
});

// API endpoint to search data
app.get('/api/data', (req, res) => {
  const searchTerm = req.query.search || '';
  const query = `
    SELECT * FROM location_info 
    WHERE location_name LIKE ? OR address LIKE ?
  `;

  db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
    if (err) {
      console.error('Error searching data:', err);
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
