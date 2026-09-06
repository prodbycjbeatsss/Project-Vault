import React, { useState } from 'react';
import SubContentCard from './SubContentCard';
import NewSubContentModal from './NewSubContentModal';
import { X, Plus, ExternalLink, Music, Disc } from 'lucide-react';
import '../styles/projectDetail.css';

export default function ProjectDetailModal({ project, isOpen, onClose, onAddSubContent, onDeleteSubContent }) {
  if (!isOpen || !project) return null;

  const [isNewSubModalOpen, setIsNewSubModalOpen] = useState(false);

  const mainVid = project.mainVideo || {
    title: project.title,
    videoUrl: 'https://youtube.com',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    durationSeconds: 600,
    bpm: 85,
    musicalKey: 'C Minor'
  };

  const handleSaveSubContent = (item) => {
    onAddSubContent(project.id, item);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="modal-header">
            <div>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#6366f1', textTransform: 'uppercase' }}>
                {project.category || 'Production Campaign'}
              </span>
              <h2 className="modal-title" style={{ marginTop: '2px' }}>{project.title}</h2>
            </div>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>

          <div className="modal-content-scroll">
            <div className="project-inspector-layout">
              {/* Left Panel: Main Anchor Video */}
              <div className="main-asset-panel">
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                    Main Video & Audio Asset
                  </h3>
                  <div className="video-preview-card">
                    <img
                      src={mainVid.thumbnailUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'}
                      alt={mainVid.title}
                      className="video-preview-img"
                    />
                    <div className="video-badge-overlay">
                      <span>Anchor Asset (16:9)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{mainVid.title}</h4>
                  <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', lineHeight: 1.45 }}>
                    {mainVid.description || project.description}
                  </p>
                </div>

                {/* Producer Specs */}
                <div className="asset-specs-grid">
                  <div className="spec-box">
                    <div className="spec-label">Tempo / BPM</div>
                    <div className="spec-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Disc size={15} color="#6366f1" />
                      <span>{mainVid.bpm ? `${mainVid.bpm} BPM` : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="spec-box">
                    <div className="spec-label">Musical Key</div>
                    <div className="spec-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Music size={15} color="#6366f1" />
                      <span>{mainVid.musicalKey || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {mainVid.videoUrl && (
                  <a
                    href={mainVid.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      color: 'var(--color-clay)',
                      fontWeight: 600
                    }}
                  >
                    <span>Open Video Link</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>

              {/* Right Panel: Derived Sub-Content Pipeline */}
              <div className="subcontent-panel">
                <div className="subcontent-header-row">
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-anthropic-serif)', fontSize: '16px', fontWeight: 600, color: 'var(--color-slate-dark)' }}>
                      Sub-Content Derivatives ({project.subContent?.length || 0})
                    </h3>
                    <p style={{ fontFamily: 'var(--font-anthropic-sans)', fontSize: '12px', color: 'var(--color-cloud-dark)' }}>
                      Planned drops for Shorts, TikTok, Reels, SoundCloud & Bandcamp
                    </p>
                  </div>
                  <button
                    className="btn-clay"
                    onClick={() => setIsNewSubModalOpen(true)}
                  >
                    <Plus size={14} />
                    <span>Add Drop</span>
                  </button>
                </div>

                <div className="subcontent-list">
                  {!project.subContent || project.subContent.length === 0 ? (
                    <div
                      style={{
                        padding: '36px 16px',
                        textAlign: 'center',
                        borderRadius: '14px',
                        border: '1px dashed #cbd5e1',
                        color: '#64748b',
                        fontSize: '13px'
                      }}
                    >
                      No sub-content clips created yet. Click "+ Add Drop" to generate child clips from this video!
                    </div>
                  ) : (
                    project.subContent.map((sub) => (
                      <SubContentCard
                        key={sub.id}
                        item={sub}
                        onDelete={(id) => onDeleteSubContent(project.id, id)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Sub-Content Drop Creator */}
      <NewSubContentModal
        isOpen={isNewSubModalOpen}
        onClose={() => setIsNewSubModalOpen(false)}
        onSave={handleSaveSubContent}
        project={project}
      />
    </>
  );
}
