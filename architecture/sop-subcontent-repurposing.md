# SOP: Sub-Content Repurposing & Multi-Platform Delivery (Layer 1 Architecture)

## 1. Purpose & Scope
This SOP defines how long-form video assets and master tracks are atomized into derivative sub-content for short-form video (YouTube Shorts, TikTok, Instagram Reels) and music distribution (SoundCloud, Bandcamp).

## 2. Platform Constraints & Formats

| Platform | Format / Aspect Ratio | Target Duration | Key Metadata Fields |
|---|---|---|---|
| **YouTube Shorts** | 9:16 Vertical Video | ≤ 60 seconds | Title (#shorts), Clip Timestamps, Description |
| **TikTok** | 9:16 Vertical Video | 15–60 seconds | Caption, Sound ID, Trending Hashtags |
| **Instagram Reels** | 9:16 Vertical Video | 15–90 seconds | Caption, Audio Name, Cover Art Offset |
| **Instagram Post** | 1:1 or 4:5 Carousel/Video | Static or ≤ 60s | Caption, First Comment Hashtags |
| **SoundCloud** | Audio Stream (MP3/WAV) | Full Track | Genre, BPM, Key, Download Permissions |
| **Bandcamp** | Master Audio (FLAC/WAV) | Full Track / Album | Price, Release Date, Lyrics, Liner Notes |

## 3. Derivative Generation Flow
1. **Source Anchor Selection:** Choose `MainVideo` from an active `Project`.
2. **Clip Extraction Marker:** Identify timestamp range (`start`: `"02:15"`, `end`: `"03:00"`).
3. **Platform Adaptation:** Customize hook, caption, hashtags, and schedule drop time.
4. **Calendar Insertion:** Automatic generation of a `CalendarEvent` tied to the sub-content item.

## 4. SubContent Entity Schema
```json
{
  "id": "sub_uuid",
  "projectId": "proj_uuid",
  "mainVideoId": "vid_uuid",
  "platform": "youtube_shorts | tiktok | instagram_reels | instagram_post | soundcloud | bandcamp | other",
  "title": "String",
  "clipTimestamps": {
    "start": "MM:SS",
    "end": "MM:SS",
    "notes": "Description of clip hook"
  },
  "caption": "Platform-specific caption/copy",
  "hashtags": ["list", "of", "tags"],
  "assetUrl": "URL or local storage path",
  "status": "draft | clipped | edited | scheduled | posted",
  "scheduledDate": "ISO-8601 DateTime",
  "metadata": {
    "aspectRatio": "9:16 | 16:9 | 1:1",
    "audioTrack": "String",
    "bandcampPrice": "Number or null",
    "soundCloudStreamUrl": "String or null"
  }
}
```

## 5. Error & Edge Case Handling
- If `scheduledDate` conflicts with another drop on the same platform within 2 hours, flag a schedule warning.
- Missing timestamps trigger a "Full Video Repost" flag.
