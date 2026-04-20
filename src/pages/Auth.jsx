import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import './Auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = login(email, password);

        // If it requires 2FA, redirect to the new Login page which handles it
        if (result.requires2fa) {
            navigate('/login', { state: { email, requires2fa: true } });
            return;
        }

        // Redirect based on role
        if (result.role === 'admin') {
            navigate('/admin');
        } else {
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="auth-subtitle">
                    {isLogin ? 'Enter your credentials to access your account' : 'Join thousands of learners today'}
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="John Doe" required />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" variant="primary" className="btn-block">
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
                    <div className="mock-creds" style={{ marginTop: '1rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', fontSize: '0.8rem' }}>
                        <p><strong>Admin:</strong> admin@edtech.com</p>
                        <p><strong>Student:</strong> student@edtech.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
