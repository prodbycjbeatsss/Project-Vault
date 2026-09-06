# Project Findings & Discoveries

## 1. System Context & Constraints
- **Framework:** B.L.A.S.T. Protocol + A.N.T. 3-Layer Architecture
- **Target Platforms:** Starts as modern Web App; responsive architecture ready to package for Android & iOS (e.g., Capacitor / PWA).
- **Database / Source of Truth:** Supabase / Firebase compatible schema (structured local persistence first, ready for cloud sync).
- **Core Workflow:** Create Project -> Link to Main Video -> Add Metadata -> Add Sub-Content (repurposed for YouTube, YouTube Shorts, TikTok, Instagram, Reels, SoundCloud, Bandcamp) -> Calendar & Task Management.
- **Operating Rules:** Step-by-step interactive progression; solicit user's external visual & workflow inspiration; zero guessing; strict verification.

## 2. Design Inspiration Analysis (from `design-inspo/`)
- **Outer Frame & Canvas:**
  - Window frame floating over a subtle neutral backdrop with inset padding and generous rounded corners (`28px`-`32px`).
  - Crisp, breathable layout with modern typography (Inter / Outfit style).
- **Glass Sidebar (Inspo 1 & 2):**
  - Frosted translucent glassmorphism with subtle warm/violet tint and soft gradient.
  - Active navigation pill: pure white with gentle drop shadow.
  - Clean minimalist line icons, section groupings (*Main Menu*, *Projects / Workflows*, *Favorites*, *Account/Profile*).
  - Badge counters (e.g. notification dots, item counts).
- **Search & Filter Controls (Inspo 1 & 2):**
  - Sleek search input with keyboard shortcut pill (`⌘ F`).
  - Filter pills (`Status: All ∨`, `Platform: Any ∨`, `Date: Any ∨`, `Tags: All ∨`).
- **Project & Folder Cards (Inspo 2):**
  - Tabbed folder cards with pastel accents (soft lavender, periwinkle, warm sand/peach, mint).
  - Project cards with rich banner/thumbnail headers, curved cutout badges, multi-platform badges, and status pills.
## 3. Verified Navigation Architecture
Organized with muted section labels, subtle separators, and grouped hierarchy (inspired by `folder-manager-inspo.jpg` & `folder-manager-inspo 2.jpg`):

- **WORKSPACE** (Muted category header)
  - 🏠 **Home / Dashboard**
  - 📁 **Projects**
  - 📅 **Content Calendar**
--- *(Subtle divider line)*
- **CREATIVE ASSETS** (Muted category header)
  - 📋 **Templates**
  - 🏷️ **Tags**
  - 🖼️ **Media**
--- *(Subtle divider line)*
- **INSIGHTS & PINNED** (Muted category header)
  - 📊 **Analytics**
  - ⭐ **Favourites**
--- *(Subtle divider line)*
- **SYSTEM / PREFERENCES** (Pinned towards bottom)
  - ⚙️ **Settings**
  - 👤 **User Profile Account** (Card layout with avatar, status & email)

- **Branding / Logo:** Temporary minimalist studio icon; finalize brand name & logo after pages and layout are established.
