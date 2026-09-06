import { INITIAL_PROJECTS, INITIAL_FOLDERS } from './seedData';
import { INITIAL_TEMPLATES } from '../utils/templateEngine';

const STORAGE_KEYS = {
  PROJECTS: 'projectvault_projects',
  FOLDERS: 'projectvault_folders',
  TAGS: 'projectvault_tags',
  TEMPLATES: 'projectvault_templates',
  USER_PROFILE: 'projectvault_user_profile'
};

export const DEFAULT_USER_PROFILE = {
  displayName: '',
  role: '',
  avatarUrl: '',
  bio: '',
  businessEmail: '',
  producerHandle: '',
  youtubeHandle: '',
  youtubeUrl: '',
  instagramHandle: '',
  instagramUrl: '',
  tiktokHandle: '',
  tiktokUrl: '',
  soundcloudHandle: '',
  soundcloudUrl: '',
  bandcampHandle: '',
  bandcampUrl: '',
  beatPlatformUrl: '',
  defaultHashtags: '',
  copyrightNotice: '',
  lastSyncedAt: null
};

class StorageService {
  constructor() {
    this.listeners = new Set();
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;
    const existingProj = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!existingProj || existingProj.includes('proj-001')) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify([]));
    }
    const existingFold = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    if (!existingFold || existingFold.includes('fold-1')) {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify([]));
    }
    const existingTpl = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (!existingTpl || !existingTpl.includes('Shorts #1: Instagram Reels, TikTok') || existingTpl.includes('SoundCloud Full Track')) {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(INITIAL_TEMPLATES));
    }
    const existingProf = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!existingProf || existingProf.includes('Producer Vault') || existingProf.includes('CJ The Producer') || existingProf.includes('@producer')) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_USER_PROFILE));
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  // --- Projects CRUD ---
  getProjects() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  }

  getProjectById(id) {
    const projects = this.getProjects();
    return projects.find((p) => p.id === id) || null;
  }

  saveProject(project) {
    const projects = this.getProjects();
    const existingIndex = projects.findIndex((p) => p.id === project.id);
    let updated;

    if (existingIndex >= 0) {
      updated = [...projects];
      updated[existingIndex] = {
        ...project,
        updatedAt: new Date().toISOString()
      };
    } else {
      const newProject = {
        ...project,
        id: project.id || `proj-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subContent: project.subContent || [],
        tasks: project.tasks || []
      };
      updated = [newProject, ...projects];
    }

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    this.notify();
    return updated;
  }

  deleteProject(id) {
    const projects = this.getProjects();
    const filtered = projects.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
    this.notify();
    return filtered;
  }

  // --- Sub-Content Operations ---
  addSubContent(projectId, subItem) {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return null;

    const newItem = {
      ...subItem,
      id: subItem.id || `sub-${Date.now()}`,
      projectId
    };

    project.subContent = [...(project.subContent || []), newItem];
    project.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    this.notify();
    return newItem;
  }

  updateSubContent(projectId, subItem) {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project || !project.subContent) return null;

    project.subContent = project.subContent.map((item) =>
      item.id === subItem.id ? { ...item, ...subItem } : item
    );
    project.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    this.notify();
    return subItem;
  }

  deleteSubContent(projectId, subContentId) {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project || !project.subContent) return null;

    project.subContent = project.subContent.filter((item) => item.id !== subContentId);
    project.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    this.notify();
  }

  // --- Tasks Operations ---
  toggleTask(projectId, taskId) {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project || !project.tasks) return null;

    project.tasks = project.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    this.notify();
  }

  addTask(projectId, task) {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return null;

    const newTask = {
      ...task,
      id: task.id || `t-${Date.now()}`,
      projectId,
      completed: false
    };

    project.tasks = [...(project.tasks || []), newTask];
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    this.notify();
    return newTask;
  }

  // --- Folders ---
  getFolders() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOLDERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveFolder(folder) {
    const folders = this.getFolders();
    const existingIndex = folders.findIndex((f) => f.id === folder.id);
    let updated;
    if (existingIndex >= 0) {
      const oldName = folders[existingIndex].name;
      updated = [...folders];
      updated[existingIndex] = {
        ...folders[existingIndex],
        ...folder
      };
      if (oldName && folder.name && oldName !== folder.name) {
        const projects = this.getProjects();
        const updatedProjects = projects.map((p) =>
          p.folder === oldName ? { ...p, folder: folder.name } : p
        );
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updatedProjects));
      }
    } else {
      const newFolder = {
        id: folder.id || `fold-${Date.now()}`,
        name: folder.name,
        icon: folder.icon || 'Folder',
        color: folder.color || 'lavender',
        itemCount: folder.itemCount || 0
      };
      updated = [...folders, newFolder];
    }
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(updated));
    this.notify();
    return updated;
  }

  deleteFolder(folderId) {
    const folders = this.getFolders();
    const targetFolder = folders.find((f) => f.id === folderId);
    const updated = folders.filter((f) => f.id !== folderId);
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(updated));
    if (targetFolder) {
      const projects = this.getProjects();
      const updatedProjects = projects.map((p) =>
        p.folder === targetFolder.name ? { ...p, folder: '' } : p
      );
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updatedProjects));
    }
    this.notify();
  }

  // --- Templates CRUD ---
  getTemplates() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      return data ? JSON.parse(data) : INITIAL_TEMPLATES;
    } catch {
      return INITIAL_TEMPLATES;
    }
  }

  saveTemplate(template) {
    const templates = this.getTemplates();
    const existingIndex = templates.findIndex((t) => t.id === template.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...templates];
      updated[existingIndex] = template;
    } else {
      updated = [template, ...templates];
    }
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(updated));
    this.notify();
    return template;
  }

  deleteTemplate(templateId) {
    const templates = this.getTemplates();
    const filtered = templates.filter((t) => t.id !== templateId);
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(filtered));
    this.notify();
  }

  // --- Aggregated Calendar View ---
  // --- Aggregated Calendar View ---
  getCalendarEvents() {
    const projects = this.getProjects();
    const events = [];

    projects.forEach((project) => {
      // Find if project already has a YouTube drop in its subContent checklist
      const youtubeSubItem = (project.subContent || []).find(
        (sub) => sub.platform === 'youtube' || (Array.isArray(sub.platforms) && sub.platforms.includes('youtube'))
      );

      // Standalone Main Video release event — only add if NOT already represented in the checklist pipeline
      if (!youtubeSubItem && project.mainVideo?.scheduledDate) {
        events.push({
          id: `ev-main-${project.mainVideo.id || project.id}`,
          projectId: project.id,
          projectTitle: project.title,
          title: project.mainVideo.title || `${project.title} (Main Video)`,
          type: 'main_video',
          platform: 'youtube',
          scheduledDate: project.mainVideo.scheduledDate,
          status: project.mainVideo.status || project.status || 'scheduled',
          badgeText: 'Main Video',
          color: '#FF0000'
        });
      }

      // Sub-content derivative drops
      if (project.subContent) {
        project.subContent.forEach((sub) => {
          const isYoutube = sub.platform === 'youtube' || (Array.isArray(sub.platforms) && sub.platforms.includes('youtube'));
          const dropDate = sub.scheduledDate || (isYoutube ? (project.mainVideo?.scheduledDate || project.releaseDate) : null);

          if (dropDate) {
            // For the main YouTube video, format title cleanly so generic "YouTube" or "YouTube Remix" doesn't look awkward
            let displayTitle = sub.title;
            const titleLower = (displayTitle || '').toLowerCase().trim();
            if (isYoutube && (!displayTitle || titleLower === 'youtube' || titleLower === 'youtube remix' || titleLower === 'main video')) {
              displayTitle = project.mainVideo?.title || (project.trackName ? `${project.trackName} (Main Track)` : `${project.title} (Main Track)`);
            }

            events.push({
              id: `ev-sub-${sub.id}`,
              projectId: project.id,
              projectTitle: project.title,
              title: displayTitle,
              type: isYoutube ? 'main_video' : 'sub_content',
              platform: sub.platform,
              scheduledDate: dropDate,
              status: sub.completed ? 'completed' : (sub.status || project.status || 'scheduled'),
              badgeText: isYoutube ? 'Main Video' : sub.platform.replace('_', ' ').toUpperCase(),
              timestamps: sub.clipTimestamps
            });
          }
        });
      }
    });

    return events.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  }

  // --- User Profile CRUD & Cloud Sync ---
  getUserProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? { ...DEFAULT_USER_PROFILE, ...JSON.parse(data) } : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  }

  saveUserProfile(profile) {
    const current = this.getUserProfile();
    const updated = {
      ...current,
      ...profile,
      updatedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
    } catch {}
    this.notify();
    return updated;
  }

  async syncCloudData() {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const current = this.getUserProfile();
    const updated = {
      ...current,
      lastSyncedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
    } catch {}
    this.notify();
    return { success: true, timestamp: updated.lastSyncedAt };
  }
}

export const storage = new StorageService();
