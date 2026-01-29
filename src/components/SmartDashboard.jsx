import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Target, Flame, Star, Trophy, MessageCircle, Calendar } from 'lucide-react';
import Button from './Button';
import './SmartDashboard.css';

const SmartDashboard = ({
    courseProgress = 45,
    timeSpent = '2h 30m',
    streak = 5,
    xp = 1250,
    badges = 3,
    lastLesson = null,
    recommendedLesson = null,
    instructor = null
}) => {
    return (
        <div className="smart-dashboard">
            {/* Resume Last Lesson */}
            {lastLesson && (
                <div className="dashboard-card resume-card">
                    <div className="card-header">
                        <Play size={18} />
                        <span>Resume Learning</span>
                    </div>
                    <h4>{lastLesson.title}</h4>
                    <p className="lesson-meta">{lastLesson.duration} left</p>
                    <Button variant="primary" className="btn-sm btn-block">Continue</Button>
                </div>
            )}

            {/* Progress Stats */}
            <div className="dashboard-card stats-card">
                <div className="card-header">
                    <Target size={18} />
                    <span>Your Progress</span>
                </div>
                <div className="progress-circle-container">
                    <div className="progress-circle">
                        <svg viewBox="0 0 100 100">
                            <circle className="progress-bg-circle" cx="50" cy="50" r="42" />
                            <circle
                                className="progress-fill-circle"
                                cx="50"
                                cy="50"
                                r="42"
                                strokeDasharray={`${courseProgress * 2.64} 264`}
                            />
                        </svg>
                        <div className="progress-text">
                            <span className="progress-value">{courseProgress}%</span>
                            <span className="progress-label">Complete</span>
                        </div>
                    </div>
                </div>
                <div className="stat-row">
                    <Clock size={16} />
                    <span>Time Spent: <strong>{timeSpent}</strong></span>
                </div>
            </div>

            {/* Today's Recommendation */}
            {recommendedLesson && (
                <div className="dashboard-card recommend-card">
                    <div className="card-header">
                        <Calendar size={18} />
                        <span>Today's Lesson</span>
                    </div>
                    <h4>{recommendedLesson.title}</h4>
                    <p className="lesson-meta">~{recommendedLesson.duration}</p>
                    <Button variant="outline" className="btn-sm btn-block">Start</Button>
                </div>
            )}

            {/* Gamification Stats */}
            <div className="dashboard-card gamification-card">
                <div className="gamification-stats">
                    <div className="gam-stat">
                        <div className="gam-icon streak">
                            <Flame size={20} />
                        </div>
                        <div className="gam-info">
                            <span className="gam-value">{streak}</span>
                            <span className="gam-label">Day Streak</span>
                        </div>
                    </div>
                    <div className="gam-stat">
                        <div className="gam-icon xp">
                            <Star size={20} />
                        </div>
                        <div className="gam-info">
                            <span className="gam-value">{xp.toLocaleString()}</span>
                            <span className="gam-label">XP Points</span>
                        </div>
                    </div>
                    <div className="gam-stat">
                        <div className="gam-icon badges">
                            <Trophy size={20} />
                        </div>
                        <div className="gam-info">
                            <span className="gam-value">{badges}</span>
                            <span className="gam-label">Badges</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Instructor Card */}
            {instructor && (
                <div className="dashboard-card instructor-card">
                    <div className="card-header">
                        <span>Your Instructor</span>
                    </div>
                    <div className="instructor-info">
                        <img
                            src={instructor.avatar || 'https://via.placeholder.com/48'}
                            alt={instructor.name}
                            className="instructor-avatar"
                        />
                        <div>
                            <h4>{instructor.name}</h4>
                            <p className="instructor-title">{instructor.title}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="btn-sm btn-block">
                        <MessageCircle size={16} />
                        Ask a Question
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SmartDashboard;
