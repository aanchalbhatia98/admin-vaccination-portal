import React, { useEffect, useState } from 'react';
import LoginPage from './components/LoginPage';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StudentManagement from './components/StudentManagement';
import API from './api';
import './App.css';

function Dashboard() {
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

  if (!summary) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1 className="title">Vaccination Dashboard</h1>
      <div className="metrics">
        <div className="card">
          <h2>Total Students</h2>
          <p>{summary.totalStudents}</p>
        </div>
        {summary.vaccines && summary.vaccines.length > 0 ? (
        summary.vaccines.map((vaccine, index) => (
          <div className="card" key={index}>
            <h2>{vaccine.vaccine}</h2>
            <p>{vaccine.vaccinatedStudents} vaccinated</p>
            <p>{vaccine.percentage}%</p>
          </div>
        ))
      ) : (
        <p>No vaccination data available</p>
      )}
 
      </div>

      <h2 className="subtitle">Upcoming Vaccination Drives</h2>
      {upcoming.length === 0 ? (
        <p>No drives scheduled in the next 30 days.</p>
      ) : (
        <ul>
          {upcoming.map(drive => (
            <li key={drive.id}>
              <strong>{drive.name}</strong> on {drive.drive_date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="navbar-brand">Vaccination Portal</h1>
      <div className="navbar-links">
        <Link to="/">Dashboard</Link>
        <Link to="/students">Manage Students</Link>
        <Link to="/drives">Manage Drives</Link>
        <Link to="/reports">Reports</Link>
      </div>
    </nav>
  );
}

function Students() {
  return <div className="container">Manage Students Page</div>;
}

function Drives() {
  return <div className="container">Manage Drives Page</div>;
}

function Reports() {
  return <div className="container">Reports Page</div>;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    
    <Router>
       {!loggedIn ? (
        <LoginPage onLogin={() => setLoggedIn(true)} />
      ) : (
        <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<StudentManagement />} /> {/* StudentManagement route */}
        <Route path="/drives" element={<Drives />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
      </>
      )}
    </Router>
  );
}
export default App;
