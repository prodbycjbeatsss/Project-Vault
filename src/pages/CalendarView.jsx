import React, { useState } from 'react';
import CalendarRow from '../components/CalendarRow';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import '../styles/calendar.css';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function CalendarView({ events = [], onSelectProjectById }) {
  // Current month default to September (index 8) matching our 2026-09 seed dates
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(8);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [filterPlatform, setFilterPlatform] = useState('all');

  // Days in selected month
  const daysInMonth = new Date(selectedYear, selectedMonthIdx + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Group events by day of month
  const eventsByDay = {};
  events.forEach((ev) => {
    const d = new Date(ev.scheduledDate);
    if (!isNaN(d.getTime()) && d.getMonth() === selectedMonthIdx && d.getFullYear() === selectedYear) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      if (filterPlatform === 'all' || ev.platform === filterPlatform) {
        eventsByDay[day].push(ev);
      }
    }
  });

  return (
    <div className="calendar-page">
      {/* Header */}
      <div className="calendar-page-header">
        <h1 className="calendar-page-title">Content Release Calendar</h1>
        <p className="calendar-page-subtitle">
          Plan, schedule, and track multi-platform drops derived from your anchor videos.
        </p>
      </div>

      {/* Inspo 1 Month Switcher Bar */}
      <div className="month-switcher-bar">
        <div className="month-pills-container">
          <button
            className="month-nav-arrow"
            onClick={() => setSelectedMonthIdx((prev) => (prev > 0 ? prev - 1 : 11))}
            title="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>

          {MONTHS.map((month, idx) => (
            <button
              key={month}
              className={`month-pill-btn ${selectedMonthIdx === idx ? 'active' : ''}`}
              onClick={() => setSelectedMonthIdx(idx)}
            >
              {month}
            </button>
          ))}

          <button
            className="month-nav-arrow"
            onClick={() => setSelectedMonthIdx((prev) => (prev < 11 ? prev + 1 : 0))}
            title="Next Month"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Filter Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="filter-pill"
            onClick={() => {
              const next = filterPlatform === 'all' ? 'youtube_shorts' : filterPlatform === 'youtube_shorts' ? 'tiktok' : filterPlatform === 'tiktok' ? 'soundcloud' : 'all';
              setFilterPlatform(next);
            }}
          >
            <SlidersHorizontal size={14} />
            <span>Platform: {filterPlatform === 'all' ? 'All' : filterPlatform.replace('_', ' ')}</span>
          </button>
        </div>
      </div>

      {/* Inspo 1 Day-by-Day Timeline */}
      <div className="timeline-schedule-container">
        {daysArray.map((day) => {
          const dateObj = new Date(selectedYear, selectedMonthIdx, day);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const dayEvents = eventsByDay[day] || [];

          return (
            <CalendarRow
              key={day}
              dayNumber={day}
              dayName={dayName}
              events={dayEvents}
              onSelectEvent={(ev) => onSelectProjectById(ev.projectId)}
            />
          );
        })}
      </div>
    </div>
  );
}
