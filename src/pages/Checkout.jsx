import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import './Checkout.css';

const PAYMENT_URL = 'http://localhost:8082/api/v1/payments';

const Checkout = () => {
    const { cart, cartTotal, completePurchase, fetchEnrollments } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [scriptLoaded, setScriptLoaded] = useState(false);

    // ✅ Load Razorpay script
    useEffect(() => {
        if (window.Razorpay) {
            setScriptLoaded(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        script.onerror = () => console.error('Failed to load Razorpay');
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    // ✅ Redirect if cart is empty
    useEffect(() => {
        if (cart.length === 0) {
            navigate('/cart');
        }
    }, [cart]);

    const handlePayment = async () => {
        if (!scriptLoaded) {
            alert('Payment gateway is loading. Please try again.');
            return;
        }

        setIsProcessing(true);

        try {
            // ✅ Step 1: Create Razorpay order on backend
            const orderRes = await fetch(`${PAYMENT_URL}/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentEmail: user.email,
                    amount: cartTotal,
                    courseIds: cart.map(c => Number(c.id))
                })
            });

            if (!orderRes.ok) {
                throw new Error('Failed to create payment order');
            }

            const orderData = await orderRes.json();

            // ✅ Step 2: Open Razorpay popup
            const options = {
                key: orderData.keyId,
                amount: Math.round(orderData.amount * 100), // paise
                currency: 'INR',
                name: 'EdTech Platform',
                description: `${cart.length} Course(s)`,
                image: 'https://via.placeholder.com/60x60?text=ET',
                order_id: orderData.orderId,

                // ✅ Step 3: Handle payment success
                handler: async (response) => {
                    try {
                        const verifyRes = await fetch(`${PAYMENT_URL}/verify`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                                studentEmail: user.email,
                                courseIds: cart.map(c => Number(c.id))
                            })
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            // ✅ Clear cart locally
                            const purchasedItems = completePurchase();

                            // ✅ Refresh enrollments from DB
                            await fetchEnrollments(user.email);

                            // ✅ Navigate to success page
                            navigate('/order-success', {
                                state: {
                                    orderId: response.razorpay_order_id,
                                    paymentId: response.razorpay_payment_id,
                                    amount: cartTotal,
                                    courses: purchasedItems,
                                    paymentMethod: 'Razorpay'
                                }
                            });
                        } else {
                            alert('❌ Payment verification failed. Please contact support.');
                            setIsProcessing(false);
                        }
                    } catch (err) {
                        console.error('Verification error:', err);
                        alert('Payment verification error. Please contact support.');
                        setIsProcessing(false);
                    }
                },

                prefill: {
                    name: `${firstName} ${lastName}`.trim() || user?.name || '',
                    email: user?.email || '',
                    contact: mobile || ''
                },

                notes: {
                    studentEmail: user?.email,
                    courseIds: cart.map(c => c.id).join(',')
                },

                theme: {
                    color: '#4F46E5'
                },

                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                    },
                    escape: true,
                    backdropclose: false
                }
            };

            const razorpay = new window.Razorpay(options);

            // ✅ Handle payment failure
            razorpay.on('payment.failed', (response) => {
                console.error('Payment failed:', response.error);
                alert(`Payment failed: ${response.error.description}`);
                setIsProcessing(false);
            });

            razorpay.open();

        } catch (err) {
            console.error('Payment error:', err);
            alert('Payment failed. Please try again.');
            setIsProcessing(false);
        }
    };

    const discount = cart.reduce((acc, item) => {
        return acc + ((item.originalPrice || item.price) - item.price);
    }, 0);

    return (
        <div className="checkout-page container">
            <h1 className="page-title">Checkout</h1>

            <div className="checkout-layout">
                {/* Left - Billing + Payment Info */}
                <div className="checkout-form-section">

                    {/* Billing Details */}
                    <section className="checkout-card">
                        <h2>Billing Details</h2>
                        <div className="billing-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        placeholder="John"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Doe"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    readOnly
                                    style={{ background: '#F9FAFB', cursor: 'not-allowed' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Mobile Number</label>
                                <input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Payment Method Info */}
                    <section className="checkout-card">
                        <h2>Payment Method</h2>
                        <div style={{
                            padding: '2rem',
                            textAlign: 'center',
                            background: '#F8FAFC',
                            borderRadius: '12px',
                            border: '2px solid #EEF2FF'
                        }}>
                            <div style={{
                                fontSize: '2rem',
                                marginBottom: '0.75rem'
                            }}>
                                💳
                            </div>
                            <p style={{
                                fontWeight: '600',
                                color: '#4F46E5',
                                marginBottom: '0.5rem',
                                fontSize: '1rem'
                            }}>
                                Secured by Razorpay
                            </p>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '1rem',
                                flexWrap: 'wrap',
                                marginTop: '0.75rem'
                            }}>
                                {['UPI', 'Cards', 'NetBanking', 'Wallets'].map(method => (
                                    <span key={method} style={{
                                        background: 'white',
                                        border: '1px solid #E5E7EB',
                                        padding: '0.3rem 0.75rem',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        fontWeight: '500',
                                        color: '#374151'
                                    }}>
                                        {method}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Cart Items */}
                    <section className="checkout-card">
                        <h2>Courses in Order</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.75rem',
                                    background: '#F8FAFC',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{
                                        width: '48px', height: '48px',
                                        background: '#4F46E5',
                                        borderRadius: '8px',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white', fontWeight: '700',
                                        fontSize: '1.2rem', flexShrink: 0
                                    }}>
                                        {item.title?.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontWeight: '600',
                                            fontSize: '0.9rem'
                                        }}>
                                            {item.title}
                                        </div>
                                        <div style={{
                                            fontSize: '0.8rem',
                                            color: '#6B7280'
                                        }}>
                                            by {item.instructor}
                                        </div>
                                    </div>
                                    <div style={{
                                        fontWeight: '700',
                                        color: '#4F46E5'
                                    }}>
                                        ₹{item.price}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right - Order Summary */}
                <div className="checkout-summary-section">
                    <section className="checkout-card summary-card" style={{
                        position: 'sticky', top: '2rem'
                    }}>
                        <h3>Order Summary</h3>

                        <div className="order-items">
                            {cart.map(item => (
                                <div key={item.id} className="order-item">
                                    <span style={{
                                        fontSize: '0.9rem',
                                        color: '#374151',
                                        flex: 1,
                                        paddingRight: '1rem'
                                    }}>
                                        {item.title}
                                    </span>
                                    <span style={{ fontWeight: '600' }}>
                                        ₹{item.price}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="summary-divider"></div>

                        {discount > 0 && (
                            <div className="summary-row" style={{
                                color: '#10B981', fontWeight: '600'
                            }}>
                                <span>Discount</span>
                                <span>- ₹{discount.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="summary-row total">
                            <span>Total to Pay</span>
                            <span style={{ color: '#4F46E5', fontSize: '1.3rem' }}>
                                ₹{cartTotal.toFixed(2)}
                            </span>
                        </div>

                        <div className="summary-divider"></div>

                        {/* ✅ Pay Button */}
                        <button
                            onClick={handlePayment}
                            disabled={isProcessing || cart.length === 0 || !scriptLoaded}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: isProcessing
                                    ? '#9CA3AF'
                                    : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '1.05rem',
                                fontWeight: '700',
                                cursor: isProcessing ? 'not-allowed' : 'pointer',
                                marginBottom: '1rem',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 15px rgba(79,70,229,0.3)'
                            }}
                        >
                            {!scriptLoaded
                                ? '⏳ Loading...'
                                : isProcessing
                                ? '⏳ Opening Payment...'
                                : `🔒 Pay ₹${cartTotal.toFixed(2)}`}
                        </button>

                        {/* Trust badges */}
                        <div style={{
                            textAlign: 'center',
                            fontSize: '0.8rem',
                            color: '#9CA3AF'
                        }}>
                            🔒 100% Secure • SSL Encrypted
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            marginTop: '0.75rem',
                            flexWrap: 'wrap'
                        }}>
                            {['UPI', 'Visa', 'Mastercard', 'RuPay'].map(card => (
                                <span key={card} style={{
                                    background: '#F1F5F9',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    color: '#6B7280',
                                    fontWeight: '500'
                                }}>
                                    {card}
                                </span>
                            ))}
                        </div>

                        {/* What you get */}
                        <div style={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            background: '#F0FDF4',
                            borderRadius: '8px',
                            border: '1px solid #BBF7D0'
                        }}>
                            <p style={{
                                fontWeight: '600',
                                color: '#166534',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem'
                            }}>
                                ✅ What you get:
                            </p>
                            {[
                                'Lifetime access to course',
                                'Certificate of completion',
                                'Access on all devices',
                                '30-day money back guarantee'
                            ].map((item, i) => (
                                <div key={i} style={{
                                    fontSize: '0.82rem',
                                    color: '#15803D',
                                    marginBottom: '0.25rem'
                                }}>
                                    • {item}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
