import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Edit3,
  Trash2,
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
import '../styles/projects.css';

const ICON_MAP = {
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
};

export default function FolderCard({ folder, onClick, onEdit, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const Icon = ICON_MAP[folder.icon] || Folder;

  // Close dropdown menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div
      className={`folder-tab-card ${folder.color || 'lavender'} ${isMenuOpen ? 'menu-active' : ''}`}
      onClick={onClick}
    >
      <div className="folder-top-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <Icon size={16} strokeWidth={2.2} style={{ flexShrink: 0 }} />
          <span className="folder-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {folder.name}
          </span>
        </div>

        {(onEdit || onDelete) && (
          <div className="folder-more-wrap" ref={menuRef}>
            <button
              className={`folder-more-btn ${isMenuOpen ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
              aria-label="Folder options"
              title="Folder options"
            >
              <MoreVertical size={15} />
            </button>

            {isMenuOpen && (
              <div className="folder-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                {onEdit && (
                  <button
                    type="button"
                    className="folder-dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onEdit(folder);
                    }}
                  >
                    <Edit3 size={13} strokeWidth={2.2} />
                    <span>Edit</span>
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    className="folder-dropdown-item delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onDelete(folder);
                    }}
                  >
                    <Trash2 size={13} strokeWidth={2.2} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="folder-bottom-row">
        <span className="folder-item-count">{folder.itemCount || 0} projects</span>
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            fontWeight: 700
          }}
        >
          PV
        </div>
      </div>
    </div>
  );
}
