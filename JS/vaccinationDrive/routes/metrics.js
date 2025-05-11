const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/summary', async (req, res) => {
  try {
    const [[{ total_students }]] = await db.query(`
      SELECT COUNT(*) AS total_students FROM student
    `);

    const [rows] = await db.query(`
      SELECT 
        vd.name AS vaccine,
        COUNT(DISTINCT vs.student_id) AS vaccinated_students
      FROM vaccination_status vs
      JOIN vaccination_drive vd ON vs.drive_id = vd.id
      WHERE vs.status = 'Completed'
      GROUP BY vd.name
    `);

    const summary = rows.map(row => ({
      vaccine: row.vaccine,
      vaccinatedStudents: row.vaccinated_students,
      percentage: total_students
        ? ((row.vaccinated_students / total_students) * 100).toFixed(2)
        : 0,
    }));

    res.json({ totalStudents: total_students, vaccines: summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;