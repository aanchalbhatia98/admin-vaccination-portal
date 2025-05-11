import React, { useEffect, useState } from 'react';
import API from '../api';

function DrivesDashboard() {
  const [summary, setSummary] = useState(null);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res1 = await API.get('/metrics/summary');
      const res2 = await API.get('/drives/upcoming');
      setSummary(res1.data);
      setUpcoming(res2.data);
    }
    fetchData();
  }, []);

  if (!summary) return <div>Loading...</div>;

  return (
    <div>
      <h1>Vaccination Dashboard</h1>
      <div>
        <p>Total Students: {summary.totalStudents}</p>
        <p>Vaccinated Students: {summary.vaccinatedStudents}</p>
        <p>Percentage Vaccinated: {summary.percentage}%</p>
      </div>
      <hr />
      <h2>Upcoming Drives</h2>
      {upcoming.length === 0 ? (
        <p>No drives scheduled in the next 30 days.</p>
      ) : (
        <ul>
          {upcoming.map(drive => (
            <li key={drive.id}>{drive.name} - {drive.drive_date}</li>
          ))}
        </ul>
      )}
      <hr />
      <div>
        <a href="/students">Manage Students</a> | 
        <a href="/drives">Manage Drives</a> | 
        <a href="/reports">Reports</a>
      </div>
    </div>
  );
}

/*const DrivesDashboard = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/drives')
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch drives");
        return res.json();
      })
      .then(data => {
        setDrives(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading drives...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Upcoming Vaccination Drives</h2>
      <ul>
        {drives.map(drive => (
          <li key={drive.id}>
            <strong>{drive.name}</strong> on <em>{drive.drive_date}</em> for classes: {drive.classes_applicable}
          </li>
        ))}
      </ul>
    </div>
  );
}; */

export default DrivesDashboard;
