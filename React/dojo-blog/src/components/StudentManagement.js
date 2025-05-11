import React, { useState, useEffect } from 'react';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState({ name: '', class: '', id: '', vaccination_status: '' });
  const [studentForm, setStudentForm] = useState({ id: '', name: '', class: '' });
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const fetchStudents = async () => {
    const query = new URLSearchParams(search).toString();
    try {
      const response = await fetch(`http://localhost:5000/api/students?${query}`);
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError('Failed to fetch students');
    }
  };

  const handleFormChange = (e) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/students', {
      method: studentForm.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentForm),
    });
    const data = await response.json();
    if (data.error) {
      setError(data.error);
      setSuccessMessage('');
    } else {
      setError('');
      setSuccessMessage('Student saved successfully!');
      fetchStudents();
      setStudentForm({ id: '', name: '', class: '' });
    }
  };

  const handleBulkUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://localhost:5000/students/bulk-upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setSuccessMessage('');
      } else {
        setError('');
        setSuccessMessage('Students uploaded successfully!');
        fetchStudents();
      }
    } catch (err) {
      setError('Failed to upload file');
    }
  };

  const handleVaccinate = async (studentId) => {
    const response = await fetch('http://localhost:5000/students/vaccinate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, driveId: 1 }), // Hardcoding driveId for now
    });
    const data = await response.json();
    if (data.error) {
      setError(data.error);
      setSuccessMessage('');
    } else {
      setError('');
      setSuccessMessage('Student vaccinated successfully!');
      fetchStudents();
    }
  };

  return (
    <div>
      <h2>Student Management</h2>

      {/* Search section */}
      <div>
        <input
          type="text"
          placeholder="Search by Name"
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by Class"
          value={search.class}
          onChange={(e) => setSearch({ ...search, class: e.target.value })}
        />
        <button onClick={fetchStudents}>Search</button>
      </div>

      {/* Add/Edit student form */}
      <h3>{studentForm.id ? 'Edit' : 'Add'} Student</h3>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={studentForm.name}
          onChange={handleFormChange}
        />
        <input
          type="text"
          name="class"
          placeholder="Class"
          value={studentForm.class}
          onChange={handleFormChange}
        />
        <button type="submit">{studentForm.id ? 'Update' : 'Add'} Student</button>
      </form>

      {/* Bulk upload CSV */}
      <h3>Bulk Upload Students (CSV)</h3>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleBulkUpload}>Upload CSV</button>

      {/* Error and Success Messages */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      {/* Student List */}
      <h3>Student List</h3>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.name} - {student.class}
            <button onClick={() => handleVaccinate(student.id)}>Mark as Vaccinated</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentManagement;
