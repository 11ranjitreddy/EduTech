import React, { useState } from 'react';
import { Download, Settings, Moon, Sun, Bell, Smartphone, X } from 'lucide-react';
import './FloatingActions.css';

const FloatingActions = ({ onDarkModeToggle, isDarkMode = false }) => {
    const [isOpen, setIsOpen] = useState(false);

    const actions = [
        { id: 'download', icon: Download, label: 'Download Notes', onClick: () => alert('Downloading notes...') },
        { id: 'playback', icon: Settings, label: 'Playback Settings', onClick: () => alert('Playback settings...') },
        { id: 'darkmode', icon: isDarkMode ? Sun : Moon, label: isDarkMode ? 'Light Mode' : 'Dark Mode', onClick: onDarkModeToggle },
        { id: 'notifications', icon: Bell, label: 'Notifications', onClick: () => alert('Notifications...') },
        { id: 'mobile', icon: Smartphone, label: 'Mobile App', onClick: () => alert('Get mobile app...') }
    ];

    return (
        <div className={`floating-actions ${isOpen ? 'open' : ''}`}>
            {/* Action Buttons */}
            <div className="actions-list">
                {actions.map((action, index) => (
                    <button
                        key={action.id}
                        className="action-btn"
                        onClick={action.onClick}
                        style={{ transitionDelay: isOpen ? `${index * 50}ms` : '0ms' }}
                        title={action.label}
                    >
                        <action.icon size={20} />
                        <span className="action-label">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Toggle Button */}
            <button
                className="floating-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Settings size={24} />}
            </button>
        </div>
    );
};

export default FloatingActions;
