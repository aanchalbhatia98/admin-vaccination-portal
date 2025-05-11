const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/upcoming', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM vaccination_drive
      WHERE drive_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      ORDER BY drive_date
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
