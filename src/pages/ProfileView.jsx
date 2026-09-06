import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  Save,
  CheckCircle2,
  ShieldCheck,
  LogOut,
  User,
  AtSign,
  Globe,
  Mail,
  Pencil,
  Check,
  X
} from 'lucide-react';
import { storage } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import '../styles/profile.css';

export default function ProfileView() {
  const { user, isGuest, signOut, isSupabaseConfigured } = useAuth();

  const [profile, setProfile] = useState(() => storage.getUserProfile());
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState(null);
  const [showAvatarInput, setShowAvatarInput] = useState(false);

  // Sync state if storage updates externally
  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setProfile(storage.getUserProfile());
    });
    return unsubscribe;
  }, []);

  // Show auto-dismissing toast feedback
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      storage.saveUserProfile(profile);
      triggerToast('Profile & handles saved successfully.');
    } catch (err) {
      triggerToast('Failed to save profile changes.', 'info');
    } finally {
      setTimeout(() => setIsSaving(false), 300);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await storage.syncCloudData();
      triggerToast(`Synced with cloud storage at ${new Date(res.timestamp).toLocaleTimeString()}.`);
    } catch (err) {
      triggerToast('Cloud sync failed.', 'info');
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastSync = (isoDate) => {
    if (!isoDate) return 'Not yet synced';
    try {
      const date = new Date(isoDate);
      return `Last synced: ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return 'Synced';
    }
  };

  const providerName = user?.app_metadata?.provider || (user?.email ? 'Email Account' : isGuest ? 'Guest Mode' : 'Local Session');
  const googleAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '';
  const effectiveAvatar = profile.avatarUrl || googleAvatar;

  return (
    <div className="profile-container">
      {/* Header & Main Actions */}
      <div className="profile-header">
        <div className="profile-title-group">
          <h1 className="profile-title">Creator Profile & Settings</h1>
          <p className="profile-subtitle">
            Manage your studio identity, social media handles for release templates, and cloud sync.
          </p>
        </div>

        <div className="profile-actions-bar">
          <button
            type="button"
            className={`btn-sync ${isSyncing ? 'syncing' : ''}`}
            onClick={handleSync}
            disabled={isSyncing}
            title="Refresh and sync cloud data"
          >
            <RotateCw size={14} className="sync-icon" />
            <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
          </button>

          <button
            type="button"
            className="btn-clay"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save size={14} />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Toast Feedback */}
      {toast && (
        <div className={`profile-toast ${toast.type}`}>
          <CheckCircle2 size={16} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Card 1: Creator Identity */}
      <div className="profile-card">
        <div className="profile-card-header">
          <div>
            <h2 className="profile-card-title">Creator Identity</h2>
            <p className="profile-card-desc">Your public name and studio credentials</p>
          </div>
          <span className="sync-status-pill">{formatLastSync(profile.lastSyncedAt)}</span>
        </div>

        {/* Avatar Row */}
        <div className="profile-avatar-row">
          <div className="profile-avatar-wrapper">
            {effectiveAvatar ? (
              <img
                src={effectiveAvatar}
                alt="Profile Avatar"
                className="profile-avatar-preview"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                <User size={30} />
              </div>
            )}
          </div>

          <div className="profile-avatar-details">
            <div className="profile-avatar-meta">
              <span className="profile-avatar-title">Profile Photo</span>
              <span className="profile-avatar-status">
                {profile.avatarUrl
                  ? 'Custom photo URL active'
                  : googleAvatar
                  ? 'Connected via Google Account'
                  : 'Studio default avatar'}
              </span>
            </div>

            {!showAvatarInput ? (
              <div className="profile-avatar-actions">
                <button
                  type="button"
                  className="btn-avatar-toggle"
                  onClick={() => setShowAvatarInput(true)}
                  title="Change photo with a custom image URL"
                >
                  <Pencil size={12} />
                  <span>{profile.avatarUrl ? 'Edit Photo URL' : 'Custom Photo URL'}</span>
                </button>

                {profile.avatarUrl && googleAvatar && (
                  <button
                    type="button"
                    className="btn-avatar-reset"
                    onClick={() => handleChange('avatarUrl', '')}
                    title="Revert back to Google account photo"
                  >
                    Reset to Google photo
                  </button>
                )}
              </div>
            ) : (
              <div className="profile-avatar-input-panel">
                <div className="profile-avatar-input-row">
                  <input
                    type="text"
                    className="profile-input profile-avatar-compact-input"
                    placeholder="Paste image URL (https://...)"
                    value={profile.avatarUrl || ''}
                    onChange={(e) => handleChange('avatarUrl', e.target.value)}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="btn-avatar-done"
                    onClick={() => setShowAvatarInput(false)}
                    title="Done editing URL"
                  >
                    <Check size={12} />
                    <span>Done</span>
                  </button>
                  <button
                    type="button"
                    className="btn-avatar-close"
                    onClick={() => setShowAvatarInput(false)}
                    title="Close URL bar"
                  >
                    <X size={13} />
                  </button>
                </div>
                {googleAvatar && profile.avatarUrl && (
                  <button
                    type="button"
                    className="btn-avatar-reset-link"
                    onClick={() => {
                      handleChange('avatarUrl', '');
                      setShowAvatarInput(false);
                    }}
                  >
                    Reset to Google photo
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="profile-form-grid">
          <div className="profile-field-item">
            <label className="profile-label">Display Name</label>
            <input
              type="text"
              className="profile-input"
              placeholder="e.g. CJ Beats / Alex Rivers"
              value={profile.displayName || ''}
              onChange={(e) => handleChange('displayName', e.target.value)}
            />
          </div>

          <div className="profile-field-item">
            <label className="profile-label">Primary Producer Tag</label>
            <input
              type="text"
              className="profile-input"
              placeholder="e.g. @prodbycjbeatsss"
              value={profile.producerHandle || ''}
              onChange={(e) => handleChange('producerHandle', e.target.value)}
            />
          </div>
        </div>

        <div className="profile-field-item">
          <label className="profile-label">Studio & Sound Bio</label>
          <textarea
            className="profile-textarea"
            placeholder="Brief bio describing your production style and background..."
            value={profile.bio || ''}
            onChange={(e) => handleChange('bio', e.target.value)}
          />
        </div>
      </div>

      {/* Card 2: Handles, URLs & Business Contact */}
      <div className="profile-card">
        {/* Subsection A: Platform Handles */}
        <div>
          <div className="profile-subsection-header">
            <div className="profile-subsection-icon">
              <AtSign size={15} />
            </div>
            <span className="profile-subsection-title">Platform Handles</span>
          </div>

          <div className="profile-handles-grid">
            <div className="profile-field-item">
              <span className="profile-label-upper">YouTube</span>
              <input
                type="text"
                className="profile-input"
                placeholder="@prodbycjbeatsss"
                value={profile.youtubeHandle || ''}
                onChange={(e) => handleChange('youtubeHandle', e.target.value)}
              />
            </div>

            <div className="profile-field-item">
              <span className="profile-label-upper">Instagram</span>
              <input
                type="text"
                className="profile-input"
                placeholder="@prodbycjbeatsss"
                value={profile.instagramHandle || ''}
                onChange={(e) => handleChange('instagramHandle', e.target.value)}
              />
            </div>

            <div className="profile-field-item">
              <span className="profile-label-upper">TikTok</span>
              <input
                type="text"
                className="profile-input"
                placeholder="@_prodbycjbeatsss"
                value={profile.tiktokHandle || ''}
                onChange={(e) => handleChange('tiktokHandle', e.target.value)}
              />
            </div>

            <div className="profile-field-item">
              <span className="profile-label-upper">SoundCloud</span>
              <input
                type="text"
                className="profile-input"
                placeholder="@prodbycjbeatsss"
                value={profile.soundcloudHandle || ''}
                onChange={(e) => handleChange('soundcloudHandle', e.target.value)}
              />
            </div>

            <div className="profile-field-item">
              <span className="profile-label-upper">Bandcamp</span>
              <input
                type="text"
                className="profile-input"
                placeholder="@yourbandcamp"
                value={profile.bandcampHandle || ''}
                onChange={(e) => handleChange('bandcampHandle', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="profile-divider" />

        {/* Subsection B: Profile URLs */}
        <div>
          <div className="profile-subsection-header">
            <div className="profile-subsection-icon">
              <Globe size={15} />
            </div>
            <span className="profile-subsection-title">Profile URLs</span>
          </div>

          <div className="profile-urls-stack">
            <div className="profile-field-item">
              <span className="profile-label-upper">YouTube Channel</span>
              <input
                type="text"
                className="profile-input"
                placeholder="https://youtube.com/..."
                value={profile.youtubeUrl || ''}
                onChange={(e) => handleChange('youtubeUrl', e.target.value)}
              />
            </div>

            <div className="profile-field-item">
              <span className="profile-label-upper">Instagram Profile</span>
              <input
                type="text"
                className="profile-input"
                placeholder="https://instagram.com/..."
                value={profile.instagramUrl || ''}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
              />
            </div>

            <div className="profile-field-item">
              <span className="profile-label-upper">TikTok Profile</span>
              <input
                type="text"
                className="profile-input"
                placeholder="https://www.tiktok.com/@_prodbycjbeatsss"
                value={profile.tiktokUrl || ''}
                onChange={(e) => handleChange('tiktokUrl', e.target.value)}
              />
            </div>

            <div className="profile-field-item">
              <span className="profile-label-upper">SoundCloud Profile</span>
              <input
                type="text"
                className="profile-input"
                placeholder="https://soundcloud.com/prodbycjbeatsss"
                value={profile.soundcloudUrl || ''}
                onChange={(e) => handleChange('soundcloudUrl', e.target.value)}
              />
            </div>

            <div className="profile-field-item">
              <span className="profile-label-upper">Bandcamp Profile</span>
              <input
                type="text"
                className="profile-input"
                placeholder="https://prodbycjbeatsss.bandcamp.com"
                value={profile.bandcampUrl || ''}
                onChange={(e) => handleChange('bandcampUrl', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="profile-divider" />

        {/* Subsection C: Business Contact */}
        <div>
          <div className="profile-subsection-header">
            <div className="profile-subsection-icon">
              <Mail size={15} />
            </div>
            <span className="profile-subsection-title">Business Contact</span>
          </div>

          <div className="profile-field-item">
            <span className="profile-label-upper">Business Email</span>
            <input
              type="email"
              className="profile-input"
              placeholder="cjbeatsss@gmail.com"
              value={profile.businessEmail || ''}
              onChange={(e) => handleChange('businessEmail', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Card 4: Account Details & Session */}
      <div className="profile-card">
        <div className="profile-card-header">
          <div>
            <h2 className="profile-card-title">Account & Authentication</h2>
            <p className="profile-card-desc">Your active login credentials and session control</p>
          </div>
        </div>

        <div className="account-info-box">
          <div className="account-identity">
            <span className="account-email">{user?.email || (isGuest ? 'Guest Creator Preview' : 'Local Studio User')}</span>
            <span className="account-provider-badge">
              <ShieldCheck size={13} />
              <span>{isSupabaseConfigured ? 'Connected to Supabase' : 'Local Dev Mode'} • {providerName}</span>
            </span>
          </div>

          <button
            type="button"
            className="btn-main"
            onClick={signOut}
            title="Sign out of ProjectVault"
          >
            <LogOut size={13} />
            <span>{isGuest ? 'Exit Guest Mode' : 'Sign Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
