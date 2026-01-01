import React, { useState } from 'react';
import Button from '../components/Button';
import './CourseLearning.css';

const CourseLearning = () => {
    const [activeTab, setActiveTab] = useState('live'); // 'live' or 'chat'

    return (
        <div className="learning-page">
            <div className="learning-container">
                {/* Main Content */}
                <div className="learning-main">
                    <div className="video-player-wrapper">
                        <div className="video-placeholder">
                            <span className="play-icon">▶</span>
                            <p>Course Video Player</p>
                        </div>
                    </div>

                    <div className="lesson-info">
                        <h1 className="lesson-title">Introduction to Advanced React Patterns</h1>
                        <p className="lesson-desc">
                            In this lesson, we will explore compound components, control props, and custom hooks to build reusable UI libraries.
                        </p>

                        <div className="lesson-resources">
                            <h3>Resources</h3>
                            <div className="resource-list">
                                <a href="#" className="resource-link">📄 Slides.pdf</a>
                                <a href="#" className="resource-link">💻 Source Code.zip</a>
                            </div>
                        </div>

                        <div className="faculty-profile">
                            <img src="https://placehold.co/100/png?text=Dr+A" alt="Instructor" className="faculty-avatar" />
                            <div>
                                <h3 className="faculty-name">Dr. Angela Yu</h3>
                                <p className="faculty-role">Senior Instructor</p>
                                <Button variant="outline" className="btn-sm">View Profile</Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="learning-sidebar">
                    <div className="sidebar-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'live' ? 'active' : ''}`}
                            onClick={() => setActiveTab('live')}
                        >
                            Live Classes
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
                            onClick={() => setActiveTab('chat')}
                        >
                            Doubt Chat
                        </button>
                    </div>

                    <div className="sidebar-content">
                        {activeTab === 'live' && (
                            <div className="live-classes-list">
                                <div className="card-item upcoming">
                                    <div className="card-status status-live">● LIVE NOW</div>
                                    <h4>Q&A Session: Visualizing State</h4>
                                    <p>Started 10 mins ago</p>
                                    <Button variant="primary" className="btn-block btn-sm">Join Now</Button>
                                </div>

                                <div className="card-item">
                                    <div className="card-status">Upcoming</div>
                                    <h4>Advanced Hooks Deep Dive</h4>
                                    <p>Tomorrow, 10:00 AM</p>
                                    <Button variant="outline" className="btn-block btn-sm">Set Reminder</Button>
                                </div>

                                <div className="card-item history">
                                    <div className="card-status">Recorded</div>
                                    <h4>React Performance Optimization</h4>
                                    <p>2 days ago</p>
                                    <Button variant="secondary" className="btn-block btn-sm">Watch Replay</Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'chat' && (
                            <div className="doubt-chat-panel">
                                <div className="chat-messages">
                                    <div className="message student">
                                        <p>Can you explain the difference between useMemo and useCallback again?</p>
                                        <span className="timestamp">10:30 AM</span>
                                    </div>

                                    <div className="message faculty">
                                        <div className="msg-header">
                                            <span className="badge">Faculty</span>
                                            <span className="name">Dr. Angela</span>
                                        </div>
                                        <p>Sure! useMemo caches the <strong>result</strong> of a function, while useCallback caches the <strong>function definition</strong> itself.</p>
                                        <span className="timestamp">10:32 AM</span>
                                    </div>

                                    <div className="message ai-suggested">
                                        <div className="msg-header">
                                            <span className="badge ai-badge">AI Suggested Answer</span>
                                        </div>
                                        <p>Think of useMemo as memorizing a value, and useCallback as memorizing an action.</p>
                                        <div className="ai-actions">
                                            <button>Correct</button>
                                            <button>Edit</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="chat-input-area">
                                    <input type="text" placeholder="Type your doubt here..." />
                                    <button className="send-btn">➤</button>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CourseLearning;
