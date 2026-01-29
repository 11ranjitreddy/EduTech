import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, BookOpen, Download, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const location = useLocation();
    const [showConfetti, setShowConfetti] = useState(true);

    // Get order details from navigation state or use defaults
    const orderDetails = location.state || {
        orderId: `ORD${Date.now()}`,
        amount: 0,
        courses: [],
        paymentMethod: 'Card'
    };

    useEffect(() => {
        // Hide confetti after 3 seconds
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="order-success-page">
            {showConfetti && <div className="confetti-container">
                {[...Array(50)].map((_, i) => (
                    <div key={i} className="confetti" style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899'][Math.floor(Math.random() * 4)]
                    }} />
                ))}
            </div>}

            <div className="success-card">
                <div className="success-icon">
                    <CheckCircle size={60} />
                </div>

                <h1 className="success-title">Payment Successful!</h1>
                <p className="success-subtitle">Thank you for your purchase. You're all set to start learning!</p>

                <div className="order-details">
                    <div className="order-row">
                        <span>Order ID</span>
                        <strong>{orderDetails.orderId}</strong>
                    </div>
                    <div className="order-row">
                        <span>Amount Paid</span>
                        <strong>₹{orderDetails.amount?.toFixed(2) || '0.00'}</strong>
                    </div>
                    <div className="order-row">
                        <span>Payment Method</span>
                        <strong>{orderDetails.paymentMethod}</strong>
                    </div>
                    <div className="order-row">
                        <span>Date</span>
                        <strong>{new Date().toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}</strong>
                    </div>
                </div>

                {orderDetails.courses?.length > 0 && (
                    <div className="purchased-courses">
                        <h3>Purchased Courses</h3>
                        <ul>
                            {orderDetails.courses.map((course, index) => (
                                <li key={index}>
                                    <BookOpen size={18} />
                                    <span>{course.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="success-actions">
                    <Link to="/my-courses">
                        <Button variant="primary" className="btn-block">
                            Start Learning <ArrowRight size={18} />
                        </Button>
                    </Link>
                    <Link to="/courses">
                        <Button variant="outline" className="btn-block">
                            Browse More Courses
                        </Button>
                    </Link>
                </div>

                <p className="confirmation-note">
                    📧 A confirmation email has been sent to your registered email address.
                </p>
            </div>
        </div>
    );
};

export default OrderSuccess;
