import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock API call simulation
        setTimeout(() => {
            setIsSubmitted(true);
        }, 500);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">EdTech.</div>

                {!isSubmitted ? (
                    <>
                        <h1 className="auth-title">Reset Your Password</h1>
                        <p className="auth-subtitle">Enter your email to receive a reset link</p>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <Button variant="primary" type="submit" className="btn-block" style={{ marginTop: '1rem' }}>
                                Send Reset Link
                            </Button>
                        </form>

                        <div className="auth-footer">
                            <Link to="/login" className="auth-link">Back to Login</Link>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>📩</div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>Check your email</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                            We have sent a password reset link to<br />
                            <strong style={{ color: 'var(--text-main)' }}>{email}</strong>
                        </p>
                        <Button variant="outline" className="btn-block" onClick={() => setIsSubmitted(false)} style={{ marginBottom: '1rem' }}>
                            Resend Link
                        </Button>
                        <div className="auth-footer">
                            <Link to="/login" className="auth-link">Back to Login</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
