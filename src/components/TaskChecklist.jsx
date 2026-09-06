import React, { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import '../styles/dashboard.css';

export default function TaskChecklist({ tasks = [], onToggleTask, onAddTask, projects = [] }) {
  const [newTitle, setNewTitle] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask(selectedProjectId || projects[0]?.id, {
      title: newTitle.trim(),
      priority: 'medium',
      dueDate: new Date().toISOString()
    });
    setNewTitle('');
  };

  return (
    <div className="task-items-list">
      {tasks.length === 0 ? (
        <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
          All production tasks are complete! 🎉
        </div>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="task-item-row"
            onClick={() => onToggleTask(task.projectId, task.id)}
          >
            <div className={`task-checkbox ${task.completed ? 'completed' : ''}`}>
              {task.completed && <Check size={12} strokeWidth={3} />}
            </div>

            <span className={`task-title-text ${task.completed ? 'completed' : ''}`}>
              {task.title}
            </span>

            {task.priority && (
              <span className={`task-priority-tag ${task.priority}`}>
                {task.priority}
              </span>
            )}
          </div>
        ))
      )}

      {/* Quick Add Inline */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <input
          type="text"
          placeholder="+ Add new task (e.g. Master stems for Bandcamp)..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '12.5px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
          }}
        />
        <button
          type="submit"
          className="btn-primary-action"
          style={{ padding: '8px 14px', fontSize: '12px' }}
        >
          <Plus size={14} />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
}
