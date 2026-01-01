import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Star } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="container hero-content">
                <div className="hero-text">
                    <div className="hero-badge">
                        <Star size={16} fill="currentColor" />
                        <span>Trusted by 50,000+ Students</span>
                    </div>
                    <h1 className="hero-title">
                        Upgrade Your Skills.<br />
                        <span>Learn From Industry Experts.</span>
                    </h1>
                    <p className="hero-desc">
                        Master the most in-demand skills in coding, design, and business with live classes and interactive courses.
                    </p>
                    <div className="hero-actions">
                        <Link to="/courses" className="btn btn-primary">
                            Explore Courses <ArrowRight size={18} />
                        </Link>
                        <Link to="/courses?type=live" className="btn btn-outline">
                            <Play size={18} /> Join Live Classes
                        </Link>
                    </div>
                </div>
                <div className="hero-image">
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        alt="Students learning together"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
