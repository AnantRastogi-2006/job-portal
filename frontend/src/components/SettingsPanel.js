import React from 'react';
import { X } from 'lucide-react';

export default function SettingsPanel({ darkMode, setDarkMode, fontSize, setFontSize, onClose }) {
  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-settings" onClick={onClose}>
          <X size={18} />
        </button>
        <h2>Appearance Settings</h2>

        <div className="settings-group">
          <label>Theme</label>
          <div className="settings-options">
            <button className={`option-btn ${!darkMode ? 'active' : ''}`} onClick={() => setDarkMode(false)}>
              Light
            </button>
            <button className={`option-btn ${darkMode ? 'active' : ''}`} onClick={() => setDarkMode(true)}>
              Dark
            </button>
          </div>
        </div>

        <div className="settings-group">
          <label>Font Size</label>
          <div className="settings-options">
            {['small', 'normal', 'large'].map((size) => (
              <button
                key={size}
                className={`option-btn ${fontSize === size ? 'active' : ''}`}
                onClick={() => setFontSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
