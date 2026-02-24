import React from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const stats = [
        { label: 'Total Students', value: '12,450', trend: '+12%', color: '#4F46E5' },
        { label: 'Active Courses', value: '48', trend: '+5', color: '#10B981' },
        { label: 'Monthly Revenue', value: '$45,280', trend: '+18.4%', color: '#F59E0B' },
        { label: 'Avg. Rating', value: '4.8', trend: '+0.1', color: '#EC4899' },
    ];

    return (
        <div className="admin-dashboard">
            <div className="stats-grid">
                {stats.map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-header">
                            <p className="stat-label">{stat.label}</p>
                            <span className="stat-trend" style={{ color: stat.trend.startsWith('+') ? '#10B981' : '#EF4444' }}>
                                {stat.trend}
                            </span>
                        </div>
                        <h2 className="stat-value">{stat.value}</h2>
                        <div className="stat-progress-bg">
                            <div className="stat-progress-bar" style={{ width: '70%', backgroundColor: stat.color }}></div>
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
                                    <p><strong>New Student joined:</strong> Sarah Jenkins enrolled in <em>Advanced React Patterns</em></p>
                                    <small>2 hours ago</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="top-courses card">
                    <h3>Top Performing Courses</h3>
                    <div className="course-performance-list">
                        {[
                            { name: 'Complete Python Bootcamp', sales: 450, growth: '+25%' },
                            { name: 'UI/UX Design Masterclass', sales: 380, growth: '+15%' },
                            { name: 'Machine Learning A-Z', sales: 310, growth: '+30%' },
                        ].map((c, i) => (
                            <div key={i} className="performance-item">
                                <p className="course-name">{c.name}</p>
                                <div className="performance-stats">
                                    <span>{c.sales} sales</span>
                                    <small className="growth">{c.growth}</small>
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
