import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import './Checkout.css';
import { CreditCard, QrCode, Smartphone } from 'lucide-react';

const Checkout = () => {
    const { cart, cartTotal, completePurchase } = useCart();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [upiId, setUpiId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculate total assuming 10% discount if applied (mock logic for demo transfer)
    // In real app, discount would be passed via context or query param
    const finalTotal = cartTotal;

    const handlePayment = () => {
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            const purchasedItems = completePurchase();

            // Navigate to success page with order details
            navigate('/order-success', {
                state: {
                    orderId: `ORD${Date.now()}`,
                    amount: finalTotal,
                    courses: purchasedItems,
                    paymentMethod: paymentMethod === 'card' ? 'Credit/Debit Card' :
                        paymentMethod === 'upi' ? 'UPI' : 'QR Code Payment'
                }
            });
        }, 1500);
    };

    return (
        <div className="checkout-page container">
            <h1 className="page-title">Checkout</h1>

            <div className="checkout-layout">
                {/* Left Column: Form & Payment */}
                <div className="checkout-form-section">
                    <section className="checkout-card">
                        <h2>Billing Details</h2>
                        <form className="billing-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" placeholder="John" />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" placeholder="john@example.com" />
                            </div>
                            <div className="form-group">
                                <label>Mobile Number</label>
                                <input type="tel" placeholder="+91 98765 43210" />
                            </div>
                        </form>
                    </section>

                    <section className="checkout-card">
                        <h2>Payment Method</h2>
                        <div className="payment-tabs">
                            <button
                                className={`payment-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('card')}
                            >
                                <CreditCard size={20} /> Card
                            </button>
                            <button
                                className={`payment-tab ${paymentMethod === 'upi' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('upi')}
                            >
                                <Smartphone size={20} /> UPI
                            </button>
                            <button
                                className={`payment-tab ${paymentMethod === 'qr' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('qr')}
                            >
                                <QrCode size={20} /> QR Code
                            </button>
                        </div>

                        <div className="payment-content">
                            {paymentMethod === 'card' && (
                                <div className="payment-panel">
                                    <div className="form-group">
                                        <label>Card Number</label>
                                        <input type="text" placeholder="0000 0000 0000 0000" />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Expiry</label>
                                            <input type="text" placeholder="MM/YY" />
                                        </div>
                                        <div className="form-group">
                                            <label>CVV</label>
                                            <input type="password" placeholder="123" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'upi' && (
                                <div className="payment-panel">
                                    <p>Enter your UPI ID to receive a payment request on your app.</p>
                                    <div className="form-group">
                                        <label>UPI ID</label>
                                        <input
                                            type="text"
                                            placeholder="username@bank"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                        />
                                    </div>
                                    <Button variant="outline" className="btn-sm">Verify</Button>
                                </div>
                            )}

                            {paymentMethod === 'qr' && (
                                <div className="payment-panel text-center">
                                    <p className="mb-4">Scan this QR code with any UPI app to pay.</p>
                                    <div className="qr-box">
                                        <img
                                            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=merchant@edtechpro&pn=EdTechPro&am=499&cu=INR"
                                            alt="Payment QR"
                                            style={{ margin: '0 auto', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}
                                        />
                                    </div>
                                    <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        Timer: 04:59
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Order Summary */}
                <div className="checkout-summary-section">
                    <section className="checkout-card summary-card">
                        <h3>Order Summary</h3>
                        <div className="order-items">
                            {cart.map(item => (
                                <div key={item.id} className="order-item">
                                    <span>{item.title}</span>
                                    <span>₹{item.price}</span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total">
                            <span>Total to Pay</span>
                            <span>₹{finalTotal.toFixed(2)}</span>
                        </div>

                        <Button
                            variant="primary"
                            className="btn-block mt-4"
                            onClick={handlePayment}
                            disabled={isProcessing || cart.length === 0}
                        >
                            {isProcessing ? 'Processing...' : 'Complete Payment'}
                        </Button>

                        <div className="secure-badge">
                            🔒 100% Secure Payment
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
