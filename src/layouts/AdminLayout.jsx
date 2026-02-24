import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    EdTech<span className="dot">.</span> <small>Admin</small>
                </div>

                <nav className="admin-nav">
                    <Link to="/admin" className="admin-nav-link">
                        <span className="icon">📊</span> Dashboard
                    </Link>
                    <Link to="/admin/courses" className="admin-nav-link">
                        <span className="icon">📚</span> Courses
                    </Link>
                    <Link to="/admin/students" className="admin-nav-link">
                        <span className="icon">👨‍🎓</span> Students
                    </Link>
                    <Link to="/admin/revenue" className="admin-nav-link">
                        <span className="icon">💰</span> Revenue
                    </Link>
                </nav>

                <div className="admin-user-profile">
                    <div className="profile-info">
                        <p className="profile-name">{user?.name}</p>
                        <p className="profile-role">Administrator</p>
                    </div>
                    <button onClick={handleLogout} className="logout-btn-minimal">
                        Logout
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <h2>Administration Panel</h2>
                    <div className="admin-header-actions">
                        <button className="icon-btn">🔔</button>
                        <button className="icon-btn">⚙️</button>
                    </div>
                </header>
                <div className="admin-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
