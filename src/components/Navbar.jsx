import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { cartCount } = useCart();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    EdTech<span className="dot">.</span>
                </Link>

                {/* Search Bar */}
                <div className="navbar-search">
                    <input
                        type="text"
                        placeholder="Search courses, topics, instructors..."
                        className="search-input"
                    />
                    <button className="search-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                </div>

                {/* Navigation */}
                <div className="navbar-links">
                    <Link to="/" className="nav-link">Home</Link>

                    <div
                        className="nav-item-dropdown"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <Link to="/courses" className="nav-link dropdown-trigger">
                            Courses
                            <svg className={`chevron ${isDropdownOpen ? 'rotate' : ''}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </Link>

                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="/courses?category=all" className="dropdown-item">All Courses</Link>
                                <Link to="/courses?category=python" className="dropdown-item">Python</Link>
                                <Link to="/courses?category=java" className="dropdown-item">Java</Link>
                                <Link to="/courses?category=app-dev" className="dropdown-item">App Development</Link>
                                <Link to="/courses?category=web-dev" className="dropdown-item">Web Development</Link>
                                <Link to="/courses?category=ai-ml" className="dropdown-item">AI / ML</Link>
                            </div>
                        )}
                    </div>

                    <Link to="/contact" className="nav-link">Contact Us</Link>
                </div>

                {/* Auth Buttons */}
                <div className="navbar-auth">
                    <Link to="/cart" className="cart-icon" style={{ position: 'relative' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: 'var(--primary)',
                                color: 'white',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: 'bold'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <Link to="/auth">
                        <Button variant="primary">Login / Register</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
