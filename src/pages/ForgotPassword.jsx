import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import './Auth.css'; // Reusing Auth CSS

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock API call simulation
        setTimeout(() => {
            setIsSubmitted(true);
        }, 1000);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Reset Password</h2>
                    <p>Enter your email to receive a reset link</p>
                </div>

                {!isSubmitted ? (
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <Button variant="primary" type="submit" className="btn-block">
                            Send Reset Link
                        </Button>

                        <div className="auth-footer">
                            <Link to="/login" className="auth-link">Back to Login</Link>
                        </div>
                    </form>
                ) : (
                    <div className="success-message" style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📩</div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Check your email</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            We have sent a password reset link to <strong>{email}</strong>
                        </p>
                        <Button variant="outline" className="btn-block" onClick={() => setIsSubmitted(false)}>
                            Resend Link
                        </Button>
                        <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
                            <Link to="/login" className="auth-link">Back to Login</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
