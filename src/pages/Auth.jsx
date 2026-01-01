import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import './Auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="auth-subtitle">
                    {isLogin ? 'Enter your credentials to access your account' : 'Join thousands of learners today'}
                </p>

                <form className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="John Doe" />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="you@example.com" />
                    </div>
                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label>Password</label>
                            {isLogin && (
                                <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#EF4444', fontWeight: 'bold', textDecoration: 'underline' }}>
                                    FORGOT PASSWORD?
                                </Link>
                            )}
                        </div>
                        <input type="password" placeholder="••••••••" />
                    </div>

                    <Button variant="primary" className="btn-block">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </Button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => setIsLogin(!isLogin)} className="auth-toggle">
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
