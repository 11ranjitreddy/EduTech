import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const COURSE_URL = 'http://localhost:8082/api/v1/courses';
const AUTH_URL = 'http://localhost:8081/api/v1/auth';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalCourses: 0,
        liveCourses: 0,
        draftCourses: 0,
        totalStudents: 0
    });
    const [topCourses, setTopCourses] = useState([]);

    useEffect(() => {
        // ✅ Fetch course stats
        fetch(`${COURSE_URL}/stats`)
            .then(res => res.json())
            .then(data => setStats(prev => ({
                ...prev,
                totalCourses: data.totalCourses,
                liveCourses: data.liveCourses,
                draftCourses: data.draftCourses
            })))
            .catch(err => console.error(err));

        // ✅ Fetch REAL student count from auth service
        fetch(`${AUTH_URL}/admin/students`)
            .then(res => res.json())
            .then(data => setStats(prev => ({
                ...prev,
                totalStudents: data.length // ✅ real count
            })))
            .catch(err => console.error(err));

        // ✅ Fetch top courses
        fetch(`${COURSE_URL}/top`)
            .then(res => res.json())
            .then(data => setTopCourses(data))
            .catch(err => console.error(err));
    }, []);

    const statCards = [
        { label: 'Total Students', value: stats.totalStudents?.toLocaleString(), trend: '', color: '#4F46E5' },
        { label: 'Active Courses', value: stats.liveCourses, trend: '', color: '#10B981' },
        { label: 'Total Courses', value: stats.totalCourses, trend: '', color: '#F59E0B' },
        { label: 'Draft Courses', value: stats.draftCourses, trend: '', color: '#EC4899' },
    ];

    return (
        <div className="admin-dashboard">
            <div className="stats-grid">
                {statCards.map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-header">
                            <p className="stat-label">{stat.label}</p>
                        </div>
                        <h2 className="stat-value">{stat.value}</h2>
                        <div className="stat-progress-bg">
                            <div className="stat-progress-bar"
                                style={{ width: '70%', backgroundColor: stat.color }}>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="recent-activity card">
                    <h3>Recent Activity</h3>
                    <div className="activity-list">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="activity-item">
                                <div className="activity-dot"></div>
                                <div className="activity-content">
                                    <p><strong>New Student joined:</strong> enrolled in a course</p>
                                    <small>{i} hour{i > 1 ? 's' : ''} ago</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="top-courses card">
                    <h3>Top Performing Courses</h3>
                    <div className="course-performance-list">
                        {topCourses.map((c, i) => (
                            <div key={i} className="performance-item">
                                <p className="course-name">{c.title}</p>
                                <div className="performance-stats">
                                    <span>{c.students} students</span>
                                    <small className="growth">⭐ {c.rating}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;