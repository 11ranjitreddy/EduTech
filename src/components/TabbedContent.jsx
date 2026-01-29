import React, { useState } from 'react';
import { BookOpen, FileText, MessageSquare, FolderOpen, Award } from 'lucide-react';
import './TabbedContent.css';

const TabbedContent = ({
    lessons = [],
    assignments = [],
    discussions = [],
    resources = [],
    certificateProgress = 0,
    currentLessonIndex = 0,
    onLessonSelect
}) => {
    const [activeTab, setActiveTab] = useState('lessons');

    const tabs = [
        { id: 'lessons', label: 'Lessons', icon: BookOpen, count: lessons.length },
        { id: 'assignments', label: 'Assignments', icon: FileText, count: assignments.length },
        { id: 'discussions', label: 'Discussions', icon: MessageSquare, count: discussions.length },
        { id: 'resources', label: 'Resources', icon: FolderOpen, count: resources.length },
        { id: 'certificate', label: 'Certificate', icon: Award }
    ];

    return (
        <div className="tabbed-content">
            {/* Tab Headers */}
            <div className="tabs-header">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.icon size={18} />
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                            <span className="tab-count">{tab.count}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="tabs-content">
                {/* Lessons Tab */}
                {activeTab === 'lessons' && (
                    <div className="lessons-list">
                        {lessons.map((lesson, index) => (
                            <div
                                key={lesson.id}
                                className={`lesson-item ${index === currentLessonIndex ? 'current' : ''} ${lesson.completed ? 'completed' : ''}`}
                                onClick={() => onLessonSelect && onLessonSelect(index)}
                            >
                                <div className="lesson-number">{index + 1}</div>
                                <div className="lesson-info">
                                    <h4>{lesson.title}</h4>
                                    <p>{lesson.duration} • {lesson.type}</p>
                                </div>
                                {lesson.completed && (
                                    <span className="completed-badge">✓</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Assignments Tab */}
                {activeTab === 'assignments' && (
                    <div className="assignments-list">
                        {assignments.length > 0 ? assignments.map(assignment => (
                            <div key={assignment.id} className="assignment-item">
                                <div className="assignment-info">
                                    <h4>{assignment.title}</h4>
                                    <p>Due: {assignment.dueDate}</p>
                                </div>
                                <span className={`status-badge ${assignment.status}`}>
                                    {assignment.status}
                                </span>
                            </div>
                        )) : (
                            <div className="empty-state">
                                <FileText size={40} />
                                <p>No assignments yet</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Discussions Tab */}
                {activeTab === 'discussions' && (
                    <div className="discussions-list">
                        {discussions.length > 0 ? discussions.map(discussion => (
                            <div key={discussion.id} className="discussion-item">
                                <img src={discussion.avatar} alt="" className="discussion-avatar" />
                                <div className="discussion-info">
                                    <h4>{discussion.title}</h4>
                                    <p>by {discussion.author} • {discussion.replies} replies</p>
                                </div>
                            </div>
                        )) : (
                            <div className="empty-state">
                                <MessageSquare size={40} />
                                <p>No discussions yet</p>
                                <button className="btn btn-primary btn-sm">Start a Discussion</button>
                            </div>
                        )}
                    </div>
                )}

                {/* Resources Tab */}
                {activeTab === 'resources' && (
                    <div className="resources-list">
                        {resources.length > 0 ? resources.map(resource => (
                            <div key={resource.id} className="resource-item">
                                <div className="resource-icon">📄</div>
                                <div className="resource-info">
                                    <h4>{resource.title}</h4>
                                    <p>{resource.type} • {resource.size}</p>
                                </div>
                                <button className="btn btn-outline btn-sm">Download</button>
                            </div>
                        )) : (
                            <div className="empty-state">
                                <FolderOpen size={40} />
                                <p>No resources available</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Certificate Tab */}
                {activeTab === 'certificate' && (
                    <div className="certificate-section">
                        <div className="certificate-preview">
                            <Award size={60} />
                            <h3>Course Certificate</h3>
                            <p>Complete all lessons to earn your certificate</p>
                        </div>
                        <div className="certificate-progress">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${certificateProgress}%` }}
                                />
                            </div>
                            <span>{certificateProgress}% complete</span>
                        </div>
                        <button
                            className="btn btn-primary"
                            disabled={certificateProgress < 100}
                        >
                            {certificateProgress >= 100 ? 'Download Certificate' : 'Complete Course First'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TabbedContent;
