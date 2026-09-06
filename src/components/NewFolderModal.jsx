import React, { useState, useEffect } from 'react';
import {
  X,
  FolderPlus,
  Edit3,
  Folder,
  Music,
  Video,
  Package,
  Zap,
  Sparkles,
  Disc,
  Flame,
  Star,
  Tag,
  Headphones
} from 'lucide-react';
import '../styles/projectDetail.css';

const FOLDER_PALETTE = [
  { id: 'oat', name: 'Oat Warm', bg: '#e3dacc', border: '#cccbc8', text: '#141413' },
  { id: 'manilla', name: 'Rose Paper', bg: '#f6e3e3', border: '#eec5c5', text: '#141413' },
  { id: 'ivory', name: 'Ivory Light', bg: '#faf9f5', border: '#cccbc8', text: '#141413' },
  { id: 'terracotta', name: 'Terracotta Wash', bg: '#f7e6e0', border: '#eed0c5', text: '#141413' },
  { id: 'stone', name: 'Stone Plate', bg: '#eae7e1', border: '#cccbc8', text: '#141413' },
  { id: 'sage', name: 'Dusky Sage', bg: '#e5eae3', border: '#ced6cc', text: '#141413' }
];

const ICONS = [
  { id: 'Folder', icon: Folder },
  { id: 'Music', icon: Music },
  { id: 'Video', icon: Video },
  { id: 'Package', icon: Package },
  { id: 'Zap', icon: Zap },
  { id: 'Sparkles', icon: Sparkles },
  { id: 'Disc', icon: Disc },
  { id: 'Flame', icon: Flame },
  { id: 'Star', icon: Star },
  { id: 'Tag', icon: Tag },
  { id: 'Headphones', icon: Headphones }
];

export default function NewFolderModal({ isOpen, onClose, onSave, initialFolder = null }) {
  if (!isOpen) return null;

  const [name, setName] = useState(initialFolder?.name || '');
  const [selectedIcon, setSelectedIcon] = useState(initialFolder?.icon || 'Folder');
  const [selectedColor, setSelectedColor] = useState(initialFolder?.color || 'oat');

  useEffect(() => {
    if (initialFolder) {
      setName(initialFolder.name || '');
      setSelectedIcon(initialFolder.icon || 'Folder');
      setSelectedColor(initialFolder.color || 'oat');
    } else {
      setName('');
      setSelectedIcon('Folder');
      setSelectedColor('oat');
    }
  }, [initialFolder, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...(initialFolder || {}),
      name: name.trim(),
      icon: selectedIcon,
      color: selectedColor
    });
    setName('');
    onClose();
  };

  const isEdit = Boolean(initialFolder);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isEdit ? (
              <Edit3 size={18} color="var(--color-clay)" />
            ) : (
              <FolderPlus size={18} color="var(--color-clay)" />
            )}
            <h3 className="modal-title">{isEdit ? 'Edit Folder' : 'Create New Folder'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content-scroll">
          {/* Folder Name */}
          <div className="form-group">
            <label className="form-label">Folder Name</label>
            <input
              type="text"
              className="form-input"
              required
              autoFocus
              placeholder="e.g. YouTube Singles, Tutorials, BTS..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Folder Colour Palette */}
          <div className="form-group">
            <label className="form-label">Folder Colour</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {FOLDER_PALETTE.map((item) => {
                const isSelected = selectedColor === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelectedColor(item.id)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: item.bg,
                      border: isSelected ? '2px solid var(--color-slate-dark)' : `1px solid ${item.border}`,
                      boxShadow: isSelected ? '0 0 0 2px rgba(20, 20, 19, 0.2)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.12s ease'
                    }}
                    title={item.name}
                  >
                    {isSelected && (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-slate-dark)' }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon Selector */}
          <div className="form-group">
            <label className="form-label">Folder Icon</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
              {ICONS.map((item) => {
                const IconComp = item.icon;
                const isSelected = selectedIcon === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelectedIcon(item.id)}
                    style={{
                      height: '40px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid var(--color-slate-dark)' : '1px solid var(--color-stone)',
                      background: isSelected ? 'var(--surface-canvas)' : 'var(--surface-card-surface)',
                      color: isSelected ? 'var(--color-slate-dark)' : 'var(--color-cloud-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title={item.id}
                  >
                    <IconComp size={18} strokeWidth={isSelected ? 2.4 : 1.8} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button
              type="button"
              className="btn-main"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-clay">
              {isEdit ? 'Save Changes' : 'Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
