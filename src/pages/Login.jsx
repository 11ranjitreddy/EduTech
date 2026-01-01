import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Log in to continue your learning journey</p>

                <form className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-input" placeholder="you@example.com" />
                    </div>

                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                            <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                            <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: '#EF4444', fontWeight: 'bold', textDecoration: 'underline' }}>FORGOT PASSWORD?</Link>
                        </div>
                        <input type="password" className="form-input" placeholder="••••••••" />
                    </div>

                    <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                        Log In
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
