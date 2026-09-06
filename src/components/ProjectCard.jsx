import React from 'react';
import { Calendar } from 'lucide-react';
import { PLATFORM_INFO, PLATFORMS } from '../types/schema';
import PlatformIcon from './PlatformIcon';
import '../styles/projects.css';

export default function ProjectCard({ project, onClick }) {
  // Base content is always YouTube; additional platform badges appear only when sub-content is created
  const subContentPlatforms = (project.subContent || [])
    .flatMap((s) => (Array.isArray(s.platforms) ? s.platforms : [s.platform]))
    .filter(Boolean);

  const platformsUsed = Array.from(
    new Set([
      PLATFORMS.YOUTUBE,
      ...subContentPlatforms
    ])
  );

  const bannerImg =
    project.thumbnailUrl ||
    project.mainVideo?.thumbnailUrl ||
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80';

  const formatReleaseDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const releaseDateFormatted = formatReleaseDate(project.releaseDate || project.targetReleaseDate);

  return (
    <div className="project-card" onClick={() => onClick(project)}>
      {/* Banner with Cutout Tab Badge (Kept as single primary status) */}
      <div className="project-banner-box">
        <img src={bannerImg} alt={project.title} className="project-banner-img" />
        <div className="cutout-tab-badge">
          <span className="cutout-dot" />
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>
            {project.status === 'in-progress' ? 'Active' : project.status}
          </span>
        </div>
      </div>

      <div className="project-card-body">
        <h3 className="project-card-title">
          {project.artistName
            ? `${project.artistName} // ${project.trackName || project.title}`
            : (project.trackName || project.title)}
        </h3>

        {/* Release Date */}
        <div className="project-card-date-row">
          <Calendar size={12} className="project-date-icon" />
          <span>Release: {releaseDateFormatted}</span>
        </div>

        {/* Footer with platform badges */}
        <div className="project-card-footer">
          <div className="platform-pill-row">
            {platformsUsed.slice(0, 4).map((plat) => {
              const info = PLATFORM_INFO[plat] || PLATFORM_INFO.other;
              return (
                <span
                  key={plat}
                  className="platform-icon-pill"
                  style={{
                    background: info.bgColor,
                    color: info.color,
                    border: `1px solid ${info.borderColor}`
                  }}
                  title={info.name}
                >
                  <PlatformIcon platform={plat} size={11} />
                  <span>{info.name}</span>
                </span>
              );
            })}
            {platformsUsed.length > 4 && (
              <span className="platform-icon-pill" style={{ background: '#f1f5f9', color: '#64748b' }}>
                +{platformsUsed.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
