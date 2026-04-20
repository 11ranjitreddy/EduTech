import React from 'react';
import { Lock, CheckCircle, PlayCircle } from 'lucide-react';
import './CourseJourneyMap.css';

const CourseJourneyMap = ({ modules, currentModuleIndex, onModuleClick }) => {
    return (
        <div className="journey-map">
            <div className="journey-track">
                {modules.map((module, index) => {
                    const isCompleted = index < currentModuleIndex;
                    const isCurrent = index === currentModuleIndex;
                    const isLocked = index > currentModuleIndex;

                    return (
                        <React.Fragment key={module.id}>
                            {/* Connector Line */}
                            {index > 0 && (
                                <div className={`journey-connector ${isCompleted ? 'completed' : ''}`} />
                            )}

                            {/* Module Node */}
                            <div
                                className={`journey-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`}
                                onClick={() => !isLocked && onModuleClick(index)}
                                title={module.title}
                            >
                                <div className="node-circle">
                                    {isCompleted && <CheckCircle size={20} />}
                                    {isCurrent && <PlayCircle size={20} />}
                                    {isLocked && <Lock size={16} />}
                                </div>
                                <div className="node-label">
                                    <span className="module-number">M{index + 1}</span>
                                    <span className="module-title">{module.title}</span>
                                </div>
                                {module.progress > 0 && module.progress < 100 && (
                                    <div className="node-progress">
                                        <div className="progress-ring">
                                            <svg viewBox="0 0 36 36">
                                                <path
                                                    className="progress-bg"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                />
                                                <path
                                                    className="progress-fill"
                                                    strokeDasharray={`${module.progress}, 100`}
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default CourseJourneyMap;
