import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Calendar, User, CheckCircle, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CourseDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();

    // Mock Data - normally fetch by ID
    const course = {
        id,
        title: 'Complete Python Bootcamp: Go from Zero to Hero',
        description: 'Learn Python like a Professional! Start from the basics and go all the way to creating your own applications and games.',
        instructor: 'Jose Portilla',
        price: 499.00,
        rating: 4.8,
        students: 15400,
        image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        features: [
            '22 hours on-demand video',
            '15 coding exercises',
            'Certificate of completion',
            'Access on mobile and TV'
        ],
        schedule: [
            { topic: 'Python Basics Live Q&A', date: 'Oct 15, 2024', time: '10:00 AM EST' },
            { topic: 'Advanced Functions Workshop', date: 'Oct 18, 2024', time: '2:00 PM EST' }
        ]
    };

    return (
        <div className="course-detail">
            {/* Course Header/Hero */}
            <div style={{ background: '#111827', color: 'white', padding: '3rem 0' }}>
                <div className="container" style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
                    <div style={{ flex: 2 }}>
                        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}>{course.title}</h1>
                        <p style={{ fontSize: '1.1rem', color: '#D1D5DB', marginBottom: '1.5rem' }}>{course.description}</p>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                            <div className="badge" style={{ background: '#F59E0B', color: 'black', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
                                Bestseller
                            </div>
                            <span style={{ color: '#F3F4F6' }}>Created by <span style={{ color: '#818CF8', textDecoration: 'underline' }}>{course.instructor}</span></span>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="btn btn-primary"
                                style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}
                                onClick={() => addToCart(course)}
                            >
                                Add to Cart - ₹{course.price}
                            </button>
                            {/* Mock "Go to Learning" for demo */}
                            <Link to={`/learn/${id}`} className="btn btn-primary" style={{ background: '#10B981', borderColor: '#10B981', color: 'white' }}>
                                <Play size={20} /> Start Learning (Demo)
                            </Link>
                        </div>
                    </div>
                    {/* Right side Image (optional or hidden on small) */}
                    <div style={{ flex: 1, display: 'none' }} className="d-lg-block">
                        {/* Image handled by background or simple layout */}
                    </div>
                </div>
            </div>

            <div className="container" style={{ padding: '3rem 1.5rem', display: 'flex', gap: '3rem' }}>
                {/* Main Content */}
                <div style={{ flex: 2 }}>
                    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>What you'll learn</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {course.features.map((feat, i) => (
                                <div key={i} style={{ display: 'flex', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="var(--secondary)" />
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Course Content List (Mock) */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Course Content</h2>
                        <div style={{ border: '1px solid var(--border)', borderRadius: '8px' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <Play size={16} color="var(--text-secondary)" />
                                        <span>Section {i}: Introduction to Python</span>
                                    </div>
                                    <span style={{ color: 'var(--text-secondary)' }}>12:45</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Faculty & Schedule */}
                <div style={{ flex: 1 }}>
                    <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Instructor</h3>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ width: '64px', height: '64px', background: '#E5E7EB', borderRadius: '50%', overflow: 'hidden' }}>
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Instructor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{course.instructor}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Senior Python Developer</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Jose has taught over 2 million students how to code. He is a certified instructor...
                        </p>
                    </div>

                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Upcoming Live Classes</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {course.schedule.map((slot, i) => (
                                <div key={i} style={{ padding: '1rem', background: 'var(--surface-hover)', borderRadius: '8px' }}>
                                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{slot.topic}</div>
                                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <Calendar size={14} /> {slot.date}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <Clock size={14} /> {slot.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
