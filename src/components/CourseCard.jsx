import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CourseCard.css';

const CourseCard = ({ course }) => {
    const { addToCart, cart, purchasedCourses } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [added, setAdded] = useState(false);

    const { title, instructor, price, rating, image, category } = course;

    // ✅ Check if already in cart or purchased
    const isInCart = cart.some(item => String(item.id) === String(course.id));
    const isPurchased = purchasedCourses?.some(item => String(item.id) === String(course.id));

    const handleAddToCart = (e) => {
        e.preventDefault(); // prevent link navigation
        e.stopPropagation();

        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/courses' } });
            return;
        }

        if (isInCart || isPurchased) return;

        addToCart(course);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000); // reset after 2s
    };

    return (
        <div className="course-card">
            {/* ✅ Click card to go to detail page */}
            <Link to={`/course/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="course-image-container">
                    <img
                        src={image || 'https://placehold.co/300x200/png?text=Course'}
                        alt={title}
                        className="course-image"
                    />
                    <span className="course-category">{category}</span>
                </div>
                <div className="course-content">
                    <div className="course-header">
                        <h3 className="course-title">{title}</h3>
                        <div className="course-rating">
                            <span className="star">★</span> {rating}
                        </div>
                    </div>
                    <p className="course-instructor">by {instructor}</p>

                    <div className="course-footer">
                        <div className="price-container">
                            <span className="course-price">₹{price}</span>
                            {course.originalPrice && (
                                <>
                                    <span className="original-price">₹{course.originalPrice}</span>
                                    <span className="discount-badge">
                                        {Math.round(((course.originalPrice - price) / course.originalPrice) * 100)}% off
                                    </span>
                                </>
                            )}
                        </div>

                        {/* ✅ Add to cart button */}
                        <Button
                            variant={isInCart || isPurchased ? 'secondary' : 'outline'}
                            className="add-cart-btn-sm"
                            onClick={handleAddToCart}
                            style={{
                                background: isPurchased ? '#10B981' :
                                            isInCart ? '#4F46E5' : '',
                                color: (isInCart || isPurchased) ? 'white' : '',
                                borderColor: (isInCart || isPurchased) ? 'transparent' : ''
                            }}
                        >
                            {isPurchased ? '✓ Owned' :
                             isInCart ? '✓ In Cart' :
                             added ? '✓ Added!' : 'Add'}
                        </Button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default CourseCard;