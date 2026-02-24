import React, { useState } from 'react';
import './AdminStudents.css';

const initialStudents = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', joined: '2026-01-15', courses: 3, totalSpent: 1297, progress: 65 },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', joined: '2026-01-20', courses: 1, totalSpent: 499, progress: 10 },
    { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', joined: '2026-02-01', courses: 5, totalSpent: 2895, progress: 88 },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', joined: '2026-02-10', courses: 2, totalSpent: 998, progress: 45 },
    { id: 5, name: 'Ethan Hunt', email: 'ethan@example.com', joined: '2026-02-15', courses: 1, totalSpent: 699, progress: 0 },
];

const AdminStudents = () => {
    const [students] = useState(initialStudents);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-students">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Enrolled Students</h1>
                    <p className="admin-page-subtitle">Monitor student progress and platform engagement.</p>
                </div>
                <div className="admin-header-actions">
                    <button className="btn btn-outline">Export Data</button>
                </div>
            </div>

            <div className="admin-card table-container">
                <div className="table-header-filters">
                    <div className="admin-search-box">
                        <input
                            type="text"
                            placeholder="Find students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Email</th>
                            <th>Joined</th>
                            <th>Courses</th>
                            <th>Value</th>
                            <th>Avg. Progress</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map(student => (
                            <tr key={student.id}>
                                <td>
                                    <div className="student-profile-cell">
                                        <div className="student-avatar">{student.name.charAt(0)}</div>
                                        <span className="student-name">{student.name}</span>
                                    </div>
                                </td>
                                <td>{student.email}</td>
                                <td>{new Date(student.joined).toLocaleDateString()}</td>
                                <td>{student.courses}</td>
                                <td>${student.totalSpent}</td>
                                <td>
                                    <div className="progress-cell">
                                        <div className="progress-track">
                                            <div className="progress-fill" style={{ width: `${student.progress}%` }}></div>
                                        </div>
                                        <span className="progress-text">{student.progress}%</span>
                                    </div>
                                </td>
                                <td className="text-right">
                                    <button className="icon-btn-view" title="View Profile">👁️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredStudents.length === 0 && (
                    <div className="empty-state">No students found.</div>
                )}
            </div>
        </div>
    );
};

export default AdminStudents;
