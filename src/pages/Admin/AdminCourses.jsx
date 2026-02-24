import React, { useState } from 'react';
import Button from '../../components/Button';
import './AdminCourses.css';

const initialCourses = [
    { id: 1, title: 'Complete Python Bootcamp', instructor: 'Dr. Angela Yu', price: 499, students: 1250, status: 'Live', category: 'Python' },
    { id: 2, title: 'Java Masterclass 2026', instructor: 'Tim Buchalka', price: 599, students: 850, status: 'Live', category: 'Java' },
    { id: 3, title: 'React JS - The Complete Guide', instructor: 'Maximilian', price: 699, students: 3200, status: 'Live', category: 'Web Dev' },
    { id: 4, title: 'Flutter & Dart - Masterclass', instructor: 'Academind', price: 449, students: 600, status: 'Draft', category: 'App Dev' },
    { id: 5, title: 'Machine Learning A-Z', instructor: 'Kirill Eremenko', price: 999, students: 1500, status: 'Live', category: 'AI / ML' },
];

const AdminCourses = () => {
    const [courses, setCourses] = useState(initialCourses);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleStatus = (id) => {
        setCourses(courses.map(course =>
            course.id === id ? { ...course, status: course.status === 'Live' ? 'Draft' : 'Live' } : course
        ));
    };

    const deleteCourse = (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            setCourses(courses.filter(c => c.id !== id));
        }
    };

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-courses">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Manage Courses</h1>
                    <p className="admin-page-subtitle">Add, edit, or remove courses from the platform library.</p>
                </div>
                <Button variant="primary">+ Add New Course</Button>
            </div>

            <div className="admin-card table-container">
                <div className="table-header-filters">
                    <div className="admin-search-box">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Instructor</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Students</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCourses.map(course => (
                            <tr key={course.id}>
                                <td>
                                    <div className="course-title-cell">
                                        <div className="course-avatar-mini">{course.title.charAt(0)}</div>
                                        <span>{course.title}</span>
                                    </div>
                                </td>
                                <td>{course.instructor}</td>
                                <td><span className="badge category">{course.category}</span></td>
                                <td>${course.price}</td>
                                <td>{course.students.toLocaleString()}</td>
                                <td>
                                    <span className={`status-pill ${course.status.toLowerCase()}`}>
                                        {course.status}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <div className="action-btns">
                                        <button className="icon-btn-edit" title="Edit">✏️</button>
                                        <button
                                            className="icon-btn-status"
                                            title={course.status === 'Live' ? 'Unpublish' : 'Publish'}
                                            onClick={() => toggleStatus(course.id)}
                                        >
                                            {course.status === 'Live' ? '⏸️' : '▶️'}
                                        </button>
                                        <button
                                            className="icon-btn-delete"
                                            title="Delete"
                                            onClick={() => deleteCourse(course.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredCourses.length === 0 && (
                    <div className="empty-state">No courses found matching your search.</div>
                )}
            </div>
        </div>
    );
};

export default AdminCourses;
