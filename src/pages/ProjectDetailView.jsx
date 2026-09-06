import React, { useState, useEffect, useRef } from 'react';
import SubContentCard from '../components/SubContentCard';
import NewSubContentModal from '../components/NewSubContentModal';
import PlatformIcon from '../components/PlatformIcon';
import { PLATFORMS, PLATFORM_INFO } from '../types/schema';
import { resolveTemplate, findMatchingTemplate } from '../utils/templateEngine';
import { storage } from '../services/storage';
import {
  ArrowLeft,
  Plus,
  ExternalLink,
  Check,
  Disc,
  Music,
  FolderKanban,
  Calendar,
  Tag,
  Hash,
  FileText,
  Mic2,
  Globe,
  Radio,
  Copy,
  Layers,
  Video,
  ChevronDown,
  Upload,
  AlertCircle,
  RotateCw,
  Trash2
} from 'lucide-react';
import '../styles/projectDetail.css';

const SECTION_STORAGE_KEY = 'projectvault_collapsed_sections';

const getInitialSectionState = (sectionKey, projectId, defaultValue = true) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(SECTION_STORAGE_KEY);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);

    // 1. Check project-specific preference
    if (projectId && parsed.projects?.[projectId] && typeof parsed.projects[projectId][sectionKey] === 'boolean') {
      return parsed.projects[projectId][sectionKey];
    }
    // 2. Check general preference
    if (parsed.general && typeof parsed.general[sectionKey] === 'boolean') {
      return parsed.general[sectionKey];
    }
    // 3. Flat fallback
    if (typeof parsed[sectionKey] === 'boolean') {
      return parsed[sectionKey];
    }
    return defaultValue;
  } catch (err) {
    return defaultValue;
  }
};

const saveSectionState = (sectionKey, isOpen, projectId) => {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(SECTION_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : { general: {}, projects: {} };

    if (!parsed.general) parsed.general = {};
    if (!parsed.projects) parsed.projects = {};

    parsed.general[sectionKey] = isOpen;
    parsed[sectionKey] = isOpen;

    if (projectId) {
      if (!parsed.projects[projectId]) parsed.projects[projectId] = {};
      parsed.projects[projectId][sectionKey] = isOpen;
    }

    localStorage.setItem(SECTION_STORAGE_KEY, JSON.stringify(parsed));
  } catch (err) {
    console.warn('Error saving section state to localStorage:', err);
  }
};

