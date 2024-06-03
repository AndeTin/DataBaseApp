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

// API endpoint to get all location information with coordinates
app.get('/api/locations', (req, res) => {
  const query = 'SELECT * FROM `location_info` WHERE latitude IS NOT NULL AND longitude IS NOT NULL';

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

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
