import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, PlayCircle, Circle } from 'lucide-react';
import SmartDashboard from '../components/SmartDashboard';
import TabbedContent from '../components/TabbedContent';
import FloatingActions from '../components/FloatingActions';
import './CourseLearningV2.css';

const CourseLearningV2 = () => {
    const { id } = useParams();
    const [currentModuleIndex, setCurrentModuleIndex] = useState(2);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    // Mock Course Data
    const course = {
        id,
        title: 'Complete Python Bootcamp: Go from Zero to Hero',
        instructor: {
            name: 'Jose Portilla',
            title: 'Data Scientist & Instructor',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
        }
    };

    // Mock Modules for Journey Map
    const modules = [
        { id: 1, title: 'Introduction', progress: 100 },
        { id: 2, title: 'Variables', progress: 100 },
        { id: 3, title: 'Data Types', progress: 45 },
        { id: 4, title: 'Functions', progress: 0 },
        { id: 5, title: 'OOP', progress: 0 },
        { id: 6, title: 'Projects', progress: 0 }
    ];

    // Mock Lessons for current module
    const lessons = [
        { id: 1, title: 'Introduction to Data Types', duration: '12:30', type: 'Video', completed: true },
        { id: 2, title: 'Working with Strings', duration: '18:45', type: 'Video', completed: true },
        { id: 3, title: 'Numbers and Math', duration: '15:00', type: 'Video', completed: false },
        { id: 4, title: 'Lists and Tuples', duration: '22:15', type: 'Video', completed: false },
        { id: 5, title: 'Data Types Quiz', duration: '10 min', type: 'Quiz', completed: false }
    ];

    // Mock Assignments
    const assignments = [
        { id: 1, title: 'String Manipulation Exercise', dueDate: 'Feb 5, 2026', status: 'pending' },
        { id: 2, title: 'Number Calculator Project', dueDate: 'Feb 10, 2026', status: 'submitted' }
    ];

    // Mock Discussions
    const discussions = [
        { id: 1, title: 'Best practices for string formatting?', author: 'Sarah K.', replies: 12, avatar: 'https://i.pravatar.cc/40?img=5' },
        { id: 2, title: 'Difference between list and tuple?', author: 'Mike T.', replies: 8, avatar: 'https://i.pravatar.cc/40?img=12' }
    ];

    // Mock Resources
    const resources = [
        { id: 1, title: 'Python Cheat Sheet', type: 'PDF', size: '2.4 MB' },
        { id: 2, title: 'Code Examples - Module 3', type: 'ZIP', size: '1.1 MB' }
    ];

    // Calculate progress
    const completedLessons = lessons.filter(l => l.completed).length;
    const courseProgress = Math.round((completedLessons / lessons.length) * 100);

    return (
        <div className="course-learning-v2">
            {/* Header */}
            <header className="learning-header">
                <Link to="/my-courses" className="back-link">
                    <ArrowLeft size={20} />
                    <span>Back to My Courses</span>
                </Link>
                <h1>{course.title}</h1>
            </header>

            <div className="learning-layout">
                {/* LEFT SIDEBAR - Vertical Journey Map */}
                <aside className="journey-sidebar">
                    <div className="journey-header">
                        <h3>Course Roadmap</h3>
                        <span className="progress-badge">{courseProgress}%</span>
                    </div>
                    <div className="journey-modules">
                        {modules.map((module, index) => {
                            const isCompleted = index < currentModuleIndex;
                            const isCurrent = index === currentModuleIndex;
                            const isUpcoming = index > currentModuleIndex;

                            return (
                                <div
                                    key={module.id}
                                    className={`journey-module ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isUpcoming ? 'upcoming' : ''}`}
                                    onClick={() => setCurrentModuleIndex(index)}
                                >
                                    <div className="module-connector">
                                        <div className="connector-line" />
                                        <div className="module-node">
                                            {isCompleted && <CheckCircle size={18} />}
                                            {isCurrent && <PlayCircle size={18} />}
                                            {isUpcoming && <Circle size={18} />}
                                        </div>
                                    </div>
                                    <div className="module-info">
                                        <span className="module-number">Module {index + 1}</span>
                                        <span className="module-title">{module.title}</span>
                                        {module.progress > 0 && module.progress < 100 && (
                                            <div className="module-progress-bar">
                                                <div className="progress-fill" style={{ width: `${module.progress}%` }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* CENTER - Main Content */}
                <main className="content-center">
                    {/* Video Player */}
                    <div className="video-player">
                        {!isVideoPlaying ? (
                            <div className="video-placeholder" onClick={() => setIsVideoPlaying(true)}>
                                <img
                                    src="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800"
                                    alt="Video thumbnail"
                                />
                                <div className="play-overlay">
                                    <div className="play-btn">
                                        <Play size={40} fill="white" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="video-active">
                                <video controls autoPlay>
                                    <source src="" type="video/mp4" />
                                </video>
                                <div className="video-fallback">
                                    <p>🎥 Video Player Active</p>
                                    <p>Lesson: {lessons[currentLessonIndex]?.title}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tabbed Content */}
                    <TabbedContent
                        lessons={lessons}
                        assignments={assignments}
                        discussions={discussions}
                        resources={resources}
                        certificateProgress={courseProgress}
                        currentLessonIndex={currentLessonIndex}
                        onLessonSelect={(index) => {
                            setCurrentLessonIndex(index);
                            setIsVideoPlaying(true);
                        }}
                    />
                </main>

                {/* RIGHT SIDEBAR - Smart Dashboard */}
                <aside className="dashboard-sidebar">
                    <SmartDashboard
                        courseProgress={courseProgress}
                        timeSpent="2h 30m"
                        streak={5}
                        xp={1250}
                        badges={3}
                        lastLesson={{
                            title: lessons[currentLessonIndex]?.title || 'Numbers and Math',
                            duration: '8:30'
                        }}
                        recommendedLesson={{
                            title: 'Lists and Tuples',
                            duration: '22 min'
                        }}
                        instructor={course.instructor}
                    />
                </aside>
            </div>

            {/* Floating Actions */}
            <FloatingActions />
        </div>
    );
};

export default CourseLearningV2;
