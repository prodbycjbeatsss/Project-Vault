# GEMINI.md - Project Constitution & Law

## 1. System Identity & Mission
**System Pilot** operating under the **B.L.A.S.T.** (Blueprint, Link, Architect, Stylize, Trigger) protocol and **A.N.T.** 3-layer architecture.

## 2. A.N.T. 3-Layer Architecture
- **Layer 1: Architecture (`architecture/`):** Technical SOPs in Markdown defining goals, inputs, tool logic, and edge cases. (*Golden Rule:* If logic changes, update the SOP before updating the code).
- **Layer 2: Navigation:** Reasoning and routing layer between SOPs and Tools.
- **Layer 3: Tools (`tools/`):** Deterministic, atomic Python scripts. Configs and tokens from `.env`.
- **Workbench (`.tmp/`):** Ephemeral intermediate workbench.

## 3. Inviolable Architectural Invariants
1. **Reliability over speed:** Never guess business logic.
2. **Data-First Rule:** No tool in `tools/` may be authored before the JSON Data Schema is fully documented and confirmed here.
3. **Strict Separation:** Local ephemeral operations stay in `.tmp/`; final delivery payload targets cloud/destination.
4. **Self-Annealing Repair Loop:**
   1. Analyze stack trace / error message.
   2. Patch script in `tools/`.
   3. Test verification.
   4. Update architecture SOP in `architecture/` so the error never repeats.

## 4. Data Schemas (Entities & Payloads)

### Entity: Project
```json
{
  "id": "proj_123e4567-e89b-12d3-a456-426614174000",
  "title": "Summer Lo-Fi Beat Tape - Ep. 1",
  "description": "Full production breakdown and track release campaign",
  "category": "Beat Breakdown & Release",
  "status": "in-progress",
  "targetReleaseDate": "2026-09-15T18:00:00Z",
  "tags": ["lofi", "ableton", "production", "tutorial"],
  "createdAt": "2026-09-04T12:00:00Z",
  "updatedAt": "2026-09-04T12:00:00Z"
}
```

### Entity: MainVideo
```json
{
  "id": "vid_main_12345",
  "projectId": "proj_123e4567-e89b-12d3-a456-426614174000",
  "title": "How I Produced a Nostalgic Lo-Fi Beat in 30 Minutes",
  "videoUrl": "https://www.youtube.com/watch?v=example",
  "thumbnailUrl": "https://images.unsplash.com/photo-example",
  "description": "Walkthrough of chords, drums, and sidechaining techniques.",
  "durationSeconds": 720,
  "status": "editing",
  "bpm": 85,
  "musicalKey": "F Minor",
  "scheduledDate": "2026-09-15T18:00:00Z",
  "tags": ["beatmaking", "tutorial", "producer"]
}
```

### Entity: SubContent (Derivative Drops)
```json
{
  "id": "sub_98765",
  "projectId": "proj_123e4567-e89b-12d3-a456-426614174000",
  "mainVideoId": "vid_main_12345",
  "platform": "youtube_shorts",
  "title": "The Secret Sauce to Lo-Fi Chords #shorts",
  "clipTimestamps": {
    "start": "02:15",
    "end": "03:00",
    "notes": "Fast hook showing the Rhodes chord progression"
  },
  "caption": "Save this progression for your next beat! Full breakdown on channel. #musicproducer #lofi",
  "hashtags": ["musicproducer", "lofi", "shorts", "beats"],
  "assetUrl": "https://drive.google.com/clip-export.mp4",
  "status": "scheduled",
  "scheduledDate": "2026-09-16T15:00:00Z",
  "metadata": {
    "aspectRatio": "9:16",
    "audioTrack": "Original Audio",
    "bandcampPrice": null,
    "soundCloudStreamUrl": null
  }
}
```

### Entity: Task (Checklist)
```json
{
  "id": "task_54321",
  "projectId": "proj_123e4567-e89b-12d3-a456-426614174000",
  "subContentId": "sub_98765",
  "title": "Render vertical 9:16 hook clip",
  "completed": false,
  "dueDate": "2026-09-14T12:00:00Z",
  "priority": "high"
}
```

### Aggregate Payload: Project Overview (Dashboard / Calendar)
```json
{
  "project": {},
  "mainVideo": {},
  "subContentItems": [],
  "tasks": [],
  "stats": {
    "totalSubContent": 4,
    "completedSubContent": 1,
    "pendingTasks": 3,
    "nextDropDate": "2026-09-15T18:00:00Z"
  }
}
```

## 5. Maintenance & Incident Log
- **Initialization:** Memory initialized under Protocol 0. Consolidated constitution into `gemini.md`. Awaiting Discovery answers.
