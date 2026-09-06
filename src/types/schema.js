/**
 * ProjectVault Core Data Entities & Validations
 * In accordance with docs/gemini.md Schema Law
 */

export const PLATFORMS = {
  YOUTUBE: 'youtube',
  YOUTUBE_SHORTS: 'youtube_shorts',
  TIKTOK: 'tiktok',
  INSTAGRAM_REELS: 'instagram_reels',
  INSTAGRAM_POST: 'instagram_post',
  SOUNDCLOUD: 'soundcloud',
  BANDCAMP: 'bandcamp',
  ORIGINAL: 'original',
  OTHER: 'other'
};

export const PLATFORM_INFO = {
  [PLATFORMS.YOUTUBE]: {
    name: 'YouTube',
    color: '#B91C1C',
    bgColor: 'rgba(185, 28, 28, 0.08)',
    borderColor: 'rgba(185, 28, 28, 0.22)',
    aspect: '16:9',
    type: 'Video'
  },
  [PLATFORMS.YOUTUBE_SHORTS]: {
    name: 'YouTube Shorts',
    color: '#BE123C',
    bgColor: 'rgba(190, 18, 60, 0.08)',
    borderColor: 'rgba(190, 18, 60, 0.22)',
    aspect: '9:16',
    type: 'Short'
  },
  [PLATFORMS.TIKTOK]: {
    name: 'TikTok',
    color: '#161823',
    bgColor: 'rgba(0, 180, 200, 0.08)',
    borderColor: 'rgba(0, 140, 160, 0.25)',
    aspect: '9:16',
    type: 'Short'
  },
  [PLATFORMS.INSTAGRAM_REELS]: {
    name: 'Instagram Reels',
    color: '#B81D5B',
    bgColor: 'rgba(184, 29, 91, 0.08)',
    borderColor: 'rgba(184, 29, 91, 0.22)',
    aspect: '9:16',
    type: 'Short'
  },
  [PLATFORMS.INSTAGRAM_POST]: {
    name: 'Instagram Post',
    color: '#9D174D',
    bgColor: 'rgba(157, 23, 77, 0.08)',
    borderColor: 'rgba(157, 23, 77, 0.22)',
    aspect: '1:1',
    type: 'Post'
  },
  [PLATFORMS.SOUNDCLOUD]: {
    name: 'SoundCloud',
    color: '#B43B02',
    bgColor: 'rgba(180, 59, 2, 0.08)',
    borderColor: 'rgba(180, 59, 2, 0.22)',
    aspect: 'Audio',
    type: 'Audio'
  },
  [PLATFORMS.BANDCAMP]: {
    name: 'Bandcamp',
    color: '#0E7490',
    bgColor: 'rgba(14, 116, 144, 0.08)',
    borderColor: 'rgba(14, 116, 144, 0.22)',
    aspect: 'Audio',
    type: 'Audio'
  },
  [PLATFORMS.ORIGINAL]: {
    name: 'Original Track',
    color: '#4338CA',
    bgColor: 'rgba(67, 56, 202, 0.08)',
    borderColor: 'rgba(67, 56, 202, 0.22)',
    aspect: 'Audio',
    type: 'Audio'
  },
  [PLATFORMS.OTHER]: {
    name: 'Other',
    color: '#475569',
    bgColor: 'rgba(71, 85, 105, 0.08)',
    borderColor: 'rgba(71, 85, 105, 0.22)',
    aspect: 'Misc',
    type: 'Asset'
  }
};

export const PROJECT_STATUSES = {
  PLANNING: 'planning',
  IN_PROGRESS: 'in-progress',
  READY: 'ready',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};
