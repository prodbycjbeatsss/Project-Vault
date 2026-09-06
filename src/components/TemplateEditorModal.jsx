import React, { useState, useEffect, useRef } from 'react';
import { AVAILABLE_PLACEHOLDERS, WORKFLOW_TASKS } from '../utils/templateEngine';
import { PLATFORM_INFO } from '../types/schema';
import PlatformIcon from './PlatformIcon';
import { X, Code2, Check, Sparkles } from 'lucide-react';
import '../styles/templates.css';

export default function TemplateEditorModal({ isOpen, onClose, onSave, templateToEdit = null }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showPlaceholders, setShowPlaceholders] = useState(true);
  const [body, setBody] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (templateToEdit) {
      setName(templateToEdit.name || '');
      setSelectedTasks(templateToEdit.tasks || []);
      setBody(templateToEdit.body || '');
    } else {
      setName('');
      setSelectedTasks([WORKFLOW_TASKS[0]?.name || 'YouTube Remix']);
      setBody(`{{artist_name}} - {{track_name}} (Remix)
Produced by @prodbycjbeatsss

Stream / Free Download: {{link_youtube}}
Original Track: {{link_original_track}}

Follow @prodbycjbeatsss:
Instagram: {{url_instagram}}
TikTok: {{url_tiktok}}
SoundCloud: {{url_soundcloud}}

{{hashtags}}`);
    }
  }, [templateToEdit, isOpen]);

  const toggleTask = (taskName) => {
    setSelectedTasks((prev) => {
      if (prev.includes(taskName)) {
        if (prev.length === 1) return prev;
        return prev.filter((t) => t !== taskName);
      } else {
        return [...prev, taskName];
      }
    });
  };

  const handleInsertToken = (token) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setBody((prev) => `${prev} ${token}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = body;

    const updated = currentVal.substring(0, start) + token + currentVal.substring(end);
    setBody(updated);

    // Set cursor right after the inserted token
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + token.length, start + token.length);
    }, 10);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Determine platforms associated with selected tasks
    const matchedPlatforms = Array.from(
      new Set(
        WORKFLOW_TASKS.filter((wt) => selectedTasks.includes(wt.name))
          .map((wt) => wt.platform)
          .filter(Boolean)
      )
    );

    const updatedTemplate = {
      id: templateToEdit?.id || `tpl-${Date.now()}`,
      name: name.trim(),
      tasks: selectedTasks,
      platforms: matchedPlatforms.length > 0 ? matchedPlatforms : ['youtube'],
      body: body.trim()
    };

    onSave(updatedTemplate);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container template-editor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={17} color="var(--color-clay)" />
            <h3 className="modal-title">
              {templateToEdit ? 'Edit Template' : 'Create New Template'}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content-scroll">
          {/* Template Name */}
          <div className="form-group">
            <label className="form-label">TEMPLATE NAME</label>
            <input
              type="text"
              className="form-input template-name-input"
              required
              placeholder="e.g. YouTube Remix, Shorts/Reels/TikTok #1..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Assign to Tasks */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>ASSIGN TO TASKS ({selectedTasks.length} SELECTED)</span>
            </label>
            <div className="task-assignment-list">
              {WORKFLOW_TASKS.map((task, idx) => {
                const isSelected = selectedTasks.includes(task.name);
                const info = PLATFORM_INFO[task.platform] || PLATFORM_INFO.other;

                return (
                  <div
                    key={task.id}
                    className={`task-assignment-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleTask(task.name)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className={`task-checkbox ${isSelected ? 'checked' : ''}`}>
                        {isSelected && <Check size={11} strokeWidth={3} />}
                      </div>
                      <span className="task-index-num">{idx + 1}.</span>
                      <span className="task-name-text">{task.name}</span>
                    </div>

                    <span
                      className="task-platform-mini-badge"
                      style={{
                        background: info.bgColor,
                        color: info.color,
                        border: `1px solid ${info.borderColor}`
                      }}
                      title={info.name}
                    >
                      <PlatformIcon platform={task.platform} size={11} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Placeholders Drawer */}
          <div className="placeholders-section">
            <button
              type="button"
              className="toggle-placeholders-btn"
              onClick={() => setShowPlaceholders((prev) => !prev)}
            >
              <Code2 size={13} />
              <span>{showPlaceholders ? 'Hide available placeholders' : 'Show available placeholders'}</span>
            </button>

            {showPlaceholders && (
              <div className="placeholders-grid">
                {AVAILABLE_PLACEHOLDERS.map((p) => (
                  <button
                    type="button"
                    key={p.token}
                    className="placeholder-token-chip"
                    onClick={() => handleInsertToken(p.token)}
                    title={`Click to insert ${p.desc}`}
                  >
                    {p.token}
                  </button>
                ))}
              </div>
            )}
            <p className="placeholders-hint">Click a placeholder to insert it into the template body.</p>
          </div>

          {/* Template Body */}
          <div className="form-group">
            <label className="form-label">TEMPLATE BODY</label>
            <textarea
              ref={textareaRef}
              className="form-textarea template-body-editor"
              rows={8}
              required
              placeholder="Write your template text with {{placeholders}}..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" className="btn-main" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-clay">
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
