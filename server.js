const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const app = express();

// Database connection configuration
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Test database connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to the database');
});

// Question 1: Retrieve all patients
app.get('/api/patients', (req, res) => {
  const query = `
    SELECT patient_id, first_name, last_name, date_of_birth 
    FROM patients
  `;
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching patients:', err);
      res.status(500).json({ error: 'Error fetching patients' });
      return;
    }
    res.json(results);
  });
});

// Question 2: Retrieve all providers
app.get('/api/providers', (req, res) => {
  const query = `
    SELECT first_name, last_name, provider_specialty 
    FROM providers
  `;
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching providers:', err);
      res.status(500).json({ error: 'Error fetching providers' });
      return;
    }
    res.json(results);
  });
});

// Question 3: Filter patients by First Name
app.get('/api/patients/search', (req, res) => {
  const firstName = req.query.firstName;
  
  if (!firstName) {
    return res.status(400).json({ error: 'First name parameter is required' });
  }

  const query = `
    SELECT patient_id, first_name, last_name, date_of_birth 
    FROM patients 
    WHERE first_name LIKE ?
  `;
  
  connection.query(query, [`%${firstName}%`], (err, results) => {
    if (err) {
      console.error('Error searching patients:', err);
      res.status(500).json({ error: 'Error searching patients' });
      return;
    }
    res.json(results);
  });
});

// Question 4: Retrieve all providers by their specialty
app.get('/api/providers/specialty/:specialty', (req, res) => {
  const specialty = req.params.specialty;
  
  const query = `
    SELECT first_name, last_name, provider_specialty 
    FROM providers 
    WHERE provider_specialty = ?
  `;
  
  connection.query(query, [specialty], (err, results) => {
    if (err) {
      console.error('Error fetching providers by specialty:', err);
      res.status(500).json({ error: 'Error fetching providers by specialty' });
      return;
    }
    res.json(results);
  });
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});