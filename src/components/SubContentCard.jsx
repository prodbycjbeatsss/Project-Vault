import React, { useState, useRef, useEffect } from 'react';
import { PLATFORM_INFO, PLATFORMS } from '../types/schema';
import PlatformIcon from './PlatformIcon';
import { Check, Copy, RotateCw, Trash2, ChevronDown, Calendar, FileText, GripVertical, Pencil } from 'lucide-react';
import '../styles/projectDetail.css';


export default function SubContentCard({
  item,
  index,
  onDelete,
  onToggle,
  onRefresh,
  onUpdateTitle,
  onUpdateDate,
  isOutdated = false,
  isDragging = false,
  isDragOver = false,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState('');
  const inputRef = useRef(null);
  const dateInputRef = useRef(null);

  // Normalize platforms array
  const platforms = Array.isArray(item.platforms) && item.platforms.length > 0
    ? item.platforms
    : [item.platform || PLATFORMS.YOUTUBE_SHORTS];

  const handleCopy = (e) => {
    e.stopPropagation();
    const textToCopy = item.description || item.caption || item.title || '';
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleRefresh = (e) => {
    e.stopPropagation();
    if (onRefresh) {
      setIsRefreshing(true);
      onRefresh(item.id);
      setTimeout(() => {
        setIsRefreshing(false);
      }, 600);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete checklist drop "${item.title}"?`)) {
      if (onDelete) onDelete(item.id);
    }
  };

  const handleToggleCheck = (e) => {
    e.stopPropagation();
    if (onToggle) {
      onToggle(item.id, !item.completed);
    }
  };

  // Format scheduled date if valid
  const formattedDate = item.scheduledDate
    ? (() => {
        try {
          const d = new Date(item.scheduledDate);
          if (isNaN(d.getTime())) return null;
          return d.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          });
        } catch {
          return null;
        }
      })()
    : null;

  // Raw YYYY-MM-DD value for <input type="date">
  const rawDateValue = (() => {
    if (!item.scheduledDate) return '';
    try {
      const d = new Date(item.scheduledDate);
      if (isNaN(d.getTime())) return '';
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    } catch {
      return '';
    }
  })();

  const handleOpenDatePicker = (e) => {
    e.stopPropagation();
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === 'function') {
        try {
          dateInputRef.current.showPicker();
          return;
        } catch (err) {
          // Fallback if showPicker throws
        }
      }
      dateInputRef.current.focus();
    }
  };

  const handleDateChange = (e) => {
    e.stopPropagation();
    const val = e.target.value;
    if (val) {
      const [year, month, day] = val.split('-').map(Number);
      const d = new Date(year, month - 1, day, 12, 0, 0);
      if (onUpdateDate) {
        onUpdateDate(item.id, d.toISOString());
      }
    } else {
      if (onUpdateDate) {
        onUpdateDate(item.id, null);
      }
    }
  };

  const handleClearDate = (e) => {
    e.stopPropagation();
    if (onUpdateDate) {
      onUpdateDate(item.id, null);
    }
  };

  const descriptionText = item.description || item.caption || '';
  const cleanTitle = item.title?.trim() || 'Untitled Drop';

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleStartEditing = (e) => {
    e.stopPropagation();
    setEditTitleValue(item.title || '');
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    const trimmed = editTitleValue.trim();
    setIsEditingTitle(false);
    if (trimmed && trimmed !== item.title) {
      if (onUpdateTitle) {
        onUpdateTitle(item.id, trimmed);
      }
    }
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setEditTitleValue(item.title || '');
    }
  };

  return (
    <div
      className={`checklist-item-card ${item.completed ? 'is-completed' : ''} ${isExpanded ? 'is-expanded' : ''} ${isDragging ? 'is-dragging' : ''} ${isDragOver ? 'is-drag-over' : ''}`}
      draggable={!isEditingTitle}
      onDragStart={(e) => !isEditingTitle && onDragStart && onDragStart(e, index)}
      onDragOver={(e) => onDragOver && onDragOver(e, index)}
      onDragEnd={onDragEnd}
      onDrop={(e) => onDrop && onDrop(e, index)}
    >
      {/* Primary Checklist Row */}
      <div className="checklist-row-main" onClick={() => setIsExpanded((prev) => !prev)}>
        {/* Left: Drag Handle, Checkbox, Platform Icons, Title */}
        <div className="checklist-left-group">
          {/* Drag Handle */}
          <div
            className="checklist-drag-handle"
            title="Drag to rearrange checklist item"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={14} />
          </div>

          <button
            type="button"
            className={`checklist-checkbox-btn ${item.completed ? 'checked' : ''}`}
            onClick={handleToggleCheck}
            aria-label={item.completed ? 'Mark pending' : 'Mark completed'}
          >
            {item.completed && <Check size={11} strokeWidth={3} />}
          </button>

          {/* Platform Pills — Icon Only for Clean Alignment */}
          <div className="checklist-platform-pills">
            {platforms.map((plat) => {
              const info = PLATFORM_INFO[plat] || PLATFORM_INFO.other;
              return (
                <span
                  key={plat}
                  className="checklist-platform-pill"
                  style={{
                    background: info.bgColor,
                    color: info.color,
                    border: `1px solid ${info.borderColor}`
                  }}
                  title={info.name}
                >
                  <PlatformIcon platform={plat} size={12} />
                </span>
              );
            })}
          </div>

          {/* Drop Title / Inline Edit */}
          {isEditingTitle ? (
            <input
              ref={inputRef}
              type="text"
              className="checklist-title-input"
              value={editTitleValue}
              onChange={(e) => setEditTitleValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveTitle}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              draggable={false}
              aria-label="Edit checklist item title"
            />
          ) : (
            <div
              className="checklist-title-wrapper"
              onClick={handleStartEditing}
              title="Click to rename drop"
            >
              <span className={`checklist-title-text ${item.completed ? 'completed' : ''}`}>
                {cleanTitle}
              </span>
              <button
                type="button"
                className="checklist-title-edit-icon"
                onClick={handleStartEditing}
                title="Rename drop"
                aria-label="Rename drop"
              >
                <Pencil size={11} />
              </button>
            </div>
          )}
        </div>

        {/* Right: Date, Copy, Refresh, Delete, Chevron */}
        <div className="checklist-right-group">
          {/* Scheduled Date Picker Tag */}
          <div className="checklist-date-tag-wrapper">
            <button
              type="button"
              className={`checklist-date-tag ${!formattedDate ? 'empty' : ''}`}
              onClick={handleOpenDatePicker}
              title={formattedDate ? `Scheduled: ${formattedDate} (click to change)` : 'Click to schedule drop date'}
            >
              <Calendar size={11} />
              <span>{formattedDate || '+ Date'}</span>
            </button>
            {formattedDate && (
              <button
                type="button"
                className="checklist-date-clear-btn"
                onClick={handleClearDate}
                title="Clear scheduled date"
                aria-label="Clear scheduled date"
              >
                ×
              </button>
            )}
            <input
              ref={dateInputRef}
              type="date"
              className="checklist-date-hidden-input"
              value={rawDateValue}
              onChange={handleDateChange}
              onClick={(e) => e.stopPropagation()}
              aria-label="Edit scheduled date"
            />
          </div>

          {/* Action Button: Copy */}
          <button
            type="button"
            className={`checklist-action-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title={copied ? 'Copied to clipboard!' : 'Copy description / caption'}
          >
            {copied ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
          </button>

          {/* Action Button: Refresh Description (Template Integration) */}
          <button
            type="button"
            className={`checklist-action-btn refresh-btn ${isRefreshing ? 'spinning' : ''} ${isOutdated ? 'outdated' : ''}`}
            onClick={handleRefresh}
            title={
              isRefreshing
                ? 'Refreshing description...'
                : isOutdated
                ? 'Description out of date with project — click to refresh'
                : 'Refresh description with latest project info'
            }
          >
            <RotateCw size={13} className={isRefreshing ? 'spin-anim' : ''} />
            {isOutdated && <span className="refresh-outdated-dot" />}
          </button>

          {/* Action Button: Delete */}
          <button
            type="button"
            className="checklist-action-btn delete-btn"
            onClick={handleDelete}
            title="Delete checklist item"
          >
            <Trash2 size={13} />
          </button>

          {/* Minimal Chevron */}
          <button
            type="button"
            className="checklist-action-btn chevron-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded((prev) => !prev);
            }}
            title={isExpanded ? 'Minimize' : 'Expand'}
          >
            <ChevronDown size={14} className={`checklist-chevron-icon ${isExpanded ? 'open' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expandable Drawer for Description */}
      {isExpanded && (
        <div className="checklist-drawer-content">
          <div className="checklist-drawer-header">
            <span className="checklist-drawer-label">
              <FileText size={12} />
              <span>Description & Caption Blueprint</span>
            </span>
            {descriptionText && (
              <button
                type="button"
                className="checklist-drawer-copy-btn"
                onClick={handleCopy}
              >
                {copied ? <Check size={11} style={{ color: '#10b981' }} /> : <Copy size={11} />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            )}
          </div>
          {descriptionText ? (
            <div className="checklist-drawer-body">
              <p className="checklist-drawer-text">{descriptionText}</p>
            </div>
          ) : (
            <div className="checklist-drawer-empty">
              <span>No description copy entered for this drop.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
