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

// API endpoint to search location data
app.get('/api/location', (req, res) => {
  const searchTerm = req.query.search || '';
  const query = `
  SELECT 
    location_info.* 
  FROM 
    location_info 
  WHERE 
    location_info.location_name LIKE ? OR location_info.address LIKE ?
  `;

  db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
    if (err) {
      console.error('Error searching location data:', err);
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// API endpoint to search trail data
app.get('/api/trail', (req, res) => {
  const searchTerm = req.query.search || '';
  const query = `
    SELECT 
      trail.tr_cname, 
      trail.trailid,
      city.city, 
      district.district,
      trail.tr_length
    FROM 
      trail 
      LEFT JOIN city ON trail.city_id = city.city_id 
      LEFT JOIN district ON trail.district_id = district.district_id 
    WHERE 
      trail.tr_cname LIKE ? OR city.city LIKE ? OR district.district LIKE ?
  `;

  db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
    if (err) {
      console.error('Error searching trail data:', err);
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
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
  const query = 'INSERT INTO user (User_first_name, User_last_name, User_email, User_gender, User_birthday, User_passwd, User_permission) VALUES (?, ?, ?, ?, ?, ?, 0)';
  
  db.query(query, [User_first_name, User_last_name, User_email, User_gender, User_birthday, User_passwd], (err, results) => {
    if (err) {
      console.error('Error registering user:', err);
      res.status(500).send(err);
    } else {
      res.json({ success: true });
    }
  });
});

// API endpoint for user login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM user WHERE User_email = ? AND User_passwd = ?';
  
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error logging in:', err);
      res.status(500).send(err);
    } else {
      if (results.length > 0) {
        // Login successful
        res.json({ success: true, message: 'Login successful!', loggedIn: true });
      } else {
        // Login failed
        res.json({ success: false, message: 'Email or password is incorrect', loggedIn: false });
      }
    }
  });
});

// API endpoint to fetch location information by ID
app.get('/api/location/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM location_info WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching location info:', err);
      res.status(500).send(err);
    } else {
      if (results.length > 0) {
        // Location found
        res.json(results[0]);
      } else {
        // Location not found
        res.status(404).json({ message: 'Location not found' });
      }
    }
  });
});

// API endpoint to get trail details by trail ID
app.get('/api/trail/:trailid', (req, res) => {
  const trailId = req.params.trailid;
  const query = `
    SELECT 
      trail.tr_cname, 
      city.city, 
      district.district,
      trail.tr_length,
      trail.tr_alt,
      trail.tr_alt_low,
      trail.tr_permit_stop,
      trail.tr_pave,
      trail.tr_dif_class,
      trail.tr_tour,
      trail.tr_best_season
    FROM 
      trail 
      LEFT JOIN city ON trail.city_id = city.city_id 
      LEFT JOIN district ON trail.district_id = district.district_id
    WHERE 
      trail.trailid = ?
  `;

  db.query(query, [trailId], (err, results) => {
    if (err) {
      console.error('Error fetching trail details:', err);
      res.status(500).send(err);
    } else {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ message: 'Trail not found' });
      }
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
