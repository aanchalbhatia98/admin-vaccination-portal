/*import React, { useEffect, useState } from 'react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/students')
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch students");
        return res.json();
      })
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Students</h2>
      <ul>
        {students.map(student => (
          <li key={student.id}>
            <strong>{student.name}</strong> is in class <em>{student.class}</em> 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Students;
*/