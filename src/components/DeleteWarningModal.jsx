import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import '../styles/projectDetail.css';

export default function DeleteWarningModal({ isOpen, onClose, onConfirm, folder }) {
  if (!isOpen || !folder) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-lg)',
                background: '#fbeee9',
                color: 'var(--color-clay-deep)',
                border: '1px solid #f2c7ba',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <h3 className="modal-title" style={{ fontSize: '17px' }}>Delete Folder?</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <p style={{ fontSize: '14px', color: 'var(--color-slate-dark)', lineHeight: 1.5, fontFamily: 'var(--font-anthropic-sans)' }}>
            Are you sure you want to delete <strong>"{folder.name}"</strong>?
          </p>
          <p style={{ fontSize: '13px', color: 'var(--color-cloud-dark)', marginTop: '6px', lineHeight: 1.4, fontFamily: 'var(--font-anthropic-sans)' }}>
            Any projects currently in this folder will not be deleted, but will become unassigned.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '24px'
            }}
          >
            <button
              type="button"
              className="btn-main"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-clay"
              style={{ background: 'var(--color-clay-deep)' }}
              onClick={() => {
                onConfirm(folder.id);
                onClose();
              }}
            >
              Delete Folder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
