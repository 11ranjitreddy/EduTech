import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Credentials, 2: 2FA OTP
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [tempRole, setTempRole] = useState(null);
    const [isSetupStep, setIsSetupStep] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login, verify2fa, confirm2faSetup } = useAuth();

    useEffect(() => {
        if (location.state?.requires2fa) {
            setStep(2);
            if (location.state.email) setEmail(location.state.email);
            setTempRole('admin');
            setIsSetupStep(location.state.isSetupRequired || false);
        }
    }, [location.state]);

    const from = location.state?.from || '/courses';

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const result = login(email, password);
            if (result.requires2fa) {
                setTempRole(result.role);
                setIsSetupStep(result.isSetupRequired);
                setStep(2);
            } else if (result.role === 'admin') {
                navigate('/admin');
            } else {
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    const handleSetupNext = () => {
        setIsSetupStep(false);
    };

    const handle2FASubmit = (e) => {
        e.preventDefault();
        setError('');

        if (otp.length !== 6) {
            setError('Please enter a 6-digit OTP');
            return;
        }

        const success = verify2fa(email, tempRole, otp);
        if (success) {
            if (tempRole === 'admin') {
                navigate('/admin');
            } else {
                navigate(from, { replace: true });
            }
        } else {
            setError('Invalid OTP code. Please try again.');
        }
    };

    const handleGoogleLogin = () => {
        alert('Google OAuth integration would happen here');
        // In production: window.location.href = '/auth/google'
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">EdTech.</div>

                <h1 className="auth-title">
                    {step === 1 ? 'Welcome Back' : isSetupStep ? 'Security Setup' : 'Two-Step Verification'}
                </h1>
                <p className="auth-subtitle">
                    {step === 1 ? 'Login to continue learning' : isSetupStep ? 'Scan this code with Microsoft Authenticator' : 'Enter the code from your Authenticator app'}
                </p>

                {error && <div className="error-message">{error}</div>}

                {step === 1 ? (
                    <form className="auth-form" onSubmit={handleSubmit}>
                        {/* ... existing credentials form ... */}
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <label htmlFor="password">Password</label>
                                <Link to="/forgot-password" className="forgot-password-link">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <Button variant="primary" type="submit" className="btn-block" style={{ marginTop: '1.5rem' }}>
                            Login
                        </Button>
                    </form>
                ) : isSetupStep ? (
                    <div className="auth-form 2fa-setup-step">
                        <div className="qr-container" style={{ textAlign: 'center', padding: '1.5rem', background: '#F8FAFC', borderRadius: '12px', border: '2px dashed #E2E8F0', marginBottom: '1.5rem' }}>
                            <div className="qr-placeholder" style={{ width: '180px', height: '180px', margin: '0 auto 1.5rem', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                {/* Using a placeholder QR image since generation failed */}
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/EdTech:admin@edtech.com?secret=JBSWY3DPEHPK3PXP&issuer=EdTech" alt="MFA QR Code" />
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500' }}>
                                admin@edtech.com
                            </p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                Scan this code to add your account to the <strong>Microsoft Authenticator</strong> app.
                            </p>
                        </div>
                        <Button variant="primary" className="btn-block" onClick={handleSetupNext}>
                            I've Scanned It
                        </Button>
                    </div>
                ) : (
                    <form className="auth-form" onSubmit={handle2FASubmit}>
                        <div className="form-group">
                            <label htmlFor="otp">Authentication Code</label>
                            <input
                                type="text"
                                id="otp"
                                placeholder="000000"
                                maxLength="6"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                                autoFocus
                            />
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center' }}>
                                Open your <strong>Microsoft Authenticator</strong> app to see the code.
                                <br />Mock Code: 123456
                            </p>
                        </div>

                        <Button variant="primary" type="submit" className="btn-block" style={{ marginTop: '1.5rem' }}>
                            Verify & Login
                        </Button>
                        <button
                            type="button"
                            className="auth-link"
                            onClick={() => setStep(1)}
                            style={{ width: '100%', marginTop: '1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            ← Back to login
                        </button>
                    </form>
                )}

                <div className="auth-divider">or</div>

                <button className="google-btn" onClick={handleGoogleLogin}>
                    <svg className="google-icon" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                <div className="auth-footer">
                    New here? <Link to="/register" className="auth-link">Create an account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
