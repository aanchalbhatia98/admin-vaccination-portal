// routes/students.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');



// 1. Get all students (with filters)
router.get('/', async (req, res) => {
  try {
    const { name, class: studentClass, id, vaccination_status } = req.query;
    let query = 'SELECT * FROM student WHERE 1=1';
    let params = [];

    if (name) {
      query += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }
    if (studentClass) {
      query += ' AND `class` = ?';
      params.push(studentClass);
    }
    if (id) {
      query += ' AND id = ?';
      params.push(id);
    }
    if (vaccination_status) {
      query += ' AND id IN (SELECT student_id FROM vaccination_status WHERE status = ?)';
      params.push(vaccination_status);
    }

    const [rows] = await db.query(query, params);  // Using await
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Add new student

router.post('/', async (req, res) => {
  const { name, class: studentClass } = req.body;
  try {
    const result = await db.query('INSERT INTO student (name, class) VALUES (?, ?)', [name, studentClass]);
    res.status(201).json({ id: result[0].insertId, name, class: studentClass });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST route to add a new student
router.post('/', (req, res) => {
  const { name, class: studentClass } = req.body; // Don't expect the id in the body

  // Ensure the required fields are provided
  if (!name || !studentClass) {
    return res.status(400).json({ error: 'Name and class are required' });
  }

  // Insert the new student into the database
  const query = 'INSERT INTO student (name, class) VALUES (?, ?)';
  db.query(query, [name, studentClass], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId, name, class: studentClass }); // Respond with the new student's id and data
  });
});

// 3. Update student details
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, class: studentClass } = req.body;
  try {
    const result = await db.query('UPDATE student SET name = ?, class = ? WHERE id = ?', [name, studentClass, id]);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ id, name, class: studentClass });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Delete student
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM student WHERE id = ?', [id]);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(204).send();  // No content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/test', (req, res) => {
  db.query('SELECT * FROM student LIMIT 5', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get('/', (req, res) => {
  console.log('GET /api/students hit'); //temp step 1
  const { name, class: studentClass, id, vaccination_status } = req.query;

  let query = 'SELECT * FROM student WHERE 1=1';
  let params = [];

  if (name) {
    query += ' AND name LIKE ?';
    params.push(`%${name}%`);
  }
  if (studentClass) {
    query += ' AND `class` = ?';
    params.push(studentClass);
  }
  if (id) {
    query += ' AND id = ?';
    params.push(id);
  }
  if (vaccination_status) {
    query += ' AND id IN (SELECT student_id FROM vaccination_status WHERE status = ?)';
    params.push(vaccination_status);
  }
  console.log('Running query:', query, params); //temp step 2

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('DB Error:', err); // Step 3
      return res.status(500).json({ error: err.message });
    }
    console.log('Results:', results); //
    res.json(results);
  });
});

module.exports = router;


// 2. Add or Update student
router.post('/', (req, res) => {
  const { id, name, class: studentClass } = req.body;
  if (!name || !studentClass) return res.status(400).json({ error: 'Missing required fields' });

  const query = id
    ? 'UPDATE student SET name = ?, class = ? WHERE id = ?'
    : 'INSERT INTO student (name, class) VALUES (?, ?)';

  const params = id ? [name, studentClass, id] : [name, studentClass];

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: id ? 'Student updated' : 'Student added', id: id || results.insertId });
  });
});

// 3. Delete student
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM student WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Student deleted' });
  });
});

// 4. Bulk upload students via CSV
router.post('/bulk-upload', upload.single('file'), (req, res) => {
  const students = [];
  const { path } = req.file;

  fs.createReadStream(path)
    .pipe(csv())
    .on('data', (data) => {
      students.push([data.name, data.class]);
    })
    .on('end', () => {
      const query = 'INSERT INTO student (name, class) VALUES ?';
      db.query(query, [students], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Bulk upload completed' });
      });
    });
});

// 5. Mark student as vaccinated
router.post('/vaccinate', (req, res) => {
  const { studentId, driveId } = req.body;
  if (!studentId || !driveId) return res.status(400).json({ error: 'Missing required fields' });

  // Check if already vaccinated for the same drive
  db.query('SELECT * FROM vaccination_status WHERE student_id = ? AND drive_id = ?', [studentId, driveId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      return res.status(400).json({ error: 'Student already vaccinated for this drive' });
    }

    // Mark as vaccinated
    db.query('INSERT INTO vaccination_status (student_id, drive_id, status) VALUES (?, ?, ?)', [studentId, driveId, 'Vaccinated'], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Student marked as vaccinated' });
    });
  });
});


