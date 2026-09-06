import React from 'react';
import { Search } from 'lucide-react';
import '../styles/topbar.css';

export default function TopBar({ searchQuery, onSearchChange }) {
  return (
    <header className="topbar-container">
      <div className="search-input-wrapper">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="search-field"
          placeholder="Search projects, clips, tracks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </header>
  );
}
