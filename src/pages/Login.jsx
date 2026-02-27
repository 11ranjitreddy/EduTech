import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [qrCodeImage, setQrCodeImage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { login, setupMfa, verify2fa } = useAuth();

    const from = location.state?.from || '/courses';

    // =========================
    // STEP 1 - LOGIN
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            const result = await login(email, password);

            if (result.requires2fa) {
                if (result.isSetupRequired) {
                    const mfaData = await setupMfa(email);
                    setQrCodeImage(mfaData.qrCodeImage);
                    setStep(2);
                } else {
                    setStep(3);
                }
            } else if (result.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // STEP 3 - VERIFY 2FA
    // =========================
    const handle2FASubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (otp.length !== 6) {
            setError('Please enter a 6-digit OTP');
            setLoading(false);
            return;
        }

        try {
            const userData = await verify2fa(email, otp);

            console.log('userData after MFA:', userData);
            console.log('role is:', userData.role);

            if (userData.role === 'ADMIN') {
                console.log('Navigating to /admin');
                navigate('/admin');
            } else {
                console.log('Navigating to /courses');
                navigate('/courses');
            }
        } catch (err) {
            setError(err.message || 'Invalid OTP code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">EdTech.</div>

                <h1 className="auth-title">
                    {step === 1
                        ? 'Welcome Back'
                        : step === 2
                        ? 'Security Setup'
                        : 'Two-Step Verification'}
                </h1>

                <p className="auth-subtitle">
                    {step === 1
                        ? 'Login to continue learning'
                        : step === 2
                        ? 'Scan this code with Microsoft Authenticator'
                        : 'Enter the code from your Authenticator app'}
                </p>

                {error && <div className="error-message">{error}</div>}

                {/* ================= STEP 1 ================= */}
                {step === 1 && (
                    <form className="auth-form" onSubmit={handleSubmit}>
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
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem'
                            }}>
                                <label htmlFor="password">Password</label>
                                <Link
                                    to="/forgot-password"
                                    className="forgot-password-link"
                                >
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
                                    {showPassword
                                        ? <EyeOff size={20} />
                                        : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            type="submit"
                            className="btn-block"
                            style={{ marginTop: '1.5rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                )}

                {/* ================= STEP 2 ================= */}
                {step === 2 && (
                    <div className="auth-form">
                        <div style={{
                            textAlign: 'center',
                            padding: '1.5rem',
                            background: '#F8FAFC',
                            borderRadius: '12px',
                            border: '2px dashed #E2E8F0',
                            marginBottom: '1.5rem'
                        }}>
                            {qrCodeImage ? (
                                <img
                                    src={qrCodeImage}
                                    alt="MFA QR Code"
                                    style={{ width: '180px', height: '180px' }}
                                />
                            ) : (
                                <p>Loading QR Code...</p>
                            )}

                            <p style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-secondary)',
                                marginTop: '0.5rem'
                            }}>
                                Scan with <strong>Microsoft Authenticator</strong>
                            </p>
                        </div>

                        <Button
                            variant="primary"
                            className="btn-block"
                            onClick={() => setStep(3)}
                        >
                            I've Scanned It
                        </Button>
                    </div>
                )}

                {/* ================= STEP 3 ================= */}
                {step === 3 && (
                    <form className="auth-form" onSubmit={handle2FASubmit}>
                        <div className="form-group">
                            <label htmlFor="otp">Authentication Code</label>
                            <input
                                type="text"
                                id="otp"
                                placeholder="000000"
                                maxLength="6"
                                value={otp}
                                onChange={(e) =>
                                    setOtp(e.target.value.replace(/\D/g, ''))
                                }
                                style={{
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    letterSpacing: '0.5rem'
                                }}
                                autoFocus
                            />

                            <p style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-secondary)',
                                marginTop: '0.5rem',
                                textAlign: 'center'
                            }}>
                                Open <strong>Microsoft Authenticator</strong> to get the code
                            </p>
                        </div>

                        <Button
                            variant="primary"
                            type="submit"
                            className="btn-block"
                            style={{ marginTop: '1.5rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </Button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            style={{
                                width: '100%',
                                marginTop: '1rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            ← Back to login
                        </button>
                    </form>
                )}

                <div className="auth-divider">or</div>

                <div className="auth-footer">
                    New here?{' '}
                    <Link to="/register" className="auth-link">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;