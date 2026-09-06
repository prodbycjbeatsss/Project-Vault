import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import '../styles/projectDetail.css';

export default function NewProjectModal({ isOpen, onClose, onSave, folders = [] }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Beat Breakdown & Release');
  const [folder, setFolder] = useState(folders[0]?.name || 'Music Releases');
  const [targetReleaseDate, setTargetReleaseDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [tags, setTags] = useState('lofi, youtube, beats');

  // Main video details
  const [videoUrl, setVideoUrl] = useState('');
  const [bpm, setBpm] = useState(90);
  const [musicalKey, setMusicalKey] = useState('C Minor');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProj = {
      id: `proj-${Date.now()}`,
      title,
      description,
      category,
      folder,
      status: 'planning',
      targetReleaseDate: new Date(targetReleaseDate).toISOString(),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      mainVideo: {
        id: `vid-${Date.now()}`,
        title: `${title} (Main Video)`,
        videoUrl: videoUrl || 'https://youtube.com',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        durationSeconds: 600,
        bpm: Number(bpm) || null,
        musicalKey,
        description,
        scheduledDate: new Date(targetReleaseDate).toISOString(),
        status: 'ideation'
      },
      subContent: [],
      tasks: [
        { id: `t-1-${Date.now()}`, title: 'Draft hook and title concepts', completed: false, priority: 'high' },
        { id: `t-2-${Date.now()}`, title: 'Render vertical short-form teaser', completed: false, priority: 'medium' }
      ]
    };

    onSave(newProj);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderPlus size={20} color="var(--color-clay)" />
            <h3 className="modal-title">Create New Production Campaign</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content-scroll">
          <div className="form-group">
            <label className="form-label">Project Title</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Summer Beat Tape Breakdown Ep. 2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description & Concept</label>
            <textarea
              className="form-textarea"
              placeholder="What is this video/release about? What is the core hook?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Category / Workflow</label>
              <input
                type="text"
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Folder Assignment</label>
              {folders.length > 0 ? (
                <select
                  className="form-select"
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                >
                  {folders.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. General, Music Releases..."
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Target Release Date</label>
              <input
                type="date"
                className="form-input"
                value={targetReleaseDate}
                onChange={(e) => setTargetReleaseDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                className="form-input"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          {/* Producer Audio & Main Video metadata */}
          <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', marginTop: '6px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
              Anchor Asset Specs (YouTube & Producer Info)
            </div>
            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label className="form-label">Video URL (or unlisted link)</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>
            <div className="form-row-2">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">BPM</label>
                <input
                  type="number"
                  className="form-input"
                  value={bpm}
                  onChange={(e) => setBpm(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Musical Key</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. F# Minor"
                  value={musicalKey}
                  onChange={(e) => setMusicalKey(e.target.value)}
                />
              </div>
            </div>
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
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
