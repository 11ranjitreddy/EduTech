import React from 'react';
import Button from './Button';
import { useCart } from '../context/CartContext';
import './CourseCard.css';

const CourseCard = ({ course }) => {
    const { addToCart } = useCart();
    const { title, instructor, price, rating, image, category } = course;

    return (
        <div className="course-card">
            <div className="course-image-container">
                <img src={image || "https://via.placeholder.com/300x200"} alt={title} className="course-image" />
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
                    <Button
                        variant="outline"
                        className="add-cart-btn-sm"
                        onClick={() => addToCart(course)}
                    >
                        Add
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
