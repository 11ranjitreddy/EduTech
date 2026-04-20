import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-section">
                    <h3 className="footer-logo">EdTech<span className="dot">.</span></h3>
                    <p className="footer-desc">
                        Empowering students and professionals to achieve their career goals with world-class education.
                    </p>
                </div>

                <div className="footer-section">
                    <h4 className="footer-heading">Platform</h4>
                    <ul className="footer-links">
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Courses</a></li>
                        <li><a href="#">Live Classes</a></li>
                        <li><a href="#">Mentorship</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4 className="footer-heading">Support</h4>
                    <ul className="footer-links">
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4 className="footer-heading">Contact</h4>
                    <p className="footer-text">support@edtech.com</p>
                    <p className="footer-text">+1 (555) 123-4567</p>
                    <div className="footer-socials">
                        {/* Social icons would go here */}
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 EdTech Platform. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
