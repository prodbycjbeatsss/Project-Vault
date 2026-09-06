import React, { useState, useRef, useEffect } from 'react';
import FolderCard from '../components/FolderCard';
import ProjectCard from '../components/ProjectCard';
import NewFolderModal from '../components/NewFolderModal';
import DeleteWarningModal from '../components/DeleteWarningModal';
import { Plus, ChevronDown, FolderPlus, FolderKanban } from 'lucide-react';
import '../styles/projects.css';

export default function ProjectsView({
  projects = [],
  folders = [],
  onSelectProject,
  onNewProjectClick,
  onAddFolder,
  onDeleteFolder,
  searchQuery = '',
  statusFilter = 'all',
  platformFilter = 'all'
}) {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState(null);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const createMenuRef = useRef(null);

  // Close create menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (createMenuRef.current && !createMenuRef.current.contains(event.target)) {
        setIsCreateMenuOpen(false);
      }
    };
    if (isCreateMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCreateMenuOpen]);

  // Filter projects based on search, status, and folder
  const filteredProjects = projects.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchTag = p.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }

    if (statusFilter !== 'all' && p.status !== statusFilter) {
      return false;
    }

    if (platformFilter !== 'all') {
      const hasPlat = p.subContent?.some((s) => s.platform === platformFilter);
      if (!hasPlat && platformFilter !== 'youtube') return false;
    }

    if (selectedFolder && p.folder !== selectedFolder) {
      return false;
    }

    return true;
  });

  const handleOpenCreateFolder = () => {
    setFolderToEdit(null);
    setIsNewFolderModalOpen(true);
  };

  const handleEditFolderClick = (folder) => {
    setFolderToEdit(folder);
    setIsNewFolderModalOpen(true);
  };

  const handleSaveFolder = (folderData) => {
    onAddFolder(folderData);
    setFolderToEdit(null);
  };

  const handleDeleteFolderClick = (folder) => {
    setFolderToDelete(folder);
  };

  const handleConfirmDeleteFolder = (folderId) => {
    if (folderToDelete && selectedFolder === folderToDelete.name) {
      setSelectedFolder(null);
    }
    if (onDeleteFolder) {
      onDeleteFolder(folderId);
    }
    setFolderToDelete(null);
  };

  return (
    <div className="projects-page">
      {/* Header with Unified New Action */}
      <div className="projects-header-row">
        <div className="projects-header">
          <h1 className="projects-title">My Projects & Workflows</h1>
          <p className="projects-subtitle">
            Organize long-form video productions, master releases, and sub-content pipelines.
          </p>
        </div>

        <div className="header-action-wrapper" ref={createMenuRef}>
          <button
            onClick={() => setIsCreateMenuOpen((prev) => !prev)}
            className={`btn-header-create ${isCreateMenuOpen ? 'active' : ''}`}
            title="Create new project or folder"
            aria-expanded={isCreateMenuOpen}
          >
            <Plus size={15} strokeWidth={2.4} />
            <span>New</span>
            <ChevronDown size={13} className={`chevron-indicator ${isCreateMenuOpen ? 'open' : ''}`} />
          </button>

          {isCreateMenuOpen && (
            <div className="header-create-menu">
              <button
                className="create-menu-item"
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  onNewProjectClick();
                }}
              >
                <div className="menu-item-icon-box project">
                  <FolderKanban size={16} />
                </div>
                <div className="menu-item-text">
                  <span className="menu-item-label">New Project</span>
                  <span className="menu-item-desc">Create video campaign & pipeline</span>
                </div>
              </button>

              <div className="create-menu-divider" />

              <button
                className="create-menu-item"
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  handleOpenCreateFolder();
                }}
              >
                <div className="menu-item-icon-box folder">
                  <FolderPlus size={16} />
                </div>
                <div className="menu-item-text">
                  <span className="menu-item-label">New Folder</span>
                  <span className="menu-item-desc">Organize campaigns into warm archives</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Folders Section */}
      <div className="section-title-row">
        <h2 className="section-title">Folders</h2>
        {folders.length > 0 && <span className="count-badge">{folders.length}</span>}
        {selectedFolder && (
          <button
            onClick={() => setSelectedFolder(null)}
            className="btn-link"
          >
            Clear folder filter
          </button>
        )}

      </div>

      {folders.length === 0 ? (
        <div
          style={{
            padding: '44px 20px',
            marginBottom: '32px',
            textAlign: 'center',
            background: 'var(--surface-card-surface)',
            borderRadius: 'var(--radius-cards)',
            border: '1px dashed var(--color-stone)'
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📁</div>
          <p style={{ fontFamily: 'var(--font-anthropic-serif)', fontSize: '16px', fontWeight: 600, color: 'var(--color-slate-dark)' }}>
            Add your first folder
          </p>
          <p style={{ fontFamily: 'var(--font-anthropic-sans)', fontSize: '13px', color: 'var(--color-cloud-dark)', marginTop: '4px' }}>
            Organize your releases, beat tapes, and tutorials into warm archival folders.
          </p>
        </div>
      ) : (
        <div className="folders-grid">
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={{
                ...folder,
                itemCount: projects.filter((p) => p.folder === folder.name).length
              }}
              onClick={() => setSelectedFolder(selectedFolder === folder.name ? null : folder.name)}
              onEdit={handleEditFolderClick}
              onDelete={handleDeleteFolderClick}
            />
          ))}
        </div>
      )}

      {/* Projects Grid Section */}
      <div className="section-title-row">
        <h2 className="section-title">
          {selectedFolder ? `${selectedFolder} Projects` : 'Projects'}
        </h2>
        {filteredProjects.length > 0 && <span className="count-badge">{filteredProjects.length}</span>}
      </div>

      {filteredProjects.length === 0 ? (
        <div
          style={{
            padding: '44px 20px',
            textAlign: 'center',
            background: 'var(--surface-card-surface)',
            borderRadius: 'var(--radius-cards)',
            border: '1px dashed var(--color-stone)'
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚀</div>
          <p style={{ fontFamily: 'var(--font-anthropic-serif)', fontSize: '16px', fontWeight: 600, color: 'var(--color-slate-dark)' }}>
            Add your first project
          </p>
          <p style={{ fontFamily: 'var(--font-anthropic-sans)', fontSize: '13px', color: 'var(--color-cloud-dark)', marginTop: '4px' }}>
            Start by creating a campaign and linking your main video asset.
          </p>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={onSelectProject} />
          ))}
        </div>
      )}

      {/* New / Edit Folder Modal */}
      <NewFolderModal
        isOpen={isNewFolderModalOpen}
        initialFolder={folderToEdit}
        onClose={() => {
          setIsNewFolderModalOpen(false);
          setFolderToEdit(null);
        }}
        onSave={handleSaveFolder}
      />

      {/* Delete Confirmation Warning Modal */}
      <DeleteWarningModal
        isOpen={Boolean(folderToDelete)}
        folder={folderToDelete}
        onClose={() => setFolderToDelete(null)}
        onConfirm={handleConfirmDeleteFolder}
      />
    </div>
  );
}
