import React from 'react';
import { PLATFORM_INFO, PLATFORMS } from '../types/schema';
import { Clock } from 'lucide-react';
import '../styles/calendar.css';

const PLATFORM_COLOR_MAP = {
  [PLATFORMS.YOUTUBE]: 'platform-youtube',
  [PLATFORMS.YOUTUBE_SHORTS]: 'platform-youtube_shorts',
  [PLATFORMS.TIKTOK]: 'platform-tiktok',
  [PLATFORMS.INSTAGRAM_REELS]: 'platform-instagram_reels',
  [PLATFORMS.INSTAGRAM_POST]: 'platform-instagram_post',
  [PLATFORMS.SOUNDCLOUD]: 'platform-soundcloud',
  [PLATFORMS.BANDCAMP]: 'platform-bandcamp',
  [PLATFORMS.ORIGINAL]: 'platform-original',
  [PLATFORMS.OTHER]: 'platform-other'
};

export default function CalendarRow({ dayNumber, dayName, events = [], onSelectEvent }) {
  const isWeekend = dayName === 'Sat' || dayName === 'Sun';

  return (
    <div className="day-timeline-row">
      <div className="day-indicator-box">
        <span className="day-number">{dayNumber}</span>
        <span className="day-name">{dayName}</span>
      </div>

      <div className="day-events-track">
        {events.length === 0 ? (
          <span className="day-empty-label">{isWeekend ? 'Weekend' : 'No drops scheduled'}</span>
        ) : (
          events.map((ev, index) => {
            const platformKey = ev.platform || PLATFORMS.OTHER;
            const platformClass = PLATFORM_COLOR_MAP[platformKey] || `platform-${platformKey}`;
            const info = PLATFORM_INFO[platformKey] || PLATFORM_INFO[PLATFORMS.OTHER];
            const dateObj = new Date(ev.scheduledDate);
            const timeStr = isNaN(dateObj.getTime())
              ? '12:00 PM'
              : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={ev.id}
                className={`event-drop-card ${platformClass}`}
                onClick={() => onSelectEvent && onSelectEvent(ev)}
              >
                <div className="event-card-top">
                  <span
                    className="event-platform-pill"
                    style={{
                      color: info.color,
                      borderColor: info.borderColor || 'var(--color-stone)',
                      background: '#ffffff'
                    }}
                  >
                    {info.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} color="#64748b" />
                    <span className="event-time-pill">{timeStr}</span>
                  </div>
                </div>

                <div>
                  <h4 className="event-card-title">{ev.title}</h4>
                  <div className="event-parent-project">{ev.projectTitle}</div>
                </div>

                <div className="event-card-bottom">
                  <span className="event-status-pill">
                    {ev.status === 'in-progress' ? 'Active' : ev.status}
                  </span>
                  {ev.timestamps && (
                    <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>
                      {ev.timestamps.start} - {ev.timestamps.end}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
