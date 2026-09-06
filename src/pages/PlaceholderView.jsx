import React from 'react';
import { Sparkles } from 'lucide-react';

export default function PlaceholderView({ title, description, category }) {
  return (
    <div style={{ padding: '24px 0', maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {category || 'Section'}
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>{title}</h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>{description}</p>
      </div>

      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px dashed rgba(0, 0, 0, 0.12)',
          padding: '56px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6366f1'
          }}
        >
          <Sparkles size={24} />
        </div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>{title} Workspace Ready</div>
        <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '420px', lineHeight: 1.5 }}>
          This view is linked to the {title} module. Once you configure your custom settings or templates, they will appear right here.
        </p>
      </div>
    </div>
  );
}
