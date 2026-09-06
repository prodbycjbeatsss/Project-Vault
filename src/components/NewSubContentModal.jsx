import React, { useState, useEffect } from 'react';
import { PLATFORMS, PLATFORM_INFO } from '../types/schema';
import { storage } from '../services/storage';
import { resolveTemplate } from '../utils/templateEngine';
import PlatformIcon from './PlatformIcon';
import { X, Sparkles, FileText, Layers } from 'lucide-react';
import '../styles/projectDetail.css';

const AVAILABLE_PLATFORMS = [
  PLATFORMS.YOUTUBE_SHORTS,
  PLATFORMS.TIKTOK,
  PLATFORMS.INSTAGRAM_REELS,
  PLATFORMS.INSTAGRAM_POST,
  PLATFORMS.YOUTUBE,
  PLATFORMS.SOUNDCLOUD,
  PLATFORMS.BANDCAMP
];

export default function NewSubContentModal({ isOpen, onClose, onSave, project }) {
  if (!isOpen) return null;

  const templates = storage.getTemplates();
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([PLATFORMS.YOUTUBE_SHORTS]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);

  // Handle template selection
  const handleSelectTemplate = (e) => {
    const tplId = e.target.value;
    setSelectedTemplateId(tplId);
    if (!tplId) return;

    const tpl = templates.find((t) => t.id === tplId);
    if (tpl) {
      // 1. Resolve template body with project's live data
      const resolved = resolveTemplate(tpl.body, project);
      setDescription(resolved);

      // 2. Pre-fill title with clean video name if empty
      if (!title.trim() && tpl.name) {
        let cleanName = tpl.name;
        if (/shorts\s*#?1/i.test(cleanName)) cleanName = 'Shorts #1';
        else if (/shorts\s*#?2/i.test(cleanName)) cleanName = 'Shorts #2';
        else if (/shorts\s*#?3/i.test(cleanName)) cleanName = 'Shorts #3';
        else if (/youtube/i.test(cleanName)) cleanName = 'Main Video';
        else if (/soundcloud|bandcamp/i.test(cleanName)) cleanName = 'Full Track';
        setTitle(cleanName);
      }

      // 3. Pre-select template's matching platforms if available
      if (tpl.platforms && tpl.platforms.length > 0) {
        setSelectedPlatforms(tpl.platforms);
      }
    }
  };

  const togglePlatform = (plat) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(plat)) {
        if (prev.length === 1) return prev; // Keep at least one platform selected
        return prev.filter((p) => p !== plat);
      } else {
        return [...prev, plat];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const platformsToSave = selectedPlatforms.length > 0 ? selectedPlatforms : [PLATFORMS.YOUTUBE_SHORTS];
    const cleanTitle = title.trim();

    // When multiple platforms are selected, create separate entries so each can be independently tracked and scheduled
    if (platformsToSave.length > 1) {
      platformsToSave.forEach((plat, idx) => {
        onSave({
          id: `sub-${Date.now()}-${idx}`,
          platform: plat,
          platforms: [plat],
          title: cleanTitle,
          description: description.trim(),
          caption: description.trim(),
          templateId: selectedTemplateId || null,
          scheduledDate: releaseDate ? new Date(releaseDate).toISOString() : new Date().toISOString(),
          completed: false
        });
      });
    } else {
      onSave({
        id: `sub-${Date.now()}`,
        platform: platformsToSave[0],
        platforms: platformsToSave,
        title: cleanTitle,
        description: description.trim(),
        caption: description.trim(),
        templateId: selectedTemplateId || null,
        scheduledDate: releaseDate ? new Date(releaseDate).toISOString() : new Date().toISOString(),
        completed: false
      });
    }

    // Reset state for next open
    setTitle('');
    setDescription('');
    setSelectedTemplateId('');
    setSelectedPlatforms([PLATFORMS.YOUTUBE_SHORTS]);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={17} color="var(--color-clay)" />
            <h3 className="modal-title">Add Content Checklist Item</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content-scroll">
          {/* Template Preset Selector */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Template (Optional)</span>
              <span style={{ fontSize: '11px', color: 'var(--color-clay)', fontWeight: 600 }}>Auto-populates description</span>
            </label>
            <select
              className="form-input"
              value={selectedTemplateId}
              onChange={handleSelectTemplate}
              style={{ cursor: 'pointer' }}
            >
              <option value="">Select a template...</option>
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name}
                </option>
              ))}
            </select>
          </div>

          {/* Multi-Select Platform Pills */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Target Platforms (Multi-Select)</span>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                {selectedPlatforms.length > 1
                  ? `${selectedPlatforms.length} platforms (creates separate entries)`
                  : `${selectedPlatforms.length} selected`}
              </span>
            </label>
            <div className="subcontent-platform-pill-grid">
              {AVAILABLE_PLATFORMS.map((plat) => {
                const info = PLATFORM_INFO[plat] || PLATFORM_INFO.other;
                const isSelected = selectedPlatforms.includes(plat);

                return (
                  <button
                    type="button"
                    key={plat}
                    onClick={() => togglePlatform(plat)}
                    className={`subcontent-multi-pill ${isSelected ? 'active' : ''}`}
                    style={
                      isSelected
                        ? {
                            background: info.bgColor,
                            color: info.color,
                            borderColor: info.borderColor
                          }
                        : undefined
                    }
                  >
                    <PlatformIcon platform={plat} size={12} />
                    <span>{info.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Drop Title / Hook Concept</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Stop Mixing Your 808s Like This #shorts"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          {/* Description (Text entry / Template population) */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Description / Caption Copy</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {selectedTemplateId ? 'Template resolved with project metadata' : 'Editable text entry'}
              </span>
            </label>
            <textarea
              className="form-textarea"
              rows={5}
              placeholder="Enter post description, caption copy, hook notes, or call to action..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Release Date */}
          <div className="form-group">
            <label className="form-label">Planned Release Date</label>
            <input
              type="date"
              className="form-input"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button
              type="button"
              className="btn-main"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-clay">
              Add to Checklist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
