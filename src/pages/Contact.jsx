import React from 'react';
import Button from '../components/Button';
import './Contact.css';

const Contact = () => {
    return (
        <div className="contact-page container">
            <div className="contact-wrapper">
                <div className="contact-info">
                    <h1 className="contact-title">Get in Touch</h1>
                    <p className="contact-desc">Have questions? We'd love to hear from you.</p>

                    <div className="contact-details">
                        <div className="detail-item">
                            <span className="icon">📍</span>
                            <p>123 Education Lane, Tech City, TC 90210</p>
                        </div>
                        <div className="detail-item">
                            <span className="icon">📞</span>
                            <p>+1 (555) 123-4567</p>
                        </div>
                        <div className="detail-item">
                            <span className="icon">✉️</span>
                            <p>support@edtech.com</p>
                        </div>
                    </div>
                </div>

                <div className="contact-form-container">
                    <form className="contact-form">
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" placeholder="Your Name" />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" placeholder="your@email.com" />
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea placeholder="How can we help?" rows="5"></textarea>
                        </div>
                        <Button variant="primary" className="btn-block">Send Message</Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
