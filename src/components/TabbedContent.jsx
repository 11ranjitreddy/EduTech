import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, MessageSquare, FolderOpen, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './TabbedContent.css';

const ASSESSMENT_URL = 'http://localhost:8082/api/v1/assessments';

const TabbedContent = ({
    lessons = [],
    assignments = [],
    discussions = [],
    resources = [],
    certificateProgress = 0,
    currentLessonIndex = 0,
    onLessonSelect,
    courseId
}) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('lessons');

    // ✅ Assessment states
    const [assessment, setAssessment] = useState(null);
    const [assessmentLoading, setAssessmentLoading] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [previousAttempt, setPreviousAttempt] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // ✅ Fetch assessment when Assignments tab clicked
    useEffect(() => {
        if (activeTab === 'assignments' && courseId) {
            fetchAssessment();
        }
    }, [activeTab, courseId]);
    useEffect(() => {
    if (courseId) {
        fetchAssessment();
    }
}, [courseId]);

    const fetchAssessment = async () => {
        setAssessmentLoading(true);
        try {
            const res = await fetch(
                `${ASSESSMENT_URL}/course/${courseId}`,
                 {
                // ✅ Add token here
                headers: {
                    'Authorization': `Bearer ${user?.accessToken}`
                }
            }
            );
            if (res.ok) {
                const data = await res.json();
                setAssessment(data);

                // Check previous attempt
                if (user?.email) {
                    const attemptRes = await fetch(
                        `${ASSESSMENT_URL}/${data.id}/attempt?studentEmail=${user.email}`,
                        { headers: { 'Authorization': `Bearer ${user.accessToken}` } }
                    );
                    if (attemptRes.ok) {
                        const attempt = await attemptRes.json();
                        setPreviousAttempt(attempt);
                    }
                }
            } else {
                setAssessment(null);
            }
        } catch (err) {
            console.error('Failed to fetch assessment:', err);
            setAssessment(null);
        } finally {
            setAssessmentLoading(false);
        }
    };

    // ✅ Handle answer selection
    const handleAnswer = (questionId, option) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    // ✅ Submit quiz
    const handleSubmit = async () => {
        if (!assessment) return;
        const unanswered = assessment.questions.filter(
            q => !answers[q.id]
        );
        if (unanswered.length > 0) {
            alert(`Please answer all questions! ${unanswered.length} remaining.`);
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch(
                `${ASSESSMENT_URL}/${assessment.id}/submit`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.accessToken}`
                    },
                    body: JSON.stringify({
                        studentEmail: user.email,
                        answers: answers
                    })
                }
            );
            const data = await res.json();
            setResult(data);
            setSubmitted(true);
        } catch (err) {
            console.error('Failed to submit:', err);
            alert('Failed to submit. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // ✅ Retry quiz
    const handleRetry = () => {
        setAnswers({});
        setSubmitted(false);
        setResult(null);
        setQuizStarted(true);
    };

    const tabs = [
        { id: 'lessons', label: 'Lessons', icon: BookOpen, count: lessons.length },
        { id: 'assignments', label: 'Assignments', icon: FileText, count: assessment?.questions?.length || 0 },
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

                {/* ── Lessons Tab ── */}
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

               {/* ── Assignments Tab ── */}
{activeTab === 'assignments' && (
    <div style={{ padding: '1rem' }}>
        {assessmentLoading ? (
            <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#6B7280',
                fontSize: '0.9rem'
            }}>
                Loading...
            </div>

        ) : !assessment ? (
            <div className="empty-state">
                <FileText size={32} />
                <p>No assignments yet</p>
            </div>

        ) : submitted && result ? (
            // ── Result Screen (Compact) ──
            <div>
                {/* Score Card */}
                <div style={{
                    background: result.passed
                        ? 'linear-gradient(135deg, #10B981, #059669)'
                        : 'linear-gradient(135deg, #EF4444, #DC2626)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    textAlign: 'center',
                    color: 'white',
                    marginBottom: '1rem'
                }}>
                    <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                        {result.passed ? '🎉' : '😔'}
                    </div>
                    <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem' }}>
                        {result.passed ? 'You Passed!' : 'Try Again!'}
                    </h3>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        lineHeight: 1
                    }}>
                        {result.percentage}%
                    </div>
                    <div style={{
                        fontSize: '0.8rem',
                        opacity: 0.9,
                        marginTop: '0.25rem'
                    }}>
                        {result.score}/{result.total} correct
                        • Pass: {result.passingScore}%
                    </div>
                </div>

                {/* Review */}
                <div style={{ marginBottom: '1rem' }}>
                    <p style={{
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        color: '#374151',
                        marginBottom: '0.5rem'
                    }}>
                        Review Answers:
                    </p>
                    {assessment.questions.map((q, index) => {
                        const qResult = result.results?.find(
                            r => r.questionId === q.id
                        );
                        const isCorrect = qResult?.correct;
                        return (
                            <div key={q.id} style={{
                                padding: '0.75rem',
                                background: isCorrect ? '#F0FDF4' : '#FEF2F2',
                                borderRadius: '8px',
                                border: `1px solid ${isCorrect ? '#86EFAC' : '#FECACA'}`,
                                marginBottom: '0.5rem',
                                fontSize: '0.82rem'
                            }}>
                                <p style={{
                                    margin: '0 0 0.3rem',
                                    fontWeight: '600',
                                    color: '#1F2937'
                                }}>
                                    {index + 1}. {q.questionText}
                                    {' '}{isCorrect ? '✅' : '❌'}
                                </p>
                                <p style={{ margin: '0.15rem 0', color: '#6B7280' }}>
                                    Your answer:
                                    <strong style={{
                                        color: isCorrect ? '#166534' : '#DC2626',
                                        marginLeft: '0.25rem'
                                    }}>
                                        {qResult?.studentAnswer})
                                        {' '}{q[`option${qResult?.studentAnswer}`]}
                                    </strong>
                                </p>
                                {!isCorrect && (
                                    <p style={{ margin: '0.15rem 0', color: '#166534' }}>
                                        Correct:
                                        <strong style={{ marginLeft: '0.25rem' }}>
                                            {q.correctAnswer})
                                            {' '}{q[`option${q.correctAnswer}`]}
                                        </strong>
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {!result.passed && (
                        <button onClick={handleRetry} style={{
                            flex: 1, padding: '0.7rem',
                            background: '#4F46E5', color: 'white',
                            border: 'none', borderRadius: '8px',
                            cursor: 'pointer', fontWeight: '600',
                            fontSize: '0.875rem'
                        }}>
                            🔄 Try Again
                        </button>
                    )}
                    {result.passed && (
                        <button
                            onClick={() => setActiveTab('certificate')}
                            style={{
                                flex: 1, padding: '0.7rem',
                                background: '#10B981', color: 'white',
                                border: 'none', borderRadius: '8px',
                                cursor: 'pointer', fontWeight: '600',
                                fontSize: '0.875rem'
                            }}
                        >
                            🎓 Get Certificate
                        </button>
                    )}
                </div>
            </div>

        ) : !quizStarted ? (
            // ── Start Screen (Compact) ──
            <div>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    color: 'white',
                    marginBottom: '1rem'
                }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                        📝
                    </div>
                    <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem' }}>
                        {assessment.title}
                    </h3>
                    <p style={{ margin: 0, opacity: 0.85, fontSize: '0.8rem' }}>
                        Test your knowledge!
                    </p>
                </div>

                {/* Info Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                }}>
                    {[
                        { icon: '❓', label: 'Questions', value: assessment.questions?.length },
                        { icon: '🎯', label: 'Pass Score', value: `${assessment.passingScore}%` },
                        { icon: '🔄', label: 'Attempts', value: 'Unlimited' },
                        { icon: '⏱️', label: 'Time', value: 'No limit' },
                    ].map((item, i) => (
                        <div key={i} style={{
                            padding: '0.6rem',
                            background: '#F8FAFC',
                            borderRadius: '8px',
                            textAlign: 'center',
                            border: '1px solid #E5E7EB'
                        }}>
                            <div style={{ fontSize: '1.1rem' }}>{item.icon}</div>
                            <div style={{
                                fontWeight: '700',
                                fontSize: '1rem',
                                color: '#1F2937'
                            }}>
                                {item.value}
                            </div>
                            <div style={{
                                fontSize: '0.72rem',
                                color: '#6B7280'
                            }}>
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Previous attempt */}
                {previousAttempt && (
                    <div style={{
                        padding: '0.6rem 0.75rem',
                        background: previousAttempt.passed ? '#F0FDF4' : '#FEF3C7',
                        borderRadius: '8px',
                        border: `1px solid ${previousAttempt.passed ? '#86EFAC' : '#FDE68A'}`,
                        marginBottom: '1rem',
                        fontSize: '0.82rem',
                        textAlign: 'center',
                        color: previousAttempt.passed ? '#166534' : '#92400E',
                        fontWeight: '600'
                    }}>
                        {previousAttempt.passed ? '✅' : '⚠️'} Last attempt:
                        {' '}{Math.round(
                            (previousAttempt.score / previousAttempt.totalMarks) * 100
                        )}%
                        {previousAttempt.passed ? ' (Passed)' : ' (Failed)'}
                    </div>
                )}

                <button
                    onClick={() => setQuizStarted(true)}
                    style={{
                        width: '100%', padding: '0.85rem',
                        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                        color: 'white', border: 'none',
                        borderRadius: '10px', cursor: 'pointer',
                        fontWeight: '700', fontSize: '0.95rem',
                        boxShadow: '0 4px 12px rgba(79,70,229,0.3)'
                    }}
                >
                    {previousAttempt ? '🔄 Retake Assessment' : '🚀 Start Assessment'}
                </button>
            </div>

        ) : (
            // ── Questions Screen (Compact) ──
            <div>
                {/* Progress bar */}
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.78rem',
                        color: '#6B7280',
                        marginBottom: '0.3rem'
                    }}>
                        <span>
                            {Object.keys(answers).length}/{assessment.questions?.length} answered
                        </span>
                        <span>
                            {Math.round(
                                (Object.keys(answers).length /
                                assessment.questions?.length) * 100
                            )}%
                        </span>
                    </div>
                    <div style={{
                        height: '4px', background: '#E5E7EB',
                        borderRadius: '99px', overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${(Object.keys(answers).length /
                                assessment.questions?.length) * 100}%`,
                            background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
                            transition: 'width 0.3s',
                            borderRadius: '99px'
                        }} />
                    </div>
                </div>

                {/* Questions */}
                {assessment.questions?.map((q, index) => (
                    <div key={q.id} style={{
                        marginBottom: '1rem',
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '10px',
                        border: answers[q.id]
                            ? '2px solid #4F46E5'
                            : '2px solid #E5E7EB',
                        transition: 'border 0.15s'
                    }}>
                        <p style={{
                            fontWeight: '600',
                            color: '#1F2937',
                            margin: '0 0 0.75rem',
                            fontSize: '0.875rem',
                            lineHeight: '1.4'
                        }}>
                            {index + 1}. {q.questionText}
                        </p>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.4rem'
                        }}>
                            {['A', 'B', 'C', 'D'].map(opt => {
                                const optText = q[`option${opt}`];
                                if (!optText) return null;
                                const isSelected = answers[q.id] === opt;
                                return (
                                    <button
                                        key={opt}
                                        onClick={() => handleAnswer(q.id, opt)}
                                        style={{
                                            padding: '0.5rem 0.75rem',
                                            textAlign: 'left',
                                            border: isSelected
                                                ? '2px solid #4F46E5'
                                                : '1.5px solid #E5E7EB',
                                            borderRadius: '7px',
                                            background: isSelected ? '#EEF2FF' : 'white',
                                            cursor: 'pointer',
                                            fontSize: '0.82rem',
                                            color: isSelected ? '#4F46E5' : '#374151',
                                            fontWeight: isSelected ? '600' : '400',
                                            transition: 'all 0.15s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <span style={{
                                            width: '22px', height: '22px',
                                            borderRadius: '50%',
                                            background: isSelected ? '#4F46E5' : '#F3F4F6',
                                            color: isSelected ? 'white' : '#6B7280',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '700',
                                            fontSize: '0.75rem',
                                            flexShrink: 0
                                        }}>
                                            {opt}
                                        </span>
                                        {optText}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{
                        width: '100%', padding: '0.85rem',
                        background: submitting
                            ? '#9CA3AF'
                            : 'linear-gradient(135deg, #10B981, #059669)',
                        color: 'white', border: 'none',
                        borderRadius: '10px',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        fontWeight: '700', fontSize: '0.95rem',
                        boxShadow: '0 4px 12px rgba(16,185,129,0.25)',
                        marginTop: '0.5rem'
                    }}
                >
                    {submitting ? '⏳ Submitting...' : '✅ Submit Assessment'}
                </button>
            </div>
        )}
    </div>
)}
                {/* ── Discussions Tab ── */}
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
                                <button className="btn btn-primary btn-sm">
                                    Start a Discussion
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Resources Tab ── */}
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

                {/* ── Certificate Tab ── */}
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
                            {certificateProgress >= 100
                                ? 'Download Certificate'
                                : 'Complete Course First'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TabbedContent;