import React, { useState, useEffect } from 'react';
import FramedWindow from './components/FramedWindow';
import GlassSidebar from './components/GlassSidebar';
import HomeDashboardView from './pages/HomeDashboardView';
import ProjectsView from './pages/ProjectsView';
import CalendarView from './pages/CalendarView';
import PlaceholderView from './pages/PlaceholderView';
import ProjectDetailView from './pages/ProjectDetailView';
import TemplatesView from './pages/TemplatesView';
import ProfileView from './pages/ProfileView';
import { PLATFORMS } from './types/schema';
import { resolveTemplate } from './utils/templateEngine';
import { storage } from './services/storage';
import { useAuth } from './context/AuthContext';
import AuthGatewayView from './components/AuthGatewayView';
import './styles/global.css';

export default function App() {
  const { user, isGuest, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem('projectvault_active_tab') || 'dashboard';
    } catch {
      return 'dashboard';
    }
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('projectvault_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Data state
  const [projects, setProjects] = useState([]);
  const [folders, setFolders] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');

  // Active project screen state (persisted across page refreshes)
  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    try {
      return localStorage.getItem('projectvault_selected_project_id') || null;
    } catch {
      return null;
    }
  });
  const [selectedProject, setSelectedProject] = useState(null);

  // Load and subscribe to storage
  const syncData = () => {
    const projs = storage.getProjects();
    setProjects(projs);
    setFolders(storage.getFolders());
    setCalendarEvents(storage.getCalendarEvents());

    // Restore selectedProject from localStorage if available
    try {
      const pid = localStorage.getItem('projectvault_selected_project_id');
      if (pid) {
        const found = projs.find((p) => p.id === pid) || storage.getProjectById(pid);
        if (found) {
          setSelectedProject(found);
        } else {
          setSelectedProject(null);
          setSelectedProjectId(null);
          localStorage.removeItem('projectvault_selected_project_id');
        }
      }
    } catch {}
  };

  useEffect(() => {
    syncData();
    const unsubscribe = storage.subscribe(() => {
      syncData();
    });
    return unsubscribe;
  }, []);

  // Keyboard shortcut listener for ⌘F / Ctrl+F search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setIsSidebarCollapsed(false);
        setTimeout(() => {
          const searchInput = document.querySelector('.sidebar-search-field');
          if (searchInput) searchInput.focus();
        }, 50);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation & Project selection helpers
  const handleSelectProject = (proj) => {
    setSelectedProject(proj);
    const pid = proj?.id || null;
    setSelectedProjectId(pid);
    try {
      if (pid) {
        localStorage.setItem('projectvault_selected_project_id', pid);
      } else {
        localStorage.removeItem('projectvault_selected_project_id');
      }
    } catch {}
  };

  const handleSelectTab = (tabId) => {
    handleSelectProject(null);
    setActiveTab(tabId);
    try {
      localStorage.setItem('projectvault_active_tab', tabId);
    } catch {}
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('projectvault_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Handlers
  const handleCreateNewProject = () => {
    const newId = `proj-${Date.now()}`;
    const defaultFolder = folders[0]?.name || 'General';
    const targetDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    const newProj = {
      id: newId,
      title: 'Untitled Track',
      trackName: 'Untitled Track',
      artistName: '',
      folder: defaultFolder,
      bpm: 90,
      originalBpm: 90,
      releaseDate: new Date(targetDate).toISOString(),
      targetReleaseDate: new Date(targetDate).toISOString(),
      notes: '',
      description: '',
      mainHashtags: '',
      extraHashtags: '',
      tags: ['youtube', 'beats'],
      lyrics: {
        a: '',
        b: '',
        c: ''
      },
      links: {
        original: '',
        youtube: '',
        soundcloud: '',
        bandcamp: ''
      },
      mainVideo: {
        id: `vid-${Date.now()}`,
        title: 'Untitled Track (Main Track)',
        videoUrl: '',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        durationSeconds: 600,
        bpm: 90,
        description: '',
        scheduledDate: new Date(targetDate).toISOString()
      },
      subContent: [
        {
          id: `sub-${Date.now()}-1`,
          title: 'Main Video',
          platform: PLATFORMS.YOUTUBE,
          platforms: [PLATFORMS.YOUTUBE],
          templateId: 'tpl-1',
          description: resolveTemplate(
            storage.getTemplates().find((t) => t.id === 'tpl-1')?.body || '',
            { title: 'Untitled Track', artistName: '' }
          ),
          scheduledDate: new Date(targetDate).toISOString(),
          completed: false
        },
        {
          id: `sub-${Date.now()}-2`,
          title: 'Soundcloud Remix',
          platform: PLATFORMS.SOUNDCLOUD,
          platforms: [PLATFORMS.SOUNDCLOUD],
          templateId: 'tpl-2',
          description: resolveTemplate(
            storage.getTemplates().find((t) => t.id === 'tpl-2')?.body || '',
            { title: 'Untitled Track', artistName: '' }
          ),
          scheduledDate: new Date(targetDate).toISOString(),
          completed: false
        },
        {
          id: `sub-${Date.now()}-3`,
          title: 'Bandcamp Remix',
          platform: PLATFORMS.BANDCAMP,
          platforms: [PLATFORMS.BANDCAMP],
          templateId: 'tpl-3',
          description: resolveTemplate(
            storage.getTemplates().find((t) => t.id === 'tpl-3')?.body || '',
            { title: 'Untitled Track', artistName: '' }
          ),
          scheduledDate: new Date(targetDate).toISOString(),
          completed: false
        },
        {
          id: `sub-${Date.now()}-4`,
          title: 'Shorts #1',
          platform: PLATFORMS.YOUTUBE_SHORTS,
          platforms: [PLATFORMS.YOUTUBE_SHORTS],
          templateId: 'tpl-4',
          description: resolveTemplate(
            storage.getTemplates().find((t) => t.id === 'tpl-4')?.body || '',
            { title: 'Untitled Track', artistName: '' }
          ),
          scheduledDate: new Date(targetDate).toISOString(),
          completed: false
        },
        {
          id: `sub-${Date.now()}-5`,
          title: 'Shorts #1',
          platform: PLATFORMS.INSTAGRAM_REELS,
          platforms: [PLATFORMS.INSTAGRAM_REELS],
          templateId: 'tpl-5',
          description: resolveTemplate(
            storage.getTemplates().find((t) => t.id === 'tpl-5')?.body || '',
            { title: 'Untitled Track', artistName: '' }
          ),
          scheduledDate: new Date(targetDate).toISOString(),
          completed: false
        },
        {
          id: `sub-${Date.now()}-6`,
          title: 'Shorts #1',
          platform: PLATFORMS.TIKTOK,
          platforms: [PLATFORMS.TIKTOK],
          templateId: 'tpl-5',
          description: resolveTemplate(
            storage.getTemplates().find((t) => t.id === 'tpl-5')?.body || '',
            { title: 'Untitled Track', artistName: '' }
          ),
          scheduledDate: new Date(targetDate).toISOString(),
          completed: false
        }
      ],
      tasks: [
        { id: `t-1-${Date.now()}`, title: 'Draft hook and title concepts', completed: false, priority: 'high' }
      ]
    };

    storage.saveProject(newProj);
    handleSelectProject(newProj);
    setActiveTab('projects');
    try {
      localStorage.setItem('projectvault_active_tab', 'projects');
    } catch {}
  };

  const handleUpdateProject = (updatedProj) => {
    storage.saveProject(updatedProj);
    handleSelectProject(updatedProj);
  };

  const handleAddSubContent = (projectId, subItem) => {
    storage.addSubContent(projectId, subItem);
    handleSelectProject(storage.getProjectById(projectId));
  };

  const handleDeleteSubContent = (projectId, subId) => {
    storage.deleteSubContent(projectId, subId);
    handleSelectProject(storage.getProjectById(projectId));
  };

  const handleUpdateSubContent = (projectId, subItem) => {
    storage.updateSubContent(projectId, subItem);
    handleSelectProject(storage.getProjectById(projectId));
  };

  const handleToggleTask = (projectId, taskId) => {
    storage.toggleTask(projectId, taskId);
  };

  const handleAddTask = (projectId, task) => {
    storage.addTask(projectId, task);
  };

  const handleAddFolder = (folder) => {
    storage.saveFolder(folder);
  };

  const handleDeleteFolder = (folderId) => {
    storage.deleteFolder(folderId);
  };

  // Render view corresponding to activeTab or selectedProject screen
  const renderContentView = () => {
    if (selectedProject) {
      return (
        <ProjectDetailView
          project={selectedProject}
          folders={folders}
          onBack={() => handleSelectProject(null)}
          onUpdateProject={handleUpdateProject}
          onAddSubContent={handleAddSubContent}
          onUpdateSubContent={handleUpdateSubContent}
          onDeleteSubContent={handleDeleteSubContent}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <HomeDashboardView
            projects={projects}
            events={calendarEvents}
            onSelectProject={(proj) => handleSelectProject(proj)}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onNavigateToCalendar={() => handleSelectTab('calendar')}
            onNavigateToProjects={() => handleSelectTab('projects')}
          />
        );

      case 'projects':
        return (
          <ProjectsView
            projects={projects}
            folders={folders}
            onSelectProject={(proj) => handleSelectProject(proj)}
            onNewProjectClick={handleCreateNewProject}
            onAddFolder={handleAddFolder}
            onDeleteFolder={handleDeleteFolder}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            platformFilter={platformFilter}
          />
        );

      case 'calendar':
        return (
          <CalendarView
            events={calendarEvents}
            onSelectProjectById={(projId) => {
              const p = storage.getProjectById(projId);
              if (p) handleSelectProject(p);
            }}
          />
        );

      case 'templates':
        return <TemplatesView />;

      case 'tags':
        return (
          <PlaceholderView
            title="Tags & Metadata"
            category="Creative Assets"
            description="Manage global tags, genres, hashtags, and keywords across all video assets."
          />
        );

      case 'media':
        return (
          <PlaceholderView
            title="Media Vault"
            category="Creative Assets"
            description="Centralized library for thumbnails, cover art, stems, and vertical video exports."
          />
        );

      case 'analytics':
        return (
          <PlaceholderView
            title="Cross-Platform Analytics"
            category="Insights & Saved"
            description="Aggregate performance metrics across YouTube, TikTok, Instagram, and SoundCloud."
          />
        );

      case 'favourites':
        return (
          <PlaceholderView
            title="Favourites"
            category="Insights & Saved"
            description="Quick access to pinned campaigns, top-performing hooks, and frequent audio presets."
          />
        );

      case 'settings':
        return (
          <PlaceholderView
            title="Workspace Settings"
            category="Preferences"
            description="Configure Supabase/Firebase database connections, export defaults, and studio metadata."
          />
        );

      case 'profile':
        return <ProfileView />;

      default:
        return <div>View not found</div>;
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          backgroundColor: 'var(--surface-canvas)',
          color: 'var(--color-slate-dark)',
          fontFamily: 'var(--font-anthropic-serif)'
        }}
      >
        <div style={{ fontSize: '24px', fontWeight: 600 }}>ProjectVault</div>
        <div style={{ fontFamily: 'var(--font-anthropic-sans)', fontSize: '13px', color: 'var(--color-cloud-dark)' }}>
          Preparing your creator studio...
        </div>
      </div>
    );
  }

  if (!user && !isGuest) {
    return <AuthGatewayView />;
  }

  return (
    <FramedWindow>
      {/* Glassmorphic Frosted Sidebar with Search */}
      <GlassSidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        projectCount={projects.length}
        eventCount={calendarEvents.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Canvas (Starts at top of window) */}
      <main className="framed-main-canvas">
        {/* Scrollable Page Canvas */}
        <div className="canvas-content-scroll">
          {renderContentView()}
        </div>
      </main>
    </FramedWindow>
  );
}
