import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AdminCurriculum.css';

const COURSE_URL = 'http://localhost:8082/api/v1/courses';
const SECTION_URL = 'http://localhost:8082/api/v1/sections';
const VIDEO_URL = 'http://localhost:8082/api/v1/videos';

const AdminCurriculum = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    // Section form
    const [showSectionForm, setShowSectionForm] = useState(false);
    const [sectionTitle, setSectionTitle] = useState('');
    const [savingSection, setSavingSection] = useState(false);

    // Video form
    const [showVideoForm, setShowVideoForm] = useState(null); // sectionId
    const [videoForm, setVideoForm] = useState({
        title: '', videoUrl: '', duration: '', isFree: false
    });
    const [savingVideo, setSavingVideo] = useState(false);

    useEffect(() => {
        fetchData();
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

    // ✅ Extract YouTube ID for thumbnail
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
                        <p className="admin-page-subtitle">
                            📚 {course?.title}
                        </p>
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
                </div>
            </div>

            {/* Sections List */}
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
                        {/* Section Header */}
                        <div className="section-header">
                            <div className="section-title-group">
                                <span className="section-number">
                                    Section {sIndex + 1}
                                </span>
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

                        {/* Videos List */}
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
                                        <span className="video-number">
                                            {vIndex + 1}.
                                        </span>
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

                        {/* Add Video Form */}
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

                                {/* YouTube Preview */}
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

                {/* Add Section Form */}
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

                {/* Add Section Button */}
                <button
                    className="btn-add-section"
                    onClick={() => setShowSectionForm(true)}
                >
                    + Add New Section
                </button>
            </div>
        </div>
    );
};

export default AdminCurriculum;