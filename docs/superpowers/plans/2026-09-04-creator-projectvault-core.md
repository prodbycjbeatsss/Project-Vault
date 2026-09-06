# Creator ProjectVault Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-aesthetic creator & music producer Project Manager web app featuring a framed canvas window, frosted glass sidebar (10 navigation items with muted group headers and hairline dividers), project & multi-platform sub-content pipeline (YouTube, Shorts, TikTok, Instagram, SoundCloud, Bandcamp), and an interactive day-by-day content calendar.

**Architecture:** A.N.T. 3-Layer Build (Layer 1 SOPs in `architecture/`, Layer 2 Navigation/State Routing in `src/`, Layer 3 Tools in `tools/` with `.tmp/` scratch space). Frontend built with Vite, React, and pure Vanilla CSS matching `design-inspo/folder-manager-inspo.jpg` and `folder-manager-inspo 2.jpg`.

**Tech Stack:** Vite, React, Vanilla CSS (CSS variables, glassmorphism, flex/grid layouts), local storage store compatible with Supabase/Firebase.

**Spec:** [docs/gemini.md](file:///c:/Users/User/Desktop/Coding/Projects/ProjectVault/docs/gemini.md) and [docs/findings.md](file:///c:/Users/User/Desktop/Coding/Projects/ProjectVault/docs/findings.md).

## Global Constraints
- Strictly Vanilla CSS for styling (no Tailwind CSS, no heavy UI libraries).
- Inset window framing (`padding: 24px-32px`, outer neutral desk background `#e8eaed`, inner canvas `border-radius: 28px-32px`).
- Glassmorphism sidebar (`backdrop-filter: blur(20px)`, translucent gradient, hairline separators, muted section headers).
- Data Schema strictly conforms to [docs/gemini.md](file:///c:/Users/User/Desktop/Coding/Projects/ProjectVault/docs/gemini.md) entities: `Project`, `MainVideo`, `SubContent`, `Task`, `CalendarEvent`.
- Mobile/Capacitor-friendly modular component structure.

---

### Task 1: Environment & Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `.env.example`
- Create: `.tmp/.gitkeep`

**Interfaces:**
- Produces: Working Vite React app with dev server capability and clean Vanilla CSS base.

- [ ] **Step 1: Create package.json and configuration files**
Initialize `package.json` with React, React-DOM, Lucide icons (for clean minimalist icons matching Inspo 1 & 2), and Vite.

- [ ] **Step 2: Create vite.config.js and index.html**
Configure Vite with standard React plugin, HTML entry point referencing Inter/Plus Jakarta Sans Google fonts for clean typography.

- [ ] **Step 3: Create .env.example and .tmp workbench**
Define environment variables template (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) and initialize `.tmp/` folder.

- [ ] **Step 4: Install dependencies and verify dev build**
Run `npm install` and verify `npm run build` succeeds without errors.

---

### Task 2: Architecture SOPs & Data Layer

**Files:**
- Create: `architecture/sop-project-lifecycle.md`
- Create: `architecture/sop-subcontent-repurposing.md`
- Create: `src/types/schema.js`
- Create: `src/services/storage.js`
- Create: `src/services/seedData.js`

**Interfaces:**
- Consumes: JSON Data Schemas from [docs/gemini.md](file:///c:/Users/User/Desktop/Coding/Projects/ProjectVault/docs/gemini.md).
- Produces: `storage.getProjects()`, `storage.saveProject()`, `storage.getSubContent()`, `storage.saveSubContent()`, `storage.getTasks()`, `storage.getCalendarEvents()`.

- [ ] **Step 1: Author Layer 1 Technical SOPs**
Write `architecture/sop-project-lifecycle.md` (Project creation, main video linking, status transitions) and `architecture/sop-subcontent-repurposing.md` (Deriving clips for Shorts, TikTok, Reels, Bandcamp, SoundCloud).

- [ ] **Step 2: Implement Data Models and Local Storage Service**
Create `src/services/storage.js` with full CRUD methods for `projects`, `mainVideos`, `subContent`, `tasks`. Persist to `localStorage` with automatic fallback to rich creator seed data.

- [ ] **Step 3: Create Rich Seed Data**
Create `src/services/seedData.js` populated with realistic producer projects:
  - Project 1: *"Midnight Lo-Fi Tape Ep. 1"* (YouTube main breakdown, 3 Shorts clips, TikTok snippet, SoundCloud track, Bandcamp release).
  - Project 2: *"Analog Synth Masterclass"* (YouTube tutorial, 2 Reels, 1 Short).
  - Tasks & calendar events for scheduled drop dates.

- [ ] **Step 4: Verify storage service reads and writes**
Run node test or unit assertion on `storage.js` to ensure data integrity and entity relationships.

---

### Task 3: Framed Window Canvas & Frosted Glass Sidebar

**Files:**
- Create: `src/styles/variables.css`
- Create: `src/styles/global.css`
- Create: `src/styles/frame.css`
- Create: `src/styles/sidebar.css`
- Create: `src/components/FramedWindow.jsx`
- Create: `src/components/GlassSidebar.jsx`
- Create: `src/App.jsx`
- Create: `src/main.jsx`

**Interfaces:**
- Consumes: Navigation structure from [docs/findings.md](file:///c:/Users/User/Desktop/Coding/Projects/ProjectVault/docs/findings.md).
- Produces: Framed desktop viewport layout and responsive collapsible glass sidebar.

- [ ] **Step 1: Define CSS Design Tokens**
Create `src/styles/variables.css` with exact color tokens from Inspo 1 & 2:
  - Neutral desk background: `#e8eaed` / `#dfe2e6`
  - Window frame background: `#ffffff`
  - Glass sidebar gradient: `linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(246,242,250,0.65) 100%)`
  - Active pill: `#ffffff` with `box-shadow: 0 4px 14px rgba(0,0,0,0.06)`
  - Pastel card tokens: lavender (`#ede9fe`), peach/sand (`#fef3c7`), soft blue (`#e0f2fe`), mint (`#dcfce7`).

- [ ] **Step 2: Build FramedWindow Container**
Implement `FramedWindow.jsx` with viewport padding (`24px-32px`), inner radius (`28px`), subtle outer border, and shadow.

- [ ] **Step 3: Build GlassSidebar with Muted Groups & Separators**
Implement `GlassSidebar.jsx` with:
  - App brand placeholder & collapse button
  - **WORKSPACE:** Home / Dashboard, Projects, Content Calendar
  - Hairline separator
  - **CREATIVE ASSETS:** Templates, Tags, Media
  - Hairline separator
  - **INSIGHTS & SAVED:** Analytics, Favourites
  - Hairline separator
  - **PREFERENCES:** Settings
  - User Profile Account card at the bottom (avatar, creator name, email, badge)
  - Active selection indicator using Inspo 1 rounded white pill.

- [ ] **Step 4: Verify layout renders cleanly**
Test responsive rendering of the framed layout and sidebar navigation switching.

---

### Task 4: Top Bar Header & Page Navigation Switching

**Files:**
- Create: `src/styles/topbar.css`
- Create: `src/components/TopBar.jsx`
- Create: `src/pages/HomeDashboardView.jsx`
- Create: `src/pages/ProjectsView.jsx`
- Create: `src/pages/CalendarView.jsx`
- Create: `src/pages/PlaceholderView.jsx` (for Templates, Tags, Media, Analytics, Favourites, Settings, Profile)

**Interfaces:**
- Consumes: `activeTab` state and search/filter props from `App.jsx`.
- Produces: Inspo-style Top Bar with `[⌘ F]` search, filter pills, and seamless tab switching.

- [ ] **Step 1: Build TopBar Component**
Implement `TopBar.jsx` matching Inspo 1 & 2:
  - Search input with keyboard badge `[⌘ F]`
  - Filter pills: `Status: All ∨`, `Platform: All ∨`, `Date: Any ∨`
  - Primary Action button: `+ New Project` with clean icon and elevation.

- [ ] **Step 2: Implement Tab Switching**
Connect the 10 sidebar navigation items to render their respective views, displaying clean styled headers and breadcrumbs.

- [ ] **Step 3: Verify navigation flows**
Test clicking between all 10 navigation items and verify active tab states, search bar focus, and filter triggers.

---

### Task 5: Projects & Folders View (Inspo 2 Folder & Workflow Cards)

**Files:**
- Create: `src/styles/projects.css`
- Create: `src/components/FolderCard.jsx`
- Create: `src/components/ProjectCard.jsx`
- Modify: `src/pages/ProjectsView.jsx`

**Interfaces:**
- Consumes: `projects` array from `storage.js`.
- Produces: Interactive tabbed folder cards and rich media project cards with platform badges.

- [ ] **Step 1: Build FolderCard Component**
Implement tabbed folder card shape from Inspo 2 with pastel fills (Lavender, Blue, Peach), title, item count badge (e.g. `4 items`), and action menu.

- [ ] **Step 2: Build ProjectCard Component**
Implement rich media card with:
  - Thumbnail banner header with curved cutout tab for actions
  - Status pill (`In Progress`, `Ready`, `Published`)
  - Project Title & Category
  - Multi-platform pills: YouTube, Shorts, TikTok, Instagram, SoundCloud, Bandcamp
  - Sub-content counter and progress indicator.

- [ ] **Step 3: Implement Quick Filters**
Add filter tabs (`All Projects`, `Music Releases`, `Beat Breakdowns`, `Tutorials`) and search query filtering.

---

### Task 6: Project Detail & Multi-Platform Sub-Content Repurposer

**Files:**
- Create: `src/styles/projectDetail.css`
- Create: `src/components/NewProjectModal.jsx`
- Create: `src/components/ProjectDetailModal.jsx`
- Create: `src/components/SubContentCard.jsx`
- Create: `src/components/NewSubContentModal.jsx`
- Modify: `src/pages/ProjectsView.jsx`

**Interfaces:**
- Consumes: Selected `Project` and its linked `MainVideo` and `SubContent[]`.
- Produces: Full project inspector modal, main video metadata viewer, and sub-content creator with platform-specific fields.

- [ ] **Step 1: Build NewProjectModal**
Clean modal to create a project: Title, description, genre/category, target release date, tags, and initial YouTube/video URL.

- [ ] **Step 2: Build ProjectDetailModal**
Two-panel layout:
  - Left: Main Video preview, title, URL, duration, BPM & Key tags (for music producers), and core description.
  - Right: Derived Sub-Content pipeline with "+ Add Clip / Drop" button.

- [ ] **Step 3: Build SubContentCard & NewSubContentModal**
Support platform selection (YouTube Shorts, TikTok, Instagram Reels, Instagram Post, SoundCloud, Bandcamp) with:
  - Timestamp range inputs (`01:15` - `02:00`)
  - Copy / Caption editor with character limit indicator
  - Hashtags pills
  - Drop date picker
  - Platform-specific badges (colors: YouTube red, TikTok cyan/magenta, IG gradient, SoundCloud orange, Bandcamp teal).

---

### Task 7: Content Calendar & Task Checklist (Inspo 1 Timeline)

**Files:**
- Create: `src/styles/calendar.css`
- Create: `src/styles/dashboard.css`
- Create: `src/components/CalendarRow.jsx`
- Create: `src/components/TaskChecklist.jsx`
- Modify: `src/pages/CalendarView.jsx`
- Modify: `src/pages/HomeDashboardView.jsx`

**Interfaces:**
- Consumes: Unified calendar events derived from main videos and sub-content items.
- Produces: Inspo 1-style month pill bar and day-by-day scheduled content cards.

- [ ] **Step 1: Build Calendar Month Switcher**
Horizontal pill bar (`<`, `Jan`, `Feb`, `March`, `April`...) with active black/dark pill and filter options.

- [ ] **Step 2: Build Daily Timeline Rows (Inspo 1 Layout)**
Day numbers on the left (1, 2, 3, 4...) with pastel scheduled cards:
  - Time badge (`10:00 AM`, `3:30 PM`)
  - Platform badge & icon
  - Clip title and parent project link
  - Status pill (`Scheduled`, `Confirmed`, `Draft`).

- [ ] **Step 3: Build HomeDashboardView**
Integrated creator overview:
  - Top stats row: Active Projects, Scheduled Drops this week, Pending Tasks.
  - Today & Tomorrow's Upcoming Drops timeline.
  - Needed Tasks checklist (interactive checkboxes for editing, rendering, mastering).

---

### Task 8: End-to-End Verification, Styling Polish & User Review

**Files:**
- Modify: `src/styles/*.css` for responsive refinement
- Create: `docs/superpowers/plans/walkthrough.md`
- Modify: `docs/progress.md`

- [ ] **Step 1: Verify all 10 navigation views**
Ensure smooth transitions, zero console errors, and full responsiveness across window sizes.

- [ ] **Step 2: Test full creator workflow**
Test: Create Project ➔ Link Main Video ➔ Add Shorts / TikTok / Bandcamp sub-content ➔ View in Calendar ➔ Check off production tasks.

- [ ] **Step 3: Launch dev preview & generate walkthrough**
Launch local dev server, capture UI verification screenshots/video, and update `docs/progress.md`.
