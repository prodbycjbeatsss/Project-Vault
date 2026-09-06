# SOP: Project Lifecycle Management (Layer 1 Architecture)

## 1. Purpose & Scope
This Standard Operating Procedure defines the deterministic lifecycle of a production campaign in **ProjectVault**, from initial concept to master release across YouTube and audio platforms.

## 2. Inputs & Prerequisites
- Project Title (e.g., track name, episode number, release campaign).
- Category / Genre (e.g., Beat Breakdown, Music Video, Single Release, Tutorial).
- Target Release Date (ISO string).
- Optional Tags (e.g., `["lofi", "ableton", "drums"]`).

## 3. State Machine & Transitions
```
[ Ideation / Planning ]
        ↓
 [ In-Progress / Production ] (Anchor video linked, BPM & Key tagged)
        ↓
    [ Ready ] (All derived sub-content clipped & scheduled)
        ↓
  [ Published ] (Payload synced to live platforms / channels)
        ↓
   [ Archived ]
```

## 4. Entity Specifications (Strict Schema)
- **`Project`**:
  - `id`: Unique UUID.
  - `title`: String (1-120 chars).
  - `description`: Text.
  - `category`: String.
  - `status`: `'planning' | 'in-progress' | 'ready' | 'published' | 'archived'`.
  - `targetReleaseDate`: ISO Date String.
  - `tags`: Array of strings.
  - `createdAt`, `updatedAt`: ISO Date Strings.

- **`MainVideo`** (Anchor Asset):
  - `id`: Unique UUID.
  - `projectId`: Foreign key linking to parent `Project`.
  - `title`: String.
  - `videoUrl`: External URL (YouTube unlisted preview, Drive, Vimeo).
  - `thumbnailUrl`: Image URL.
  - `durationSeconds`: Integer.
  - `bpm`: Number (optional for music producers).
  - `musicalKey`: String (e.g., "F Minor", "C Major").
  - `scheduledDate`: ISO Date String.

## 5. Failure Modes & Self-Healing
- **Missing Video URL:** Project remains in `planning` state.
- **Invalid Date Range:** Scheduled date cannot precede current creation date.
- **Orphaned Sub-Content:** Deleting a project cascades deletion to all associated sub-content and tasks.
