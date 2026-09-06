import React from 'react';
import CalendarRow from '../components/CalendarRow';
import TaskChecklist from '../components/TaskChecklist';
import ProjectCard from '../components/ProjectCard';
import { FolderKanban, CalendarDays, CheckCircle2, Disc3 } from 'lucide-react';
import '../styles/dashboard.css';

export default function HomeDashboardView({
  projects = [],
  events = [],
  onSelectProject,
  onToggleTask,
  onAddTask,
  onNavigateToCalendar,
  onNavigateToProjects
}) {
  // Aggregate all tasks across projects
  const allTasks = [];
  projects.forEach((p) => {
    if (p.tasks) {
      p.tasks.forEach((t) => {
        allTasks.push({ ...t, projectId: p.id, projectTitle: p.title });
      });
    }
  });

  const pendingTasks = allTasks.filter((t) => !t.completed);
  const audioDrops = events.filter((e) => e.platform === 'soundcloud' || e.platform === 'bandcamp');

  // Next 5 upcoming events
  const now = new Date();
  const upcomingEvents = events
    .filter((e) => new Date(e.scheduledDate) >= new Date(now.getFullYear(), now.getMonth(), 1))
    .slice(0, 4);

  return (
    <div className="dashboard-grid">
      {/* Welcome Title */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-anthropic-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--color-slate-dark)', letterSpacing: '-0.4px' }}>
          Creator Studio Command Center
        </h1>
        <p style={{ fontFamily: 'var(--font-anthropic-sans)', fontSize: '14px', color: 'var(--color-cloud-dark)', marginTop: '4px' }}>
          Real-time pipeline of your main video campaigns, repurposing schedule, and production tasks.
        </p>
      </div>

      {/* Top Stats Metrics Row */}
      <div className="stats-cards-row">
        <div
          className="stat-card clickable-stat-card"
          onClick={onNavigateToProjects}
          title="View Active Campaigns in Projects"
        >
          <div className="stat-icon-box" style={{ background: 'var(--surface-canvas)', color: 'var(--color-slate-dark)' }}>
            <FolderKanban size={20} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Active Campaigns</span>
            <span className="stat-value">{projects.length}</span>
          </div>
        </div>

        <div
          className="stat-card clickable-stat-card"
          onClick={onNavigateToCalendar}
          title="View Content Calendar"
        >
          <div className="stat-icon-box" style={{ background: '#fbeee9', color: 'var(--color-clay)' }}>
            <CalendarDays size={20} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Scheduled Drops</span>
            <span className="stat-value">{events.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: '#fbeee9', color: 'var(--color-clay)' }}>
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Tasks To Complete</span>
            <span className="stat-value">{pendingTasks.length}</span>
          </div>
        </div>
      </div>

      {/* Dual Column: Upcoming Drops & Placeholder */}
      <div className="dashboard-dual-columns">
        {/* Left: Upcoming Drops */}
        <div className="dashboard-panel-card">
          <div className="panel-title-row">
            <h2 className="panel-title">Upcoming Drops & Releases</h2>
            <button className="panel-action-link" onClick={onNavigateToCalendar}>
              View Full Calendar →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {upcomingEvents.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>No scheduled drops this week.</p>
            ) : (
              upcomingEvents.map((ev) => {
                const dateObj = new Date(ev.scheduledDate);
                const dayNum = dateObj.getDate();
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

                return (
                  <CalendarRow
                    key={ev.id}
                    dayNumber={dayNum}
                    dayName={dayName}
                    events={[ev]}
                    onSelectEvent={(e) => onSelectProject(projects.find((p) => p.id === e.projectId))}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Right: Placeholder Card */}
        <div className="dashboard-panel-card">
          <div className="panel-title-row">
            <h2 className="panel-title">Production Notes</h2>
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px 20px',
              textAlign: 'center',
              background: 'var(--surface-warm-feature-surface)',
              borderRadius: 'var(--radius-cards)',
              border: '1px solid #eec5c5',
              minHeight: '220px'
            }}
          >
            <p style={{ fontFamily: 'var(--font-anthropic-serif)', fontSize: '16px', fontWeight: 600, color: 'var(--color-slate-dark)' }}>
              Placeholder card, coming soon
            </p>
            <p style={{ fontFamily: 'var(--font-anthropic-sans)', fontSize: '12.5px', color: 'var(--color-clay)', marginTop: '6px' }}>
              Field journal logs, studio presets, and automated script generator.
            </p>
          </div>
        </div>
      </div>

      {/* Active Workflows Spotlight */}
      <div>
        <div className="panel-title-row" style={{ marginBottom: '14px' }}>
          <h2 className="panel-title">Active Projects Spotlight</h2>
          <button className="panel-action-link" onClick={onNavigateToProjects}>
            View All Projects ({projects.length}) →
          </button>
        </div>

        <div className="projects-grid">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} onClick={onSelectProject} />
          ))}
        </div>
      </div>
    </div>
  );
}
