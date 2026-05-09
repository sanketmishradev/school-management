const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /addSchool
router.post('/addSchool', (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validation
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  
  db.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.status(201).json({ message: 'School added successfully!', id: result.insertId });
  });
});

// GET /listSchools
router.get('/listSchools', (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  db.query('SELECT * FROM schools', (err, schools) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Distance calculate karo
    const sorted = schools.map(school => {
      const dist = Math.sqrt(
        Math.pow(school.latitude - parseFloat(latitude), 2) +
        Math.pow(school.longitude - parseFloat(longitude), 2)
      );
      return { ...school, distance: dist };
    }).sort((a, b) => a.distance - b.distance);

    res.status(200).json(sorted);
  });
});

module.exports = router;