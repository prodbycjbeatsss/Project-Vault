import { PLATFORMS } from '../types/schema';
import { storage } from '../services/storage';

/**
 * Standard Available Tokens / Placeholders for Templates
 */
export const AVAILABLE_PLACEHOLDERS = [
  { token: '{{artist_name}}', label: 'Artist Name', desc: 'Primary artist name' },
  { token: '{{track_name}}', label: 'Track Name', desc: 'Song or project title' },
  { token: '{{track_artist}}', label: 'Artist // Track', desc: 'Artist // Track formatted' },
  { token: '{{hashtags}}', label: 'All Hashtags', desc: 'Combined main & extra hashtags' },
  { token: '{{hashtag_1}}', label: 'Hashtag 1', desc: 'First hashtag' },
  { token: '{{hashtag_2}}', label: 'Hashtag 2', desc: 'Second hashtag' },
  { token: '{{hashtag_3}}', label: 'Hashtag 3', desc: 'Third hashtag' },
  { token: '{{lyric_a}}', label: 'Lyric Snippet A', desc: 'First lyric hook' },
  { token: '{{lyric_b}}', label: 'Lyric Snippet B', desc: 'Second lyric hook' },
  { token: '{{lyric_c}}', label: 'Lyric Snippet C', desc: 'Third lyric hook' },
  { token: '{{link_youtube}}', label: 'YouTube Link', desc: 'Video premiere URL' },
  { token: '{{link_soundcloud}}', label: 'SoundCloud Link', desc: 'SoundCloud audio URL' },
  { token: '{{soundcloud_remix_link}}', label: 'SC Remix Link', desc: 'SoundCloud track link' },
  { token: '{{link_bandcamp}}', label: 'Bandcamp Link', desc: 'Bandcamp purchase URL' },
  { token: '{{bandcamp_link}}', label: 'Bandcamp URL', desc: 'Bandcamp track link' },
  { token: '{{link_beat_platform}}', label: 'Beat Platform Link', desc: 'Beat store or lease link' },
  { token: '{{link_original_track}}', label: 'Original Track Link', desc: 'Master / Original audio link' },
  { token: '{{original_track}}', label: 'Original Track', desc: 'Master reference URL' },
  { token: '{{handle_youtube}}', label: 'YouTube Handle', desc: 'Personalized YouTube handle' },
  { token: '{{producer_handle}}', label: 'Producer Handle', desc: 'Primary producer handle' },
  { token: '{{handle_instagram}}', label: 'IG Handle', desc: 'Instagram username' },
  { token: '{{handle_tiktok}}', label: 'TikTok Handle', desc: 'TikTok username' },
  { token: '{{handle_soundcloud}}', label: 'SoundCloud Handle', desc: 'SoundCloud username' },
  { token: '{{url_youtube}}', label: 'YouTube URL', desc: 'YouTube channel link' },
  { token: '{{url_instagram}}', label: 'Instagram URL', desc: 'Instagram profile link' },
  { token: '{{instagram_url}}', label: 'IG URL', desc: 'Instagram profile link' },
  { token: '{{url_tiktok}}', label: 'TikTok URL', desc: 'TikTok profile link' },
  { token: '{{tiktok_url}}', label: 'TikTok Link', desc: 'TikTok profile link' },
  { token: '{{url_soundcloud}}', label: 'SoundCloud URL', desc: 'SoundCloud profile link' },
  { token: '{{soundcloud_url}}', label: 'SC URL', desc: 'SoundCloud profile link' },
  { token: '{{business_email}}', label: 'Business Email', desc: 'Email for inquiries' },
  { token: '{{email}}', label: 'Contact Email', desc: 'Email for licenses' },
  { token: '{{notes}}', label: 'Project Notes', desc: 'Custom project notes' },
  { token: '{{tags}}', label: 'Tags', desc: 'Project category tags' }
];

/**
 * Resolves a template text against a project object and user profile
 */
export function resolveTemplate(templateText, project, userProfile = null) {
  if (!templateText) return '';
  if (!project) return templateText;

  // Retrieve user profile if not passed explicitly
  const profile = userProfile || (typeof window !== 'undefined' ? storage.getUserProfile() : null);

  const artist = project.artistName || profile?.displayName || 'Artist';
  const track = project.trackName || project.title || 'Track Name';
  const trackArtist = project.artistName ? `${project.artistName} // ${track}` : track;

  // Split hashtags with profile fallback
  const defaultTags = profile?.defaultHashtags || '#beats #producer #typebeat';
  const rawTags = [project.mainHashtags, project.extraHashtags].filter(Boolean).join(' ') || defaultTags;
  const tagList = rawTags
    ? rawTags.split(/[,\s]+/).map((t) => (t.startsWith('#') ? t : `#${t}`)).filter((t) => t.length > 1)
    : ['#beats', '#producer', '#typebeat'];

  const tag1 = tagList[0] || '#beats';
  const tag2 = tagList[1] || '#producer';
  const tag3 = tagList[2] || '#typebeat';

  const ytLink = project.links?.youtube || project.youtubeLink || project.mainVideo?.videoUrl || profile?.youtubeUrl || 'https://youtube.com';
  const scLink = project.links?.soundcloud || project.soundcloudLink || profile?.soundcloudUrl || 'https://soundcloud.com';
  const bcLink = project.links?.bandcamp || project.bandcampLink || profile?.bandcampUrl || 'https://bandcamp.com';
  const origLink = project.links?.original || project.originalTrackLink || ytLink;

  const lyricA = project.lyrics?.a || 'Turn the volume up, let the bass line roll';
  const lyricB = project.lyrics?.b || 'Midnight session vibes, rhythm takes control';
  const lyricC = project.lyrics?.c || 'Another master cut fresh out of the vault';

  const notes = project.notes ? `\n\n${project.notes}` : '';

  const values = {
    '{{artist_name}}': artist,
    '{{track_name}}': track,
    '{{track_artist}}': trackArtist,
    '{{hashtags}}': tagList.join(' '),
    '{{hashtag_1}}': tag1,
    '{{hashtag_2}}': tag2,
    '{{hashtag_3}}': tag3,
    '{{lyric_a}}': lyricA,
    '{{lyric_b}}': lyricB,
    '{{lyric_c}}': lyricC,
    '{{link_youtube}}': ytLink,
    '{{url_youtube}}': profile?.youtubeUrl || ytLink,
    '{{link_soundcloud}}': scLink,
    '{{soundcloud_remix_link}}': scLink,
    '{{url_soundcloud}}': profile?.soundcloudUrl || scLink,
    '{{soundcloud_url}}': profile?.soundcloudUrl || scLink,
    '{{link_bandcamp}}': bcLink,
    '{{bandcamp_link}}': bcLink,
    '{{link_beat_platform}}': profile?.beatPlatformUrl || '',
    '{{link_original_track}}': origLink,
    '{{original_track}}': origLink,
    '{{producer_handle}}': profile?.producerHandle || '',
    '{{handle_youtube}}': profile?.youtubeHandle || '',
    '{{handle_instagram}}': profile?.instagramHandle || '',
    '{{handle_tiktok}}': profile?.tiktokHandle || '',
    '{{handle_soundcloud}}': profile?.soundcloudHandle || '',
    '{{handle_bandcamp}}': profile?.bandcampHandle || '',
    '{{bandcamp_handle}}': profile?.bandcampHandle || '',
    '{{url_instagram}}': profile?.instagramUrl || '',
    '{{instagram_url}}': profile?.instagramUrl || '',
    '{{url_tiktok}}': profile?.tiktokUrl || '',
    '{{tiktok_url}}': profile?.tiktokUrl || '',
    '{{business_email}}': profile?.businessEmail || '',
    '{{email}}': profile?.businessEmail || '',
    '{{notes}}': notes,
    '{{tags}}': Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || '')
  };

  let resolved = templateText;
  for (const [token, val] of Object.entries(values)) {
    resolved = resolved.split(token).join(val);
  }

  return resolved;
}

/**
 * Find the most suitable template for a given sub-content item
 */
export function findMatchingTemplate(item, templates) {
  if (!item || !templates || templates.length === 0) return null;

  // 1. Direct template ID match
  if (item.templateId) {
    const found = templates.find((t) => t.id === item.templateId);
    if (found) return found;
  }

  const titleLower = (item.title || '').toLowerCase();

  // 2. Exact task name match in template tasks
  for (const tpl of templates) {
    if (tpl.tasks && tpl.tasks.some((task) => titleLower.includes(task.toLowerCase()))) {
      return tpl;
    }
  }

  // 3. Shorts drop number matching (Shorts 1, Shorts 2, Shorts 3)
  if (titleLower.includes('shorts 1') || titleLower.includes('shorts #1')) {
    if (item.platform === PLATFORMS.YOUTUBE_SHORTS) return templates.find((t) => t.id === 'tpl-4') || null;
    if (item.platform === PLATFORMS.INSTAGRAM_REELS || item.platform === PLATFORMS.TIKTOK) {
      return templates.find((t) => t.id === 'tpl-5') || null;
    }
  }
  if (titleLower.includes('shorts 2') || titleLower.includes('shorts #2')) {
    if (item.platform === PLATFORMS.YOUTUBE_SHORTS) return templates.find((t) => t.id === 'tpl-6') || null;
    if (item.platform === PLATFORMS.INSTAGRAM_REELS || item.platform === PLATFORMS.TIKTOK) {
      return templates.find((t) => t.id === 'tpl-7') || null;
    }
  }
  if (titleLower.includes('shorts 3') || titleLower.includes('shorts #3')) {
    if (item.platform === PLATFORMS.YOUTUBE_SHORTS) return templates.find((t) => t.id === 'tpl-8') || null;
    if (item.platform === PLATFORMS.INSTAGRAM_REELS || item.platform === PLATFORMS.TIKTOK) {
      return templates.find((t) => t.id === 'tpl-9') || null;
    }
  }

  // 4. Platform matching
  const byPlat = templates.find((t) => t.platforms && t.platforms.includes(item.platform));
  if (byPlat) return byPlat;

  return null;
}

/**
 * Standard Available Workflow Drop Tasks
 */
export const WORKFLOW_TASKS = [
  { id: 'task-yt', name: 'YouTube Remix', platform: PLATFORMS.YOUTUBE },
  { id: 'task-sc', name: 'Soundcloud Remix', platform: PLATFORMS.SOUNDCLOUD },
  { id: 'task-bc', name: 'Bandcamp Remix', platform: PLATFORMS.BANDCAMP },
  { id: 'task-s1-yt', name: 'Shorts #1: YouTube', platform: PLATFORMS.YOUTUBE_SHORTS },
  { id: 'task-s1-ig', name: 'Shorts #1: IG Reels', platform: PLATFORMS.INSTAGRAM_REELS },
  { id: 'task-s1-tt', name: 'Shorts #1: TikTok', platform: PLATFORMS.TIKTOK },
  { id: 'task-s2-yt', name: 'Shorts #2: YouTube', platform: PLATFORMS.YOUTUBE_SHORTS },
  { id: 'task-s2-ig', name: 'Shorts #2: IG Reels', platform: PLATFORMS.INSTAGRAM_REELS },
  { id: 'task-s2-tt', name: 'Shorts #2: TikTok', platform: PLATFORMS.TIKTOK },
  { id: 'task-s3-yt', name: 'Shorts #3: YouTube', platform: PLATFORMS.YOUTUBE_SHORTS },
  { id: 'task-s3-ig', name: 'Shorts #3: IG Reels', platform: PLATFORMS.INSTAGRAM_REELS },
  { id: 'task-s3-tt', name: 'Shorts #3: TikTok', platform: PLATFORMS.TIKTOK }
];

/**
 * Initial Seed Templates matching user specification
 */
export const INITIAL_TEMPLATES = [
  {
    id: 'tpl-1',
    name: 'YouTube Remix',
    tasks: ['YouTube Remix'],
    platforms: [PLATFORMS.YOUTUBE],
    body: `{{artist_name}} - {{track_name}} (Remix)
Produced by @prodbycjbeatsss

Stream / Free Download: {{link_youtube}}
Original Track: {{link_original_track}}

Follow @prodbycjbeatsss:
Instagram: {{url_instagram}}
TikTok: {{url_tiktok}}
SoundCloud: {{url_soundcloud}}

{{hashtags}}`
  },
  {
    id: 'tpl-2',
    name: 'Soundcloud Remix',
    tasks: ['Soundcloud Remix'],
    platforms: [PLATFORMS.SOUNDCLOUD],
    body: `Artist/s: {{artist_name}}
Track Name: {{track_name}}
Produced By: @prodbycjbeatsss

Free stream and download.
Original reference: {{link_original_track}}

Email/DM For Beat Licences: {{email}}
{{hashtags}}`
  },
  {
    id: 'tpl-3',
    name: 'Bandcamp Remix',
    tasks: ['Bandcamp Remix'],
    platforms: [PLATFORMS.BANDCAMP],
    body: `{{artist_name}} - {{track_name}}
@prodbycjbeatsss

Email/DM For Beat Licences......
High quality 24-bit lossless WAV & MP3 included.
Purchase link: {{link_bandcamp}}`
  },
  {
    id: 'tpl-4',
    name: 'Shorts #1: YouTube',
    tasks: ['Shorts #1: YouTube'],
    platforms: [PLATFORMS.YOUTUBE_SHORTS],
    body: `{{lyric_a}} {{hashtag_1}} {{hashtag_2}} {{hashtag_3}}`
  },
  {
    id: 'tpl-5',
    name: 'Shorts #1: Instagram Reels, TikTok',
    tasks: ['Shorts #1: IG Reels', 'Shorts #1: TikTok'],
    platforms: [PLATFORMS.INSTAGRAM_REELS, PLATFORMS.TIKTOK],
    body: `{{lyric_a}} Full Track In Bio 🔥 {{hashtag_1}} {{hashtag_2}} {{hashtag_3}} {{notes}}`
  },
  {
    id: 'tpl-6',
    name: 'Shorts #2: YouTube',
    tasks: ['Shorts #2: YouTube'],
    platforms: [PLATFORMS.YOUTUBE_SHORTS],
    body: `{{lyric_b}} {{hashtag_1}} {{hashtag_2}} {{hashtag_3}}`
  },
  {
    id: 'tpl-7',
    name: 'Shorts #2: Instagram Reels, TikTok',
    tasks: ['Shorts #2: IG Reels', 'Shorts #2: TikTok'],
    platforms: [PLATFORMS.INSTAGRAM_REELS, PLATFORMS.TIKTOK],
    body: `{{lyric_b}} Full Track In Bio 🔥 {{hashtag_1}} {{hashtag_2}} {{hashtag_3}} {{notes}}`
  },
  {
    id: 'tpl-8',
    name: 'Shorts #3: YouTube',
    tasks: ['Shorts #3: YouTube'],
    platforms: [PLATFORMS.YOUTUBE_SHORTS],
    body: `{{lyric_c}} {{hashtag_1}} {{hashtag_2}} {{hashtag_3}}`
  },
  {
    id: 'tpl-9',
    name: 'Shorts #3: Instagram Reels, TikTok',
    tasks: ['Shorts #3: IG Reels', 'Shorts #3: TikTok'],
    platforms: [PLATFORMS.INSTAGRAM_REELS, PLATFORMS.TIKTOK],
    body: `{{lyric_c}} Full Track In Bio 🔥 {{hashtag_1}} {{hashtag_2}} {{hashtag_3}} {{notes}}`
  }
];
