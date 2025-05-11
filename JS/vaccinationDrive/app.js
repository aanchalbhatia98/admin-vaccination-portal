// app.js
const express = require('express');
const app = express();
const PORT = 5000;
const cors = require('cors');
app.use(cors());

//const studentRoutes = require('./routes/students');
//const driveRoutes = require('./routes/drives');
const studentRoutes = require('./routes/students');
const metricsRoutes = require('./routes/metrics');
const driveRoutes = require('./routes/drives');

app.use(express.json());

//app.use('/students', studentRoutes);
//app.use('/drives', driveRoutes);

app.use('/api/metrics', metricsRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/students', studentRoutes);


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
