import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Award, BookOpen, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import './MyCourses.css';

const MyCourses = () => {
    const { user } = useAuth();
    const { purchasedCourses } = useCart();

    // Calculate overall stats
    const totalCourses = purchasedCourses?.length || 0;
    const completedCourses = purchasedCourses?.filter(c => c.progress === 100).length || 0;
    const inProgressCourses = purchasedCourses?.filter(c => c.progress > 0 && c.progress < 100).length || 0;

    return (
        <div className="my-courses-page">
            <div className="container">
                {/* Header */}
                <div className="my-courses-header">
                    <div>
                        <h1>My Learning</h1>
                        <p>Welcome back, {user?.name || 'Learner'}! Continue your journey.</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#EEF2FF' }}>
                            <BookOpen size={24} color="#4F46E5" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-number">{totalCourses}</span>
                            <span className="stat-label">Enrolled Courses</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#FEF3C7' }}>
                            <BarChart3 size={24} color="#F59E0B" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-number">{inProgressCourses}</span>
                            <span className="stat-label">In Progress</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#D1FAE5' }}>
                            <Award size={24} color="#10B981" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-number">{completedCourses}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                    </div>
                </div>

                {/* Course List */}
                {totalCourses > 0 ? (
                    <div className="enrolled-courses">
                        <h2>Your Courses</h2>
                        <div className="courses-list">
                            {purchasedCourses.map((course) => (
                                <div key={course.id} className="enrolled-course-card">
                                    <img
                                        src={course.image || 'https://via.placeholder.com/200x120'}
                                        alt={course.title}
                                        className="course-thumbnail"
                                    />
                                    <div className="course-info">
                                        <h3>{course.title}</h3>
                                        <p className="course-instructor">by {course.instructor}</p>

                                        <div className="progress-section">
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${course.progress || 0}%` }}
                                                />
                                            </div>
                                            <span className="progress-text">{course.progress || 0}% complete</span>
                                        </div>
                                    </div>
                                    <div className="course-actions">
                                        <Link to={`/learnv2/${course.id}`}>
                                            <Button variant="primary">
                                                <Play size={16} />
                                                {course.progress > 0 ? 'Continue' : 'Start'}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="empty-state">
                        <BookOpen size={64} />
                        <h2>No courses yet</h2>
                        <p>You haven't enrolled in any courses. Start your learning journey today!</p>
                        <Link to="/courses">
                            <Button variant="primary">Browse Courses</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCourses;