export default function ProjectDetailView({
  project,
  folders = [],
  onBack,
  onUpdateProject,
  onAddSubContent,
  onUpdateSubContent,
  onDeleteSubContent
}) {
  if (!project) return null;

  // 1. Core Project Metadata
  const [artistName, setArtistName] = useState(project.artistName || '');
  const [trackName, setTrackName] = useState(project.trackName || project.title || '');
  const [folder, setFolder] = useState(project.folder || (folders[0]?.name || 'General'));
  const [bpm, setBpm] = useState(project.bpm ?? project.mainVideo?.bpm ?? 90);
  const [originalBpm, setOriginalBpm] = useState(project.originalBpm ?? 90);
  const [releaseDate, setReleaseDate] = useState(
    project.releaseDate
      ? project.releaseDate.split('T')[0]
      : project.targetReleaseDate
      ? project.targetReleaseDate.split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState(project.notes || project.description || '');
  const [mainHashtags, setMainHashtags] = useState(project.mainHashtags || '');
  const [extraHashtags, setExtraHashtags] = useState(project.extraHashtags || '');
  const [tags, setTags] = useState(
    Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || '')
  );

  // 2. Lyrics Snippets
  const [lyricsA, setLyricsA] = useState(project.lyrics?.a || project.lyricsA || '');
  const [lyricsB, setLyricsB] = useState(project.lyrics?.b || project.lyricsB || '');
  const [lyricsC, setLyricsC] = useState(project.lyrics?.c || project.lyricsC || '');

  // 3. Platform Links
  const [originalTrackLink, setOriginalTrackLink] = useState(
    project.links?.original || project.originalTrackLink || ''
  );
  const [youtubeLink, setYoutubeLink] = useState(
    project.links?.youtube || project.youtubeLink || project.mainVideo?.videoUrl || ''
  );
  const [soundcloudLink, setSoundcloudLink] = useState(
    project.links?.soundcloud || project.soundcloudLink || ''
  );
  const [bandcampLink, setBandcampLink] = useState(
    project.links?.bandcamp || project.bandcampLink || ''
  );

  // Collapsible section states (persisted in localStorage across page refreshes)
  const [isMetadataOpen, setIsMetadataOpen] = useState(() =>
    getInitialSectionState('metadata', project?.id, true)
  );
  const [isLyricsOpen, setIsLyricsOpen] = useState(() =>
    getInitialSectionState('lyrics', project?.id, true)
  );
  const [isLinksOpen, setIsLinksOpen] = useState(() =>
    getInitialSectionState('links', project?.id, true)
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(() =>
    getInitialSectionState('preview', project?.id, true)
  );
  const [isContentOpen, setIsContentOpen] = useState(() =>
    getInitialSectionState('content', project?.id, true)
  );

  const toggleSection = (sectionKey, setter) => {
    setter((prev) => {
      const next = !prev;
      saveSectionState(sectionKey, next, project?.id);
      return next;
    });
  };

  // Sync section states when switching projects
  useEffect(() => {
    if (project?.id) {
      setIsMetadataOpen(getInitialSectionState('metadata', project.id, true));
      setIsLyricsOpen(getInitialSectionState('lyrics', project.id, true));
      setIsLinksOpen(getInitialSectionState('links', project.id, true));
      setIsPreviewOpen(getInitialSectionState('preview', project.id, true));
      setIsContentOpen(getInitialSectionState('content', project.id, true));
    }
  }, [project?.id]);

  // YouTube Thumbnail Mockup & Upload state
  const [thumbnailUrl, setThumbnailUrl] = useState(
    project.thumbnailUrl || project.mainVideo?.thumbnailUrl || null
  );
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const fileInputRef = useRef(null);

  // Sub-content modal & UI state
  const [isNewSubModalOpen, setIsNewSubModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saving' | 'saved'
  const [copiedKey, setCopiedKey] = useState(null);
  const saveTimeoutRef = useRef(null);

  // Section completion checks
  const isMetadataComplete = Boolean(
    String(artistName || '').trim() &&
    String(trackName || '').trim() &&
    String(folder || '').trim() &&
    String(releaseDate || '').trim() &&
    bpm !== '' && bpm !== null && bpm !== undefined &&
    originalBpm !== '' && originalBpm !== null && originalBpm !== undefined &&
    String(notes || '').trim() &&
    String(mainHashtags || '').trim() &&
    String(extraHashtags || '').trim() &&
    String(tags || '').trim()
  );

  const isLyricsComplete = Boolean(
    String(lyricsA || '').trim() &&
    String(lyricsB || '').trim() &&
    String(lyricsC || '').trim()
  );

  const isLinksComplete = Boolean(
    String(originalTrackLink || '').trim() &&
    String(youtubeLink || '').trim() &&
    String(soundcloudLink || '').trim() &&
    String(bandcampLink || '').trim()
  );

  // Preview is complete when thumbnail is present and valid without errors
  const isPreviewComplete = Boolean(thumbnailUrl && !uploadError);

  // Content Descriptions & Checklist is complete when items/drops exist
  const isSubContentComplete = Boolean(Array.isArray(project.subContent) && project.subContent.length > 0);

  // Sync state if project changes from outside
  useEffect(() => {
    setArtistName(project.artistName || '');
    setTrackName(project.trackName || project.title || '');
    setFolder(project.folder || (folders[0]?.name || 'General'));
    setBpm(project.bpm ?? project.mainVideo?.bpm ?? 90);
    setOriginalBpm(project.originalBpm ?? 90);
    setReleaseDate(
      project.releaseDate
        ? project.releaseDate.split('T')[0]
        : project.targetReleaseDate
        ? project.targetReleaseDate.split('T')[0]
        : new Date().toISOString().split('T')[0]
    );
    setNotes(project.notes || project.description || '');
    setMainHashtags(project.mainHashtags || '');
    setExtraHashtags(project.extraHashtags || '');
    setTags(Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || ''));
    setLyricsA(project.lyrics?.a || project.lyricsA || '');
    setLyricsB(project.lyrics?.b || project.lyricsB || '');
    setLyricsC(project.lyrics?.c || project.lyricsC || '');
    setOriginalTrackLink(project.links?.original || project.originalTrackLink || '');
    setYoutubeLink(project.links?.youtube || project.youtubeLink || project.mainVideo?.videoUrl || '');
    setSoundcloudLink(project.links?.soundcloud || project.soundcloudLink || '');
    setBandcampLink(project.links?.bandcamp || project.bandcampLink || '');
    setThumbnailUrl(project.thumbnailUrl || project.mainVideo?.thumbnailUrl || null);
    setUploadError(null);
    setUploadSuccess(null);
  }, [project.id]);

  // Debounced auto-save handler
  const triggerAutoSave = (overrides = {}) => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      const currentTrackName = overrides.trackName !== undefined ? overrides.trackName : trackName;
      const currentReleaseDate = overrides.releaseDate !== undefined ? overrides.releaseDate : releaseDate;
      const currentBpm = overrides.bpm !== undefined ? overrides.bpm : bpm;
      const currentNotes = overrides.notes !== undefined ? overrides.notes : notes;
      const currentYtLink = overrides.youtubeLink !== undefined ? overrides.youtubeLink : youtubeLink;

      const releaseIso = (() => {
        if (!currentReleaseDate) return new Date().toISOString();
        if (currentReleaseDate.includes('T')) return currentReleaseDate;
        const [y, m, d] = currentReleaseDate.split('-').map(Number);
        if (y && m && d) {
          return new Date(y, m - 1, d, 12, 0, 0).toISOString();
        }
        return new Date(currentReleaseDate).toISOString();
      })();

      const updatedProject = {
        ...project,
        title: currentTrackName || 'Untitled Track',
        trackName: currentTrackName,
        artistName: overrides.artistName !== undefined ? overrides.artistName : artistName,
        folder: overrides.folder !== undefined ? overrides.folder : folder,
        bpm: currentBpm !== '' ? Number(currentBpm) : null,
        originalBpm: overrides.originalBpm !== undefined && overrides.originalBpm !== '' ? Number(overrides.originalBpm) : null,
        releaseDate: releaseIso,
        targetReleaseDate: releaseIso,
        notes: currentNotes,
        description: currentNotes,
        mainHashtags: overrides.mainHashtags !== undefined ? overrides.mainHashtags : mainHashtags,
        extraHashtags: overrides.extraHashtags !== undefined ? overrides.extraHashtags : extraHashtags,
        tags: (overrides.tags !== undefined ? overrides.tags : tags)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        lyrics: {
          a: overrides.lyricsA !== undefined ? overrides.lyricsA : lyricsA,
          b: overrides.lyricsB !== undefined ? overrides.lyricsB : lyricsB,
          c: overrides.lyricsC !== undefined ? overrides.lyricsC : lyricsC
        },
        links: {
          original: overrides.originalTrackLink !== undefined ? overrides.originalTrackLink : originalTrackLink,
          youtube: currentYtLink,
          soundcloud: overrides.soundcloudLink !== undefined ? overrides.soundcloudLink : soundcloudLink,
          bandcamp: overrides.bandcampLink !== undefined ? overrides.bandcampLink : bandcampLink
        },
        thumbnailUrl: overrides.thumbnailUrl !== undefined ? overrides.thumbnailUrl : (thumbnailUrl || project.mainVideo?.thumbnailUrl || ''),
        mainVideo: {
          ...project.mainVideo,
          id: project.mainVideo?.id || `vid-${Date.now()}`,
          title: `${currentTrackName} (Main Track)`,
          videoUrl: currentYtLink || project.mainVideo?.videoUrl || '',
          thumbnailUrl: overrides.thumbnailUrl !== undefined ? overrides.thumbnailUrl : (thumbnailUrl || project.mainVideo?.thumbnailUrl || ''),
          durationSeconds: project.mainVideo?.durationSeconds || 600,
          bpm: currentBpm !== '' ? Number(currentBpm) : null,
          description: currentNotes,
          scheduledDate: releaseIso
        },
        subContent: (project.subContent || []).map((sub) => {
          const isYt = sub.platform === 'youtube' || (Array.isArray(sub.platforms) && sub.platforms.includes('youtube'));
          if (isYt) {
            return { ...sub, scheduledDate: releaseIso };
          }
          return sub;
        })
      };

      onUpdateProject(updatedProject);
      setSaveStatus('saved');
    }, 400);
  };

  // YouTube Thumbnail file upload validation handler
  const handleFileSelect = (file) => {
    if (!file) return;
    setUploadError(null);
    setUploadSuccess(null);

    // 1. Format validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Unsupported format. YouTube guidelines require JPG, PNG, WEBP, or GIF.');
      return;
    }

    // 2. Size validation (YouTube strictly enforces under 2MB)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setUploadError(`File is ${sizeMB}MB. YouTube guidelines strictly require custom thumbnails to be under 2MB.`);
      return;
    }

    // 3. Resolution & dimension check
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target.result;
      const img = new Image();
      img.onload = () => {
        if (img.width < 640) {
          setUploadError(`Image width is ${img.width}px. YouTube requires a minimum resolution of 640px width.`);
          return;
        }

        // Passed all YouTube guidelines
        setThumbnailUrl(dataUrl);
        setUploadSuccess(`Thumbnail uploaded (${img.width}×${img.height}px, ${(file.size / 1024).toFixed(0)}KB)`);
        triggerAutoSave({ thumbnailUrl: dataUrl });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleResetThumbnail = () => {
    setThumbnailUrl(null);
    setUploadError(null);
    setUploadSuccess(null);
    triggerAutoSave({ thumbnailUrl: '' });
  };

  const handleCopySnippet = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleSaveSubContent = (item) => {
    onAddSubContent(project.id, item);
  };

  const handleToggleSubContent = (subId, completed) => {
    if (onUpdateSubContent) {
      const item = (project.subContent || []).find((s) => s.id === subId);
      if (item) {
        onUpdateSubContent(project.id, { ...item, completed });
        return;
      }
    }
    const updated = (project.subContent || []).map((s) =>
      s.id === subId ? { ...s, completed } : s
    );
    onUpdateProject({ ...project, subContent: updated });
  };

  const handleUpdateSubContentTitle = (subId, newTitle) => {
    const item = (project.subContent || []).find((s) => s.id === subId);
    const isYoutube = item && (item.platform === 'youtube' || (Array.isArray(item.platforms) && item.platforms.includes('youtube')));

    const updatedSub = (project.subContent || []).map((s) =>
      s.id === subId ? { ...s, title: newTitle } : s
    );

    const updatedProject = {
      ...project,
      subContent: updatedSub,
      ...(isYoutube && project.mainVideo ? {
        mainVideo: {
          ...project.mainVideo,
          title: newTitle
        }
      } : {})
    };

    onUpdateProject(updatedProject);
    storage.saveProject(updatedProject);
  };

  const handleUpdateSubContentDate = (subId, newDate) => {
    const item = (project.subContent || []).find((s) => s.id === subId);
    const isYoutube = item && (item.platform === 'youtube' || (Array.isArray(item.platforms) && item.platforms.includes('youtube')));

    const updatedSub = (project.subContent || []).map((s) =>
      s.id === subId ? { ...s, scheduledDate: newDate } : s
    );

    const updatedProject = {
      ...project,
      subContent: updatedSub,
      ...(isYoutube && newDate ? {
        releaseDate: newDate,
        targetReleaseDate: newDate,
        mainVideo: {
          ...project.mainVideo,
          scheduledDate: newDate
        }
      } : {})
    };

    if (isYoutube && newDate) {
      setReleaseDate(newDate.split('T')[0]);
    }

    onUpdateProject(updatedProject);
    storage.saveProject(updatedProject);
  };

  // Drag-and-drop reordering for subcontent checklist items
  const [draggedSubIndex, setDraggedSubIndex] = useState(null);
  const [dragOverSubIndex, setDragOverSubIndex] = useState(null);

  const handleSubDragStart = (e, index) => {
    setDraggedSubIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleSubDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverSubIndex !== index) {
      setDragOverSubIndex(index);
    }
  };

  const handleSubDragEnd = () => {
    setDraggedSubIndex(null);
    setDragOverSubIndex(null);
  };

  const handleSubDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedSubIndex === null || draggedSubIndex === targetIndex) {
      handleSubDragEnd();
      return;
    }

    const items = [...(project.subContent || [])];
    const [movedItem] = items.splice(draggedSubIndex, 1);
    items.splice(targetIndex, 0, movedItem);

    const updated = {
      ...project,
      subContent: items
    };

    onUpdateProject(updated);
    storage.saveProject(updated);
    handleSubDragEnd();
  };

  const liveProjectState = {
    ...project,
    artistName,
    trackName,
    folder,
    bpm,
    originalBpm,
    releaseDate,
    notes,
    mainHashtags,
    extraHashtags,
    tags,
    lyrics: { a: lyricsA, b: lyricsB, c: lyricsC },
    links: {
      original: originalTrackLink,
      youtube: youtubeLink,
      soundcloud: soundcloudLink,
      bandcamp: bandcampLink
    },
    originalTrackLink,
    youtubeLink,
    soundcloudLink,
    bandcampLink
  };

  const templatesList = storage.getTemplates();
  const outdatedItems = (project.subContent || []).filter((item) => {
    const matchedTemplate = findMatchingTemplate(item, templatesList);
    if (!matchedTemplate || !matchedTemplate.body) return false;
    const expectedDesc = resolveTemplate(matchedTemplate.body, liveProjectState).trim();
    const currentDesc = (item.description || item.caption || '').trim();
    return expectedDesc && currentDesc !== expectedDesc;
  });
  const outdatedIds = new Set(outdatedItems.map((item) => item.id));

  const [isRefreshingAll, setIsRefreshingAll] = useState(false);

  const handleRefreshAllSubContent = () => {
    if (!project.subContent || project.subContent.length === 0) return;
    setIsRefreshingAll(true);
    const tpls = storage.getTemplates();

    const updatedSub = project.subContent.map((item) => {
      const matchedTemplate = findMatchingTemplate(item, tpls);
      if (!matchedTemplate || !matchedTemplate.body) return item;
      const refreshedDesc = resolveTemplate(matchedTemplate.body, liveProjectState);
      return {
        ...item,
        description: refreshedDesc,
        caption: refreshedDesc
      };
    });

    onUpdateProject({ ...project, subContent: updatedSub });

    setTimeout(() => {
      setIsRefreshingAll(false);
    }, 600);
  };

  const handleRefreshSubContent = (subId) => {
    const item = (project.subContent || []).find((s) => s.id === subId);
    if (!item) return;

    const tpls = storage.getTemplates();
    const matchedTemplate = findMatchingTemplate(item, tpls);

    if (matchedTemplate && matchedTemplate.body) {
      const refreshedDesc = resolveTemplate(matchedTemplate.body, liveProjectState);
      const updatedItem = {
        ...item,
        description: refreshedDesc,
        caption: refreshedDesc
      };

      if (onUpdateSubContent) {
        onUpdateSubContent(project.id, updatedItem);
      } else {
        const updatedSub = (project.subContent || []).map((s) =>
          s.id === subId ? updatedItem : s
        );
        onUpdateProject({ ...project, subContent: updatedSub });
      }
    }
  };

  return (
    <div className="project-detail-screen">
      {/* Top Navigation Bar */}
      <div className="project-detail-topbar">
        <div className="topbar-left">
          <button className="btn-back" onClick={onBack} title="Back to Projects">
            <ArrowLeft size={16} />
            <span>Projects</span>
          </button>
          <span className="breadcrumb-slash">/</span>
          <span className="breadcrumb-folder">{folder}</span>
          <span className="breadcrumb-slash">/</span>
          <span className="breadcrumb-title">
            {artistName ? `${artistName} — ${trackName || 'Untitled'}` : (trackName || 'Untitled')}
          </span>
        </div>

        <div className="topbar-right">
          <div className="save-indicator">
            <Check size={13} className="save-icon" />
            <span>{saveStatus === 'saving' ? 'Saving...' : 'All changes saved'}</span>
          </div>
          <span className="status-pill status-planning">{folder}</span>
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="project-split-container">
        {/* =========================================
            LEFT COLUMN: Complete Metadata Editor
            ========================================= */}
        <div className="metadata-column">
          {/* Section 1: Project Metadata */}
          <div className="column-card">
            <div
              className="column-card-header collapsible-header"
              onClick={() => toggleSection('metadata', setIsMetadataOpen)}
            >
              <div>
                <div className="section-eyebrow">
                  <FileText size={13} />
                  <span>Track Details</span>
                </div>
                <h2 className="column-title">Project Metadata</h2>
                <p className="column-subtitle">
                  Primary artist credentials, release classification, and tempo details.
                </p>
              </div>

              <div className="header-actions">
                {isMetadataComplete && (
                  <div className="section-complete-badge" title="All fields completed">
                    <Check size={12} strokeWidth={2.8} />
                    <span>Complete</span>
                  </div>
                )}
                <button
                  type="button"
                  className="btn-collapse"
                  aria-label={isMetadataOpen ? 'Collapse section' : 'Expand section'}
                >
                  <ChevronDown
                    size={17}
                    className={`collapse-chevron ${isMetadataOpen ? 'open' : ''}`}
                  />
                </button>
              </div>
            </div>

            {isMetadataOpen && (
              <div className="metadata-form">
                {/* Artist Name & Track Name Row */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Artist Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Monte Booker, Sango, J Dilla"
                      value={artistName}
                      onChange={(e) => {
                        setArtistName(e.target.value);
                        triggerAutoSave({ artistName: e.target.value });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Track Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Midnight Tape Flip #4"
                      value={trackName}
                      onChange={(e) => {
                        setTrackName(e.target.value);
                        triggerAutoSave({ trackName: e.target.value });
                      }}
                    />
                  </div>
                </div>

                {/* Release Folder & Release Date */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Release Folder</label>
                    {folders.length > 0 ? (
                      <select
                        className="form-select"
                        value={folder}
                        onChange={(e) => {
                          setFolder(e.target.value);
                          triggerAutoSave({ folder: e.target.value });
                        }}
                      >
                        {folders.map((f) => (
                          <option key={f.id} value={f.name}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="form-input"
                        value={folder}
                        onChange={(e) => {
                          setFolder(e.target.value);
                          triggerAutoSave({ folder: e.target.value });
                        }}
                      />
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Release Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={releaseDate}
                      onChange={(e) => {
                        setReleaseDate(e.target.value);
                        triggerAutoSave({ releaseDate: e.target.value });
                      }}
                    />
                  </div>
                </div>

                {/* BPM & Original BPM */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">BPM</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 94"
                      value={bpm}
                      onChange={(e) => {
                        setBpm(e.target.value);
                        triggerAutoSave({ bpm: e.target.value });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Original BPM</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 88 (sample original)"
                      value={originalBpm}
                      onChange={(e) => {
                        setOriginalBpm(e.target.value);
                        triggerAutoSave({ originalBpm: e.target.value });
                      }}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Key production notes, sample clearance remarks, mixing reminders, or release concept..."
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      triggerAutoSave({ notes: e.target.value });
                    }}
                  />
                </div>

                {/* 3 Main Hashtags */}
                <div className="form-group">
                  <label className="form-label">3 Main Hashtags</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="#lofi #beats #producer"
                    value={mainHashtags}
                    onChange={(e) => {
                      setMainHashtags(e.target.value);
                      triggerAutoSave({ mainHashtags: e.target.value });
                    }}
                  />
                </div>

                {/* Extra Hashtags (Expanded Textarea) */}
                <div className="form-group">
                  <label className="form-label">Extra Hashtags</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="#chillhop #sp404 #boombap #sampleflip #beatmaker #instudio #ambient #synthwave #instrumentals"
                    value={extraHashtags}
                    onChange={(e) => {
                      setExtraHashtags(e.target.value);
                      triggerAutoSave({ extraHashtags: e.target.value });
                    }}
                  />
                </div>

                {/* Tags */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="sample breakdown, beat tape, fl studio, youtube"
                    value={tags}
                    onChange={(e) => {
                      setTags(e.target.value);
                      triggerAutoSave({ tags: e.target.value });
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Lyrics Snippets */}
          <div className="column-card">
            <div
              className="column-card-header collapsible-header"
              onClick={() => toggleSection('lyrics', setIsLyricsOpen)}
            >
              <div>
                <div className="section-eyebrow">
                  <Mic2 size={13} />
                  <span>Vocal & Clip Quotes</span>
                </div>
                <h2 className="column-title">Lyrics Snippets</h2>
                <p className="column-subtitle">
                  Key memorable bars or quotes ready for on-screen captions and short-form video hooks.
                </p>
              </div>

              <div className="header-actions">
                {isLyricsComplete && (
                  <div className="section-complete-badge" title="All 3 lyrics snippets completed">
                    <Check size={12} strokeWidth={2.8} />
                    <span>Complete</span>
                  </div>
                )}
                <button
                  type="button"
                  className="btn-collapse"
                  aria-label={isLyricsOpen ? 'Collapse section' : 'Expand section'}
                >
                  <ChevronDown
                    size={17}
                    className={`collapse-chevron ${isLyricsOpen ? 'open' : ''}`}
                  />
                </button>
              </div>
            </div>

            {isLyricsOpen && (
              <div className="lyrics-snippets-list">
                <div className="form-group">
                  <div className="lyrics-label-row">
                    <label className="form-label">Lyrics A</label>
                    {lyricsA && (
                      <button
                        type="button"
                        className="btn-copy-snippet"
                        onClick={() => handleCopySnippet(lyricsA, 'A')}
                        title="Copy to clipboard"
                      >
                        {copiedKey === 'A' ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedKey === 'A' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Paste lyric snippet A here..."
                    value={lyricsA}
                    onChange={(e) => {
                      setLyricsA(e.target.value);
                      triggerAutoSave({ lyricsA: e.target.value });
                    }}
                  />
                </div>

                <div className="form-group">
                  <div className="lyrics-label-row">
                    <label className="form-label">Lyrics B</label>
                    {lyricsB && (
                      <button
                        type="button"
                        className="btn-copy-snippet"
                        onClick={() => handleCopySnippet(lyricsB, 'B')}
                        title="Copy to clipboard"
                      >
                        {copiedKey === 'B' ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedKey === 'B' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Paste lyric snippet B here..."
                    value={lyricsB}
                    onChange={(e) => {
                      setLyricsB(e.target.value);
                      triggerAutoSave({ lyricsB: e.target.value });
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <div className="lyrics-label-row">
                    <label className="form-label">Lyrics C</label>
                    {lyricsC && (
                      <button
                        type="button"
                        className="btn-copy-snippet"
                        onClick={() => handleCopySnippet(lyricsC, 'C')}
                        title="Copy to clipboard"
                      >
                        {copiedKey === 'C' ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedKey === 'C' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Paste lyric snippet C here..."
                    value={lyricsC}
                    onChange={(e) => {
                      setLyricsC(e.target.value);
                      triggerAutoSave({ lyricsC: e.target.value });
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Platform Links */}
          <div className="column-card">
            <div
              className="column-card-header collapsible-header"
              onClick={() => toggleSection('links', setIsLinksOpen)}
            >
              <div>
                <div className="section-eyebrow">
                  <Globe size={13} />
                  <span>Distribution & Streaming</span>
                </div>
                <h2 className="column-title">Platform Links</h2>
                <p className="column-subtitle">
                  External links to the master audio drop, video premiere, and artist profiles.
                </p>
              </div>

              <div className="header-actions">
                {isLinksComplete && (
                  <div className="section-complete-badge" title="All platform links completed">
                    <Check size={12} strokeWidth={2.8} />
                    <span>Complete</span>
                  </div>
                )}
                <button
                  type="button"
                  className="btn-collapse"
                  aria-label={isLinksOpen ? 'Collapse section' : 'Expand section'}
                >
                  <ChevronDown
                    size={17}
                    className={`collapse-chevron ${isLinksOpen ? 'open' : ''}`}
                  />
                </button>
              </div>
            </div>

            {isLinksOpen && (
              <div className="platform-links-grid">
                <div className="form-group">
                  <label className="form-label">Original Track Link</label>
                  <div className="link-input-wrap">
                    <Globe size={15} className="link-icon" />
                    <input
                      type="url"
                      className="form-input with-icon"
                      placeholder="https://youtube.com/watch?v=..."
                      value={originalTrackLink}
                      onChange={(e) => {
                        setOriginalTrackLink(e.target.value);
                        triggerAutoSave({ originalTrackLink: e.target.value });
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">YouTube Link</label>
                  <div className="link-input-wrap">
                    <Video size={15} className="link-icon" />
                    <input
                      type="url"
                      className="form-input with-icon"
                      placeholder="https://youtube.com/watch?v=..."
                      value={youtubeLink}
                      onChange={(e) => {
                        setYoutubeLink(e.target.value);
                        triggerAutoSave({ youtubeLink: e.target.value });
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">SoundCloud Link</label>
                  <div className="link-input-wrap">
                    <Radio size={15} className="link-icon" />
                    <input
                      type="url"
                      className="form-input with-icon"
                      placeholder="https://soundcloud.com/artist/track"
                      value={soundcloudLink}
                      onChange={(e) => {
                        setSoundcloudLink(e.target.value);
                        triggerAutoSave({ soundcloudLink: e.target.value });
                      }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Bandcamp Link</label>
                  <div className="link-input-wrap">
                    <Disc size={15} className="link-icon" />
                    <input
                      type="url"
                      className="form-input with-icon"
                      placeholder="https://artist.bandcamp.com/track/..."
                      value={bandcampLink}
                      onChange={(e) => {
                        setBandcampLink(e.target.value);
                        triggerAutoSave({ bandcampLink: e.target.value });
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN: Media & Sub-Content Pipeline
            ========================================= */}
        <div className="pipeline-column">
          {/* YouTube Thumbnail Mockup Preview Card */}
          {/* YouTube Thumbnail Mockup Preview Card */}
          <div className="column-card">
            <div
              className="column-card-header collapsible-header"
              onClick={() => toggleSection('preview', setIsPreviewOpen)}
            >
              <div>
                <div className="section-eyebrow">
                  <Video size={13} />
                  <span>YouTube Mockup</span>
                </div>
                <h2 className="column-title">Preview</h2>
                <p className="column-subtitle">
                  Visual YouTube thumbnail and metadata preview card.
                </p>
              </div>

              <div className="header-actions">
                {isPreviewComplete && (
                  <div className="section-complete-badge" title="Thumbnail preview uploaded">
                    <Check size={12} strokeWidth={2.8} />
                    <span>Complete</span>
                  </div>
                )}
                <button
                  type="button"
                  className="btn-collapse"
                  aria-label={isPreviewOpen ? 'Collapse section' : 'Expand section'}
                >
                  <ChevronDown
                    size={17}
                    className={`collapse-chevron ${isPreviewOpen ? 'open' : ''}`}
                  />
                </button>
              </div>
            </div>

            {isPreviewOpen && (
              <div className="yt-mockup-body">
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
                />

                {/* 16:9 Thumbnail Area */}
                <div
                  className={`yt-thumb-box ${!thumbnailUrl ? 'empty' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileSelect(e.dataTransfer.files?.[0]);
                  }}
                  title="Click or drag an image here to upload YouTube thumbnail"
                >
                  {thumbnailUrl ? (
                    <>
                      <img src={thumbnailUrl} alt="YouTube thumbnail preview" className="yt-thumb-img" />
                      <div className="yt-thumb-hover-overlay">
                        <Upload size={18} />
                        <span>Change thumbnail</span>
                      </div>
                    </>
                  ) : (
                    <div className="yt-thumb-placeholder">
                      <span className="yt-placeholder-text">Upload thumbnail</span>
                    </div>
                  )}
                  <div className="yt-time-badge">10:30</div>
                </div>

                {/* Video Details Row (Avatar + Title + Channel + Views) */}
                <div className="yt-video-meta-row">
                  <div className="yt-channel-avatar">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="@prodbycjbeatsss"
                      className="yt-channel-avatar-img"
                    />
                  </div>
                  <div className="yt-video-text-box">
                    <h3 className="yt-video-title">
                      {artistName && trackName
                        ? `${artistName} // ${trackName}`
                        : artistName
                        ? `${artistName} // Track Name`
                        : trackName
                        ? `Artist Name // ${trackName}`
                        : 'Artist Name // Track Name'}
                    </h3>
                    <div className="yt-channel-name">
                      @prodbycjbeatsss
                    </div>
                    <div className="yt-video-stats">
                      120K views • 1 day ago
                    </div>
                  </div>
                </div>

                {/* Validation Feedback Messages */}
                {uploadError && (
                  <div className="yt-guideline-alert error">
                    <AlertCircle size={14} className="alert-icon" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="yt-guideline-alert success">
                    <Check size={14} className="alert-icon" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}

                {/* Action Buttons above specs */}
                <div className="yt-actions-row">
                  <button
                    type="button"
                    className="yt-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={12} />
                    <span>{thumbnailUrl ? 'Replace' : 'Upload'}</span>
                  </button>
                  {thumbnailUrl && (
                    <button
                      type="button"
                      className="yt-reset-btn"
                      onClick={handleResetThumbnail}
                      title="Remove custom thumbnail"
                    >
                      <Trash2 size={12} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                {/* YouTube Specs Guide */}
                <div className="yt-guidelines-bar">
                  <span className="yt-guidelines-badge">
                    YouTube Specs: 16:9 (1280×720) • Max 2MB • JPG, PNG, WEBP
                  </span>
                </div>

                {/* Quick External Platform Launchers */}
                {(youtubeLink || soundcloudLink || bandcampLink || originalTrackLink) && (
                  <div className="quick-links-bar" style={{ marginTop: '14px' }}>
                    {[
                      { platform: PLATFORMS.YOUTUBE, link: youtubeLink, label: 'YouTube' },
                      { platform: PLATFORMS.SOUNDCLOUD, link: soundcloudLink, label: 'SoundCloud' },
                      { platform: PLATFORMS.BANDCAMP, link: bandcampLink, label: 'Bandcamp' },
                      { platform: PLATFORMS.ORIGINAL, link: originalTrackLink, label: 'Original Track' }
                    ]
                      .filter((item) => Boolean(item.link))
                      .map(({ platform, link, label }) => {
                        const info = PLATFORM_INFO[platform] || PLATFORM_INFO.other;
                        return (
                          <a
                            key={platform}
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="quick-link-pill"
                            style={{
                              background: info.bgColor,
                              color: info.color,
                              border: `1px solid ${info.borderColor}`
                            }}
                          >
                            <PlatformIcon platform={platform} size={12} />
                            <span>{label}</span>
                            <ExternalLink size={10} style={{ opacity: 0.65 }} />
                          </a>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>



          {/* Content Descriptions & Checklist */}
          <div className="column-card">
            <div className="checklist-card-header-wrapper">
              <div
                className="column-card-header collapsible-header checklist-collapsible-header"
                onClick={() => toggleSection('content', setIsContentOpen)}
              >
                <div className="checklist-header-info">
                  <div className="section-eyebrow">
                    <Layers size={13} />
                    <span>Workflow & Distribution</span>
                  </div>
                  <h3 className="column-title">
                    Content Descriptions & Checklist ({project.subContent?.length || 0})
                  </h3>
                  <p className="column-subtitle">
                    Video descriptions, hooks, and planned content checklist drops.
                  </p>
                </div>

                <div className="header-actions">
                  {isSubContentComplete && (
                    <div className="section-complete-badge" title="Content descriptions & checklist active">
                      <Check size={12} strokeWidth={2.8} />
                      <span>Complete</span>
                    </div>
                  )}
                  <button
                    type="button"
                    className="btn-collapse"
                    aria-label={isContentOpen ? 'Collapse section' : 'Expand section'}
                  >
                    <ChevronDown
                      size={17}
                      className={`collapse-chevron ${isContentOpen ? 'open' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Dedicated Actions Toolbar for Checklist */}
              {isContentOpen && (
                <div className="checklist-actions-toolbar">
                  <button
                    type="button"
                    className="btn-clay"
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                    onClick={() => setIsNewSubModalOpen(true)}
                  >
                    <Plus size={14} />
                    <span>Add Item</span>
                  </button>

                  <button
                    type="button"
                    className="btn-main header-refresh-btn"
                    onClick={handleRefreshAllSubContent}
                    disabled={isRefreshingAll || !project.subContent || project.subContent.length === 0}
                    title="Refresh all descriptions with current project metadata"
                  >
                    <RotateCw size={12} className={isRefreshingAll ? 'spinning' : ''} />
                    <span>Refresh All</span>
                    {outdatedItems.length > 0 && (
                      <span className="header-outdated-badge">
                        {outdatedItems.length}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {isContentOpen && (
              <div className="subcontent-list" style={{ marginTop: '16px' }}>
                {/* Refresh Descriptions Warning Indicator Banner */}
                {outdatedItems.length > 0 && (
                  <div className="checklist-warning-banner">
                    <div className="warning-banner-left">
                      <div className="warning-banner-icon-badge">
                        <AlertCircle size={16} />
                      </div>
                      <div className="warning-banner-text">
                        <div className="warning-banner-title">
                          Descriptions Out of Date
                        </div>
                        <div className="warning-banner-desc">
                          {outdatedItems.length} {outdatedItems.length === 1 ? 'checklist description differs' : 'checklist descriptions differ'} from latest project information.
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-clay warning-refresh-all-btn"
                      onClick={handleRefreshAllSubContent}
                      disabled={isRefreshingAll}
                    >
                      <RotateCw size={12} className={isRefreshingAll ? 'spinning' : ''} />
                      <span>{isRefreshingAll ? 'Refreshing...' : `Refresh All (${outdatedItems.length})`}</span>
                    </button>
                  </div>
                )}

                {!project.subContent || project.subContent.length === 0 ? (
                  <div className="subcontent-empty-state">
                    <Layers size={24} style={{ opacity: 0.4, marginBottom: '6px' }} />
                    <p style={{ fontWeight: 600 }}>No checklist items yet</p>
                    <p style={{ fontSize: '12px', marginTop: '2px' }}>
                      Click "+ Add Item" above to plan descriptions, hooks, and video release drops!
                    </p>
                  </div>
                ) : (
                  project.subContent.map((item, index) => (
                    <SubContentCard
                      key={item.id}
                      item={item}
                      index={index}
                      isOutdated={outdatedIds.has(item.id)}
                      isDragging={draggedSubIndex === index}
                      isDragOver={dragOverSubIndex === index}
                      onDragStart={handleSubDragStart}
                      onDragOver={handleSubDragOver}
                      onDragEnd={handleSubDragEnd}
                      onDrop={handleSubDrop}
                      onDelete={(subId) => onDeleteSubContent(project.id, subId)}
                      onToggle={handleToggleSubContent}
                      onUpdateTitle={handleUpdateSubContentTitle}
                      onUpdateDate={handleUpdateSubContentDate}
                      onRefresh={handleRefreshSubContent}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Sub-Content Derivative Modal */}
      <NewSubContentModal
        isOpen={isNewSubModalOpen}
        onClose={() => setIsNewSubModalOpen(false)}
        onSave={handleSaveSubContent}
        project={{
          ...project,
          artistName,
          trackName,
          lyrics: { a: lyricsA, b: lyricsB, c: lyricsC },
          links: {
            original: originalTrackLink,
            youtube: youtubeLink,
            soundcloud: soundcloudLink,
            bandcamp: bandcampLink
          }
        }}
        projectId={project.id}
        projectTitle={trackName || project.title}
      />
    </div>
  );
}
