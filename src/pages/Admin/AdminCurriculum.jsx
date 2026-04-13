import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminCurriculum.css';

const COURSE_URL = 'http://localhost:8082/api/v1/courses';
const SECTION_URL = 'http://localhost:8082/api/v1/sections';
const VIDEO_URL = 'http://localhost:8082/api/v1/videos';
const ASSESSMENT_URL = 'http://localhost:8082/api/v1/assessments';

const AdminCurriculum = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [course, setCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    // Section form
    const [showSectionForm, setShowSectionForm] = useState(false);
    const [sectionTitle, setSectionTitle] = useState('');
    const [savingSection, setSavingSection] = useState(false);

    // Video form
    const [showVideoForm, setShowVideoForm] = useState(null);
    const [videoForm, setVideoForm] = useState({
        title: '', videoUrl: '', duration: '', isFree: false
    });
    const [savingVideo, setSavingVideo] = useState(false);

    // ✅ Assessment states
    const [activeTab, setActiveTab] = useState('curriculum'); // 'curriculum' | 'assessment'
    const [existingAssessment, setExistingAssessment] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [extracting, setExtracting] = useState(false);
    const [extractedQuestions, setExtractedQuestions] = useState([]);
    const [assessmentTitle, setAssessmentTitle] = useState('');
    const [passingScore, setPassingScore] = useState(70);
    const [savingAssessment, setSavingAssessment] = useState(false);
    const [assessmentSaved, setAssessmentSaved] = useState(false);

    useEffect(() => {
        fetchData();
        fetchExistingAssessment();
    }, [courseId]);

    const fetchData = async () => {
        try {
            const [courseRes, curriculumRes] = await Promise.all([
                fetch(`${COURSE_URL}/${courseId}`),
                fetch(`${COURSE_URL}/${courseId}/curriculum`)
            ]);
            const courseData = await courseRes.json();
            const curriculumData = await curriculumRes.json();
            setCourse(courseData);
            setSections(curriculumData);
        } catch (err) {
            console.error('Failed to load curriculum:', err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch existing assessment
    const fetchExistingAssessment = async () => {
        try {
            const res = await fetch(`${ASSESSMENT_URL}/course/${courseId}`);
            if (res.ok) {
                const data = await res.json();
                setExistingAssessment(data);
                setAssessmentTitle(data.title || '');
                setPassingScore(data.passingScore || 70);
                setExtractedQuestions(data.questions || []);
            }
        } catch (err) {
            console.error('No existing assessment');
        }
    };

    // ✅ Upload PDF and extract questions
    const handleExtract = async () => {
        if (!pdfFile) {
            alert('Please select a PDF file first!');
            return;
        }
        setExtracting(true);
        try {
            const formData = new FormData();
            formData.append('file', pdfFile);

            const res = await fetch(`${ASSESSMENT_URL}/extract`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: formData
            });

            if (!res.ok) throw new Error('Extraction failed');
            const questions = await res.json();

            if (questions.length === 0) {
                alert('No questions found! Make sure PDF follows the correct format:\n\n1. Question text?\nA) Option\nB) Option\nC) Option\nD) Option\nAnswer: A');
                return;
            }

            setExtractedQuestions(questions);
            alert(`✅ Successfully extracted ${questions.length} questions!`);
        } catch (err) {
            alert('Failed to extract questions. Check PDF format!');
        } finally {
            setExtracting(false);
        }
    };

    // ✅ Edit extracted question
    const handleEditQuestion = (index, field, value) => {
        const updated = [...extractedQuestions];
        updated[index] = { ...updated[index], [field]: value };
        setExtractedQuestions(updated);
    };

    // ✅ Delete question
    const handleDeleteQuestion = (index) => {
        setExtractedQuestions(prev => prev.filter((_, i) => i !== index));
    };

    // ✅ Add blank question manually
    const handleAddQuestion = () => {
        setExtractedQuestions(prev => [...prev, {
            question: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            correctAnswer: 'A'
        }]);
    };

    // ✅ Save assessment
    const handleSaveAssessment = async () => {
        if (!assessmentTitle.trim()) {
            alert('Please enter assessment title!');
            return;
        }
        if (extractedQuestions.length === 0) {
            alert('Please add at least one question!');
            return;
        }
        setSavingAssessment(true);
        try {
            const res = await fetch(`${ASSESSMENT_URL}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify({
                    courseId: parseInt(courseId),
                    title: assessmentTitle,
                    passingScore: passingScore,
                    questions: extractedQuestions
                })
            });
            if (!res.ok) throw new Error('Save failed');
            setAssessmentSaved(true);
            fetchExistingAssessment();
            alert(`✅ Assessment saved with ${extractedQuestions.length} questions!`);
        } catch (err) {
            alert('Failed to save assessment!');
        } finally {
            setSavingAssessment(false);
        }
    };

    // ✅ Add Section
    const handleAddSection = async (e) => {
        e.preventDefault();
        if (!sectionTitle.trim()) return;
        setSavingSection(true);
        try {
            await fetch(SECTION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: parseInt(courseId),
                    title: sectionTitle,
                    orderIndex: sections.length + 1
                })
            });
            setSectionTitle('');
            setShowSectionForm(false);
            fetchData();
        } catch (err) {
            console.error('Failed to add section:', err);
        } finally {
            setSavingSection(false);
        }
    };

    // ✅ Delete Section
    const handleDeleteSection = async (sectionId) => {
        if (!window.confirm('Delete this section and all its videos?')) return;
        try {
            await fetch(`${SECTION_URL}/${sectionId}`, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            console.error('Failed to delete section:', err);
        }
    };

    // ✅ Add Video
    const handleAddVideo = async (e, sectionId) => {
        e.preventDefault();
        if (!videoForm.title || !videoForm.videoUrl) return;
        setSavingVideo(true);
        try {
            const section = sections.find(s => s.id === sectionId);
            await fetch(VIDEO_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sectionId,
                    courseId: parseInt(courseId),
                    title: videoForm.title,
                    videoUrl: videoForm.videoUrl,
                    duration: videoForm.duration,
                    isFree: videoForm.isFree,
                    orderIndex: (section?.videos?.length || 0) + 1
                })
            });
            setVideoForm({ title: '', videoUrl: '', duration: '', isFree: false });
            setShowVideoForm(null);
            fetchData();
        } catch (err) {
            console.error('Failed to add video:', err);
        } finally {
            setSavingVideo(false);
        }
    };

    // ✅ Delete Video
    const handleDeleteVideo = async (videoId) => {
        if (!window.confirm('Delete this video?')) return;
        try {
            await fetch(`${VIDEO_URL}/${videoId}`, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            console.error('Failed to delete video:', err);
        }
    };

    const getYouTubeId = (url) => {
        const match = url?.match(
            /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\n?#]+)/
        );
        return match ? match[1] : null;
    };

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
            Loading curriculum...
        </div>
    );

    const inputStyle = {
        width: '100%', padding: '0.6rem 0.75rem',
        border: '1.5px solid #E5E7EB', borderRadius: '8px',
        fontSize: '0.875rem', boxSizing: 'border-box', outline: 'none'
    };

    return (
        <div className="admin-curriculum">
            {/* Header */}
            <div className="curriculum-header">
                <div className="curriculum-back">
                    <button
                        onClick={() => navigate('/admin/courses')}
                        className="back-btn"
                    >
                        ← Back to Courses
                    </button>
                    <div>
                        <h1 className="admin-page-title">Manage Curriculum</h1>
                        <p className="admin-page-subtitle">📚 {course?.title}</p>
                    </div>
                </div>
                <div className="curriculum-stats">
                    <div className="curr-stat">
                        <span className="curr-stat-value">{sections.length}</span>
                        <span className="curr-stat-label">Sections</span>
                    </div>
                    <div className="curr-stat">
                        <span className="curr-stat-value">
                            {sections.reduce((acc, s) => acc + (s.videos?.length || 0), 0)}
                        </span>
                        <span className="curr-stat-label">Videos</span>
                    </div>
                    <div className="curr-stat">
                        <span className="curr-stat-value">
                            {existingAssessment?.questions?.length || 0}
                        </span>
                        <span className="curr-stat-label">Questions</span>
                    </div>
                </div>
            </div>

            {/* ✅ Tab Switch */}
            <div style={{
                display: 'flex', gap: '0.5rem',
                marginBottom: '1.5rem',
                borderBottom: '2px solid #E5E7EB',
                paddingBottom: '0'
            }}>
                {[
                    { id: 'curriculum', label: '🎬 Curriculum' },
                    { id: 'assessment', label: '📝 Assessment' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            borderBottom: activeTab === tab.id
                                ? '3px solid #4F46E5' : '3px solid transparent',
                            background: 'none',
                            cursor: 'pointer',
                            fontWeight: activeTab === tab.id ? '700' : '500',
                            color: activeTab === tab.id ? '#4F46E5' : '#6B7280',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.label}
                        {tab.id === 'assessment' && existingAssessment && (
                            <span style={{
                                marginLeft: '0.5rem',
                                background: '#10B981',
                                color: 'white',
                                borderRadius: '99px',
                                padding: '0.1rem 0.5rem',
                                fontSize: '0.7rem',
                                fontWeight: '700'
                            }}>
                                ✓ Published
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ══════════════════════════════════════════════
                CURRICULUM TAB
            ══════════════════════════════════════════════ */}
            {activeTab === 'curriculum' && (
                <div className="sections-list">
                    {sections.length === 0 && !showSectionForm && (
                        <div className="empty-curriculum">
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎬</div>
                            <h3>No sections yet</h3>
                            <p>Add your first section to start building the curriculum</p>
                        </div>
                    )}

                    {sections.map((section, sIndex) => (
                        <div key={section.id} className="section-card">
                            <div className="section-header">
                                <div className="section-title-group">
                                    <span className="section-number">Section {sIndex + 1}</span>
                                    <h3 className="section-title">{section.title}</h3>
                                    <span className="video-count">
                                        {section.videos?.length || 0} videos
                                    </span>
                                </div>
                                <div className="section-actions">
                                    <button
                                        className="btn-add-video"
                                        onClick={() => {
                                            setShowVideoForm(
                                                showVideoForm === section.id ? null : section.id
                                            );
                                            setVideoForm({
                                                title: '', videoUrl: '',
                                                duration: '', isFree: false
                                            });
                                        }}
                                    >
                                        + Add Video
                                    </button>
                                    <button
                                        className="btn-delete-section"
                                        onClick={() => handleDeleteSection(section.id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            <div className="videos-list">
                                {section.videos?.map((video, vIndex) => (
                                    <div key={video.id} className="video-item">
                                        <div className="video-thumbnail">
                                            {getYouTubeId(video.videoUrl) ? (
                                                <img
                                                    src={`https://img.youtube.com/vi/${getYouTubeId(video.videoUrl)}/mqdefault.jpg`}
                                                    alt={video.title}
                                                />
                                            ) : (
                                                <div className="video-thumb-placeholder">▶</div>
                                            )}
                                        </div>
                                        <div className="video-info">
                                            <span className="video-number">{vIndex + 1}.</span>
                                            <span className="video-title">{video.title}</span>
                                            {video.isFree && (
                                                <span className="free-badge">Free Preview</span>
                                            )}
                                            {video.duration && (
                                                <span className="video-duration">
                                                    ⏱ {video.duration}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            className="btn-delete-video"
                                            onClick={() => handleDeleteVideo(video.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {showVideoForm === section.id && (
                                <form
                                    className="add-video-form"
                                    onSubmit={(e) => handleAddVideo(e, section.id)}
                                >
                                    <h4>Add New Video</h4>
                                    <div className="video-form-grid">
                                        <div className="form-field">
                                            <label>Video Title *</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Introduction to Python"
                                                value={videoForm.title}
                                                onChange={(e) => setVideoForm({
                                                    ...videoForm, title: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>YouTube URL *</label>
                                            <input
                                                type="text"
                                                placeholder="https://youtube.com/watch?v=..."
                                                value={videoForm.videoUrl}
                                                onChange={(e) => setVideoForm({
                                                    ...videoForm, videoUrl: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Duration</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 12:30"
                                                value={videoForm.duration}
                                                onChange={(e) => setVideoForm({
                                                    ...videoForm, duration: e.target.value
                                                })}
                                            />
                                        </div>
                                        <div className="form-field checkbox-field">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={videoForm.isFree}
                                                    onChange={(e) => setVideoForm({
                                                        ...videoForm, isFree: e.target.checked
                                                    })}
                                                />
                                                Free Preview
                                            </label>
                                        </div>
                                    </div>

                                    {getYouTubeId(videoForm.videoUrl) && (
                                        <div className="youtube-preview">
                                            <img
                                                src={`https://img.youtube.com/vi/${getYouTubeId(videoForm.videoUrl)}/mqdefault.jpg`}
                                                alt="Preview"
                                            />
                                            <span>✅ Valid YouTube URL</span>
                                        </div>
                                    )}

                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="btn-cancel"
                                            onClick={() => setShowVideoForm(null)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-save"
                                            disabled={savingVideo}
                                        >
                                            {savingVideo ? 'Adding...' : '+ Add Video'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ))}

                    {showSectionForm && (
                        <form className="add-section-form" onSubmit={handleAddSection}>
                            <h4>New Section</h4>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    placeholder="e.g. Introduction to Python"
                                    value={sectionTitle}
                                    onChange={(e) => setSectionTitle(e.target.value)}
                                    autoFocus
                                    style={{
                                        flex: 1, padding: '0.75rem',
                                        border: '2px solid #E5E7EB',
                                        borderRadius: '8px', fontSize: '0.95rem'
                                    }}
                                />
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setShowSectionForm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-save"
                                    disabled={savingSection}
                                >
                                    {savingSection ? 'Saving...' : 'Add Section'}
                                </button>
                            </div>
                        </form>
                    )}

                    <button
                        className="btn-add-section"
                        onClick={() => setShowSectionForm(true)}
                    >
                        + Add New Section
                    </button>
                </div>
            )}

            {/* ══════════════════════════════════════════════
                ASSESSMENT TAB
            ══════════════════════════════════════════════ */}
            {activeTab === 'assessment' && (
                <div style={{ maxWidth: '800px' }}>

                    {/* PDF Format Guide */}
                    <div style={{
                        background: '#EEF2FF',
                        border: '1px solid #C7D2FE',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        marginBottom: '1.5rem'
                    }}>
                        <h4 style={{
                            margin: '0 0 0.75rem',
                            color: '#4F46E5'
                        }}>
                            📋 PDF Format Guide
                        </h4>
                        <p style={{
                            margin: '0 0 0.5rem',
                            fontSize: '0.85rem',
                            color: '#374151'
                        }}>
                            Your PDF must follow this exact format:
                        </p>
                        <div style={{
                            background: '#1F2937',
                            color: '#10B981',
                            padding: '1rem',
                            borderRadius: '8px',
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            lineHeight: '1.8'
                        }}>
                            1. What is Java?<br />
                            A) A coffee brand<br />
                            B) A programming language<br />
                            C) An operating system<br />
                            D) A database<br />
                            Answer: B<br />
                            <br />
                            2. What is Spring Boot?<br />
                            A) A shoe brand<br />
                            B) A Java framework<br />
                            C) A database<br />
                            D) A frontend library<br />
                            Answer: B
                        </div>
                    </div>

                    {/* Assessment Settings */}
                    <div style={{
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        marginBottom: '1.5rem'
                    }}>
                        <h3 style={{ margin: '0 0 1rem', color: '#1F2937' }}>
                            ⚙️ Assessment Settings
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1rem'
                        }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    color: '#374151',
                                    marginBottom: '0.4rem'
                                }}>
                                    Assessment Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Java Fundamentals Quiz"
                                    value={assessmentTitle}
                                    onChange={(e) => setAssessmentTitle(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    color: '#374151',
                                    marginBottom: '0.4rem'
                                }}>
                                    Passing Score (%)
                                </label>
                                <input
                                    type="number"
                                    min="1" max="100"
                                    value={passingScore}
                                    onChange={(e) => setPassingScore(
                                        parseInt(e.target.value)
                                    )}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    </div>

                    {/* PDF Upload */}
                    <div style={{
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        marginBottom: '1.5rem'
                    }}>
                        <h3 style={{ margin: '0 0 1rem', color: '#1F2937' }}>
                            📤 Upload PDF
                        </h3>

                        {/* Drop zone */}
                        <label style={{
                            display: 'block',
                            border: '2px dashed #C7D2FE',
                            borderRadius: '12px',
                            padding: '2rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: pdfFile ? '#F0FDF4' : '#F8FAFF',
                            transition: 'all 0.2s',
                            marginBottom: '1rem'
                        }}>
                            <input
                                type="file"
                                accept=".pdf"
                                style={{ display: 'none' }}
                                onChange={(e) => setPdfFile(e.target.files[0])}
                            />
                            {pdfFile ? (
                                <>
                                    <div style={{
                                        fontSize: '2rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        ✅
                                    </div>
                                    <p style={{
                                        margin: 0,
                                        fontWeight: '600',
                                        color: '#166534'
                                    }}>
                                        {pdfFile.name}
                                    </p>
                                    <p style={{
                                        margin: '0.25rem 0 0',
                                        fontSize: '0.8rem',
                                        color: '#6B7280'
                                    }}>
                                        Click to change file
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div style={{
                                        fontSize: '2.5rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        📄
                                    </div>
                                    <p style={{
                                        margin: 0,
                                        fontWeight: '600',
                                        color: '#4F46E5'
                                    }}>
                                        Click to upload PDF
                                    </p>
                                    <p style={{
                                        margin: '0.25rem 0 0',
                                        fontSize: '0.8rem',
                                        color: '#9CA3AF'
                                    }}>
                                        PDF files only
                                    </p>
                                </>
                            )}
                        </label>

                        <button
                            onClick={handleExtract}
                            disabled={!pdfFile || extracting}
                            style={{
                                width: '100%',
                                padding: '0.85rem',
                                background: !pdfFile || extracting
                                    ? '#9CA3AF'
                                    : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: !pdfFile || extracting
                                    ? 'not-allowed' : 'pointer',
                                fontWeight: '700',
                                fontSize: '1rem'
                            }}
                        >
                            {extracting
                                ? '⏳ Extracting Questions...'
                                : '🔍 Extract Questions from PDF'}
                        </button>
                    </div>

                    {/* Questions Editor */}
                    {extractedQuestions.length > 0 && (
                        <div style={{
                            background: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1.25rem'
                            }}>
                                <h3 style={{ margin: 0, color: '#1F2937' }}>
                                    ❓ Questions ({extractedQuestions.length})
                                </h3>
                                <button
                                    onClick={handleAddQuestion}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: '#EEF2FF',
                                        color: '#4F46E5',
                                        border: '1px solid #C7D2FE',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    + Add Question
                                </button>
                            </div>

                            {extractedQuestions.map((q, index) => (
                                <div key={index} style={{
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '10px',
                                    padding: '1.25rem',
                                    marginBottom: '1rem',
                                    background: '#FAFAFA'
                                }}>
                                    {/* Question Header */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '0.75rem'
                                    }}>
                                        <span style={{
                                            fontWeight: '700',
                                            color: '#4F46E5',
                                            fontSize: '0.9rem'
                                        }}>
                                            Q{index + 1}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteQuestion(index)}
                                            style={{
                                                background: '#FEE2E2',
                                                color: '#DC2626',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '0.3rem 0.6rem',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                fontWeight: '600'
                                            }}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>

                                    {/* Question Text */}
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <label style={{
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: '#6B7280',
                                            display: 'block',
                                            marginBottom: '0.3rem'
                                        }}>
                                            Question
                                        </label>
                                        <input
                                            type="text"
                                            value={q.question || ''}
                                            onChange={(e) => handleEditQuestion(
                                                index, 'question', e.target.value
                                            )}
                                            style={inputStyle}
                                            placeholder="Enter question..."
                                        />
                                    </div>

                                    {/* Options */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '0.5rem',
                                        marginBottom: '0.75rem'
                                    }}>
                                        {['A', 'B', 'C', 'D'].map(opt => (
                                            <div key={opt}>
                                                <label style={{
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    color: '#6B7280',
                                                    display: 'block',
                                                    marginBottom: '0.3rem'
                                                }}>
                                                    Option {opt}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={q[`option${opt}`] || ''}
                                                    onChange={(e) => handleEditQuestion(
                                                        index, `option${opt}`, e.target.value
                                                    )}
                                                    style={inputStyle}
                                                    placeholder={`Option ${opt}...`}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Correct Answer */}
                                    <div>
                                        <label style={{
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: '#6B7280',
                                            display: 'block',
                                            marginBottom: '0.3rem'
                                        }}>
                                            ✅ Correct Answer
                                        </label>
                                        <select
                                            value={q.correctAnswer || 'A'}
                                            onChange={(e) => handleEditQuestion(
                                                index, 'correctAnswer', e.target.value
                                            )}
                                            style={{
                                                ...inputStyle,
                                                width: 'auto',
                                                background: '#F0FDF4',
                                                color: '#166534',
                                                fontWeight: '700'
                                            }}
                                        >
                                            {['A', 'B', 'C', 'D'].map(o => (
                                                <option key={o} value={o}>
                                                    {o}) {q[`option${o}`] || `Option ${o}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}

                            {/* Save Button */}
                            <button
                                onClick={handleSaveAssessment}
                                disabled={savingAssessment}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: savingAssessment
                                        ? '#9CA3AF'
                                        : 'linear-gradient(135deg, #10B981, #059669)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: savingAssessment
                                        ? 'not-allowed' : 'pointer',
                                    fontWeight: '700',
                                    fontSize: '1.1rem',
                                    boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
                                    marginTop: '0.5rem'
                                }}
                            >
                                {savingAssessment
                                    ? '⏳ Saving...'
                                    : `💾 Save Assessment (${extractedQuestions.length} Questions)`}
                            </button>
                        </div>
                    )}

                    {/* No questions yet — show manual add */}
                    {extractedQuestions.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            background: 'white',
                            borderRadius: '12px',
                            border: '1px solid #E5E7EB'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                                📝
                            </div>
                            <h3 style={{ color: '#374151', margin: '0 0 0.5rem' }}>
                                No questions yet
                            </h3>
                            <p style={{ color: '#6B7280', margin: '0 0 1.5rem' }}>
                                Upload a PDF to extract questions automatically,
                                or add them manually
                            </p>
                            <button
                                onClick={handleAddQuestion}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: '#4F46E5',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                + Add Question Manually
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminCurriculum;