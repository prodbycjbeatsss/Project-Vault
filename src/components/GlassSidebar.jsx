import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CalendarDays,
  CopyCheck,
  Tag,
  Image,
  BarChart3,
  Star,
  Settings,
  PanelLeftClose,
  PanelLeft,
  AudioWaveform,
  Search,
  LogOut,
  LogIn,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import '../styles/sidebar.css';

export default function GlassSidebar({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  projectCount = 0,
  eventCount = 0,
  searchQuery = '',
  onSearchChange
}) {
  const navSections = [
    {
      title: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Home / Dashboard', icon: LayoutDashboard },
        { id: 'projects', label: 'Projects', icon: FolderKanban, badge: projectCount > 0 ? projectCount : null },
        { id: 'calendar', label: 'Content Calendar', icon: CalendarDays, badge: eventCount > 0 ? eventCount : null }
      ]
    },
    {
      title: 'Creative Assets',
      items: [
        { id: 'templates', label: 'Templates', icon: CopyCheck },
        { id: 'tags', label: 'Tags', icon: Tag },
        { id: 'media', label: 'Media', icon: Image }
      ]
    },
    {
      title: 'Insights & Saved',
      items: [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'favourites', label: 'Favourites', icon: Star }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  const { user, isGuest, signOut } = useAuth();
  const [userProfile, setUserProfile] = React.useState(() => storage.getUserProfile());

  React.useEffect(() => {
    const unsub = storage.subscribe(() => {
      setUserProfile(storage.getUserProfile());
    });
    return unsub;
  }, []);

  const displayName = userProfile.displayName
    ? userProfile.displayName
    : user
    ? (user.user_metadata?.full_name || user.email?.split('@')[0] || 'Studio Creator')
    : isGuest
    ? 'Guest Creator'
    : 'Studio Creator';

  const displayRole = userProfile.role
    ? userProfile.role
    : user
    ? (user.email || 'Studio Account')
    : isGuest
    ? 'Guest Preview • Click to Sign In'
    : 'Studio Account';

  const avatarUrl = userProfile.avatarUrl || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '';

  return (
    <aside className={`glass-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-wrapper">
          <div
            className="brand-icon-box"
            onClick={isCollapsed ? onToggleCollapse : undefined}
            title={isCollapsed ? 'Expand sidebar' : 'ProjectVault'}
          >
            <AudioWaveform size={20} strokeWidth={2.4} />
          </div>
          {!isCollapsed && (
            <div className="brand-title-box">
              <span className="brand-name">ProjectVault</span>
              <span className="brand-tagline">Studio & Creator Suite</span>
            </div>
          )}
        </div>
        <button
          className="collapse-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Search Input below title */}
      <div className="sidebar-search-wrap">
        <div
          className={`sidebar-search-box ${isCollapsed ? 'collapsed' : ''}`}
          onClick={isCollapsed ? onToggleCollapse : undefined}
          title={isCollapsed ? 'Search projects' : undefined}
        >
          <Search size={15} className="sidebar-search-icon" />
          {!isCollapsed && (
            <input
              type="text"
              className="sidebar-search-field"
              placeholder="Search projects, clips..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            />
          )}
        </div>
      </div>

      {/* Navigation Group Sections */}
      <div className="sidebar-nav-scroll">
        {navSections.map((section, idx) => (
          <div key={section.title} className="nav-group">
            {idx > 0 && <div className="nav-divider" />}
            <div className="nav-group-header">{section.title}</div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-item-btn ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectTab(item.id)}
                  title={item.label}
                >
                  <span className="nav-item-icon">
                    <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                  </span>
                  <span className="nav-item-label">{item.label}</span>
                  {item.badge && <span className="nav-item-badge">{item.badge}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Profile Footer Card */}
      <div className="sidebar-footer">
        <div className="user-profile-row">
          <div
            className={`user-profile-card ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => onSelectTab('profile')}
            title={user ? `Signed in as ${displayName}` : 'Account Settings'}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Creator Avatar"
                className="user-avatar"
              />
            ) : (
              <div className="user-avatar-placeholder">
                {displayName ? displayName.charAt(0).toUpperCase() : <User size={15} />}
              </div>
            )}
            <div className="user-details">
              <span className="user-name">{displayName}</span>
              <span className="user-role">{displayRole}</span>
            </div>
          </div>
          {!isCollapsed && (
            <button
              type="button"
              className="sidebar-logout-btn"
              onClick={signOut}
              title={isGuest ? 'Exit Guest Mode & Sign In' : 'Sign out'}
              aria-label={isGuest ? 'Sign in' : 'Sign out'}
            >
              {isGuest ? <LogIn size={15} /> : <LogOut size={15} />}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
