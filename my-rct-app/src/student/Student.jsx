import React from 'react'
import './student.css'

export default function Student() {
  const students = [
    { name: 'Manikanta', marks: 50 },
    { name: 'Bhagath', marks: 45 },
    { name: 'Vijay', marks: 62 },
  ];

  const getMarkClass = (marks) => {
    if (marks < 50) return 'red';
    if (marks <= 60) return 'grey';
    return 'green';
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.name}</td>
              <td className={getMarkClass(student.marks)}>{student.marks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
