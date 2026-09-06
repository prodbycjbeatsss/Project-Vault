import React, { useState } from 'react';
import { storage } from '../services/storage';
import { PLATFORM_INFO } from '../types/schema';
import { WORKFLOW_TASKS } from '../utils/templateEngine';
import PlatformIcon from '../components/PlatformIcon';
import TemplateEditorModal from '../components/TemplateEditorModal';
import { Plus, Edit2, Trash2, CopyCheck, Search } from 'lucide-react';
import '../styles/templates.css';

export default function TemplatesView() {
  const [templates, setTemplates] = useState(() => storage.getTemplates());
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const syncTemplates = () => {
    setTemplates(storage.getTemplates());
  };

  const handleCreateNew = () => {
    setTemplateToEdit(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (tpl) => {
    setTemplateToEdit(tpl);
    setIsEditorOpen(true);
  };

  const handleDelete = (tplId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      storage.deleteTemplate(tplId);
      syncTemplates();
    }
  };

  const handleSaveTemplate = (tpl) => {
    storage.saveTemplate(tpl);
    syncTemplates();
  };

  const filteredTemplates = templates.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      (t.tasks && t.tasks.some((task) => task.toLowerCase().includes(q))) ||
      t.body.toLowerCase().includes(q)
    );
  });

  return (
    <div className="templates-page-container">
      {/* Top Header Bar */}
      <div className="templates-top-bar">
        <div>
          <h1 className="templates-page-title">Templates</h1>
          <p className="templates-page-subtitle">
            Configure dynamic description and social caption blueprints with variable placeholders.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="templates-search-box">
            <Search size={14} className="templates-search-icon" />
            <input
              type="text"
              className="templates-search-input"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button type="button" className="btn-clay" onClick={handleCreateNew}>
            <Plus size={14} />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* Templates Grid matching Screenshot 1 */}
      <div className="templates-cards-grid">
        {filteredTemplates.map((tpl) => {
          // Resolve platform info for badges
          const tasks = tpl.tasks || [];
          const platforms = tpl.platforms || [];

          return (
            <div key={tpl.id} className="template-card" onClick={() => handleEdit(tpl)}>
              <div className="template-card-header">
                <h3 className="template-card-name">{tpl.name}</h3>
                <div className="template-card-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="template-icon-btn"
                    onClick={() => handleEdit(tpl)}
                    title="Edit template"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    type="button"
                    className="template-icon-btn delete"
                    onClick={() => handleDelete(tpl.id)}
                    title="Delete template"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Task / Platform Pills Row */}
              <div className="template-task-pills-row">
                {tasks.length > 0 ? (
                  tasks.map((taskName, idx) => {
                    const wtPlat = WORKFLOW_TASKS.find((wt) => wt.name === taskName)?.platform;
                    const matchedPlat = wtPlat || platforms[idx] || platforms[0] || 'youtube';
                    const info = PLATFORM_INFO[matchedPlat] || PLATFORM_INFO.other;
                    return (
                      <span
                        key={taskName}
                        className="template-task-pill"
                        style={{
                          background: info.bgColor,
                          color: info.color,
                          border: `1px solid ${info.borderColor}`
                        }}
                      >
                        <PlatformIcon platform={matchedPlat} size={11} />
                        <span>{taskName}</span>
                      </span>
                    );
                  })
                ) : (
                  platforms.map((plat) => {
                    const info = PLATFORM_INFO[plat] || PLATFORM_INFO.other;
                    return (
                      <span
                        key={plat}
                        className="template-task-pill"
                        style={{
                          background: info.bgColor,
                          color: info.color,
                          border: `1px solid ${info.borderColor}`
                        }}
                      >
                        <PlatformIcon platform={plat} size={11} />
                        <span>{info.name}</span>
                      </span>
                    );
                  })
                )}
              </div>

              {/* Template Body Preview */}
              <div className="template-body-preview">
                <pre className="template-preview-pre">{tpl.body}</pre>
              </div>
            </div>
          );
        })}
      </div>

      {/* Template Editor Modal */}
      <TemplateEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveTemplate}
        templateToEdit={templateToEdit}
      />
    </div>
  );
}
