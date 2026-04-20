import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, cartTotal } = useCart();
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);

    const handleApplyCoupon = () => {
        if (coupon.trim().toUpperCase() === 'SAVE10') {
            setDiscount(cartTotal * 0.1);
            alert('Coupon Applied! You saved 10%.');
        } else {
            alert('Invalid Coupon Code');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="cart-page container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h1 className="page-title">Shopping Cart</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Your cart is empty.</p>
                <Button variant="primary" onClick={() => window.location.href = '/courses'}>Browse Courses</Button>
            </div>
        );
    }

    return (
        <div className="cart-page container">
            <h1 className="page-title">Shopping Cart ({cart.length} items)</h1>

            <div className="cart-layout">
                <div className="cart-items">
                    {cart.map(item => (
                        <div key={item.id} className="cart-item">
                            <img src={item.image} alt={item.title} className="cart-img" />
                            <div className="cart-info">
                                <h3>{item.title}</h3>
                                <p>by {item.instructor}</p>
                                <span className="price">₹{item.price}</span>
                            </div>
                            <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                <Trash2 size={18} /> Remove
                            </button>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h3>Summary</h3>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Discount</span>
                        <span>-₹{discount.toFixed(2)}</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{(cartTotal - discount).toFixed(2)}</span>
                    </div>

                    <div className="coupon-area">
                        <input
                            type="text"
                            placeholder="Coupon Code"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                        />
                        <Button variant="outline" onClick={handleApplyCoupon}>Apply</Button>
                    </div>

                    <Link to="/checkout" style={{ width: '100%' }}>
                        <Button variant="primary" className="btn-block">Checkout Now</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
