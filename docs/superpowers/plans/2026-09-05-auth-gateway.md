# Scenic Auth Gateway & Supabase Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bespoke, token-disciplined sign up/login screen featuring crossfading scenic nature backdrops, an inner photo-in-photo window, and complete Supabase Email/Password and Google OAuth authentication with guest mode bypass.

**Architecture:** A centralized `AuthContext` backed by `supabaseClient.js` provides session and user state. When unauthenticated and not in guest mode, `App.jsx` renders `<AuthGatewayView />`, a dual-column floating card whose heading uses `var(--font-anthropic-serif)` and body/inputs use `var(--font-anthropic-sans)`. The background and right-column viewport crossfade smoothly between high-definition nature vistas.

**Tech Stack:** React 18, Vite, `@supabase/supabase-js`, `lucide-react`, Vanilla CSS with Anthropic Design Tokens.

**Spec:** [docs/superpowers/specs/2026-09-05-auth-gateway-design.md](file:///c:/Users/User/Desktop/Coding/Projects/ProjectVault/docs/superpowers/specs/2026-09-05-auth-gateway-design.md)

## Global Constraints

- Headings MUST use `var(--font-anthropic-serif)`.
- Body copy, inputs, buttons, helper text, and subtitles MUST use `var(--font-anthropic-sans)`.
- Code/meta values MUST use `var(--font-anthropic-mono)`.
- Color and surface tokens MUST use Anthropic tokens (`var(--surface-card-surface)`, `var(--color-slate-dark)`, `var(--color-clay)`, `var(--color-stone)`, etc.).
- Never hardcode arbitrary colors or font families.
- Never log, expose, or store passwords in plaintext.
- Never read or print secret `.env` credentials; only consume `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Provide a zero-crash mock fallback in development when Supabase keys are not yet configured in `.env`.

---

### Task 1: Supabase Dependency & Client Setup

**Files:**
- Modify: `package.json`
- Create: `src/services/supabaseClient.js`
- Modify: `.env.example`

**Interfaces:**
- Consumes: `import.meta.env.VITE_SUPABASE_URL`, `import.meta.env.VITE_SUPABASE_ANON_KEY`
- Produces:
  - `supabase`: SupabaseClient instance (or null in mock mode)
  - `isSupabaseConfigured`: boolean
  - `mockAuth`: Object exposing simulated `signUp`, `signInWithPassword`, `signOut`, `getSession`

- [ ] **Step 1: Install `@supabase/supabase-js`**

Run: `npm install @supabase/supabase-js`

- [ ] **Step 2: Create `src/services/supabaseClient.js` with config detection and mock resilience**

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

// Lightweight mock provider for local development without live credentials
const MOCK_STORAGE_KEY = 'projectvault_mock_auth_session';

export const mockAuth = {
  getSession: () => {
    try {
      const data = localStorage.getItem(MOCK_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  signUp: async ({ email, password }) => {
    await new Promise((r) => setTimeout(r, 450));
    if (!email || !password) throw new Error('Email and password are required');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');
    const user = {
      id: `mock-user-${Date.now()}`,
      email,
      user_metadata: { full_name: email.split('@')[0] }
    };
    const session = { access_token: `mock-token-${Date.now()}`, user };
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(session));
    return { data: { user, session }, error: null };
  },
  signInWithPassword: async ({ email, password }) => {
    await new Promise((r) => setTimeout(r, 450));
    if (!email || !password) throw new Error('Email and password are required');
    const user = {
      id: `mock-user-current`,
      email,
      user_metadata: { full_name: email.split('@')[0] }
    };
    const session = { access_token: `mock-token-current`, user };
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(session));
    return { data: { user, session }, error: null };
  },
  signOut: async () => {
    await new Promise((r) => setTimeout(r, 200));
    localStorage.removeItem(MOCK_STORAGE_KEY);
    return { error: null };
  }
};
```

- [ ] **Step 3: Update `.env.example`**

Ensure `.env.example` contains:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 4: Verify installation and compilation**

Run: `node -e "import('./src/services/supabaseClient.js').then(() => console.log('Client loaded successfully'))"`
Expected: Prints `Client loaded successfully`.

---

### Task 2: Curate Scenic Background Assets & Pipeline

**Files:**
- Create: `public/assets/auth/scene-1.jpg`
- Create: `public/assets/auth/scene-2.jpg`
- Create: `public/assets/auth/scene-3.jpg`
- Create: `public/assets/auth/scene-4.jpg`
- Create: `src/utils/authScenes.js`

**Interfaces:**
- Consumes: Image files in `design-inspo/login-screen/` and static assets
- Produces: `AUTH_SCENES` array containing `{ id, title, location, url }`

- [ ] **Step 1: Set up runtime scenic assets in `public/assets/auth/`**

Copy the user's reference scenic images into `public/assets/auth/` as high-definition runtime assets:
- Copy `design-inspo/login-screen/login-inspo-1.jpg` to `public/assets/auth/scene-1.jpg` (Valley Vista)
- Copy `design-inspo/login-screen/login-inspo-2.jpg` to `public/assets/auth/scene-2.jpg` (Alpine Meadow)
- Fetch or generate 2 complementary atmospheric nature scenes for `scene-3.jpg` and `scene-4.jpg` with matching lush mountain aesthetics.

- [ ] **Step 2: Create `src/utils/authScenes.js`**

```javascript
export const AUTH_SCENES = [
  {
    id: 'valley-vista',
    title: 'Emerald Valley & Cloudscape',
    location: 'Alpine Ridge',
    url: '/assets/auth/scene-1.jpg'
  },
  {
    id: 'alpine-meadow',
    title: 'Wildflower Basin at Sunset',
    location: 'High Sierra Pass',
    url: '/assets/auth/scene-2.jpg'
  },
  {
    id: 'misty-lake',
    title: 'Emerald Pine Lake',
    location: 'Cascade Range',
    url: '/assets/auth/scene-3.jpg'
  },
  {
    id: 'golden-ridge',
    title: 'Golden Hour Summit',
    location: 'Rocky Escarpment',
    url: '/assets/auth/scene-4.jpg'
  }
];

export function preloadScenes(scenes = AUTH_SCENES) {
  scenes.forEach((scene) => {
    const img = new Image();
    img.src = scene.url;
  });
}
```

- [ ] **Step 3: Verify assets exist and load**

Verify that all 4 files in `public/assets/auth/` are present.

---

### Task 3: AuthContext & State Management

**Files:**
- Create: `src/context/AuthContext.jsx`
- Modify: `src/main.jsx`

**Interfaces:**
- Consumes: `supabase`, `mockAuth`, `isSupabaseConfigured` from `supabaseClient.js`
- Produces: `useAuth()` hook returning:
  - `user`: User | null
  - `session`: Session | null
  - `isGuest`: boolean
  - `isLoading`: boolean
  - `authError`: string | null
  - `signUp(email, password)`: Promise<void>
  - `signIn(email, password)`: Promise<void>
  - `signInWithGoogle()`: Promise<void>
  - `signOut()`: Promise<void>
  - `continueAsGuest()`: void
  - `clearError()`: void

- [ ] **Step 1: Write `src/context/AuthContext.jsx`**

Implement `AuthProvider` managing:
- Persistent guest state in `localStorage` (`projectvault_guest_mode`)
- Initial session check with Supabase (`supabase.auth.getSession()` or `mockAuth.getSession()`)
- Realtime auth listener (`supabase.auth.onAuthStateChange`)
- Methods for `signUp`, `signIn`, `signInWithGoogle`, `signOut`, `continueAsGuest`

- [ ] **Step 2: Wrap `<App />` with `<AuthProvider>` in `src/main.jsx`**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

---

### Task 4: Scenic Auth Gateway Component & Styling

**Files:**
- Create: `src/components/AuthGatewayView.jsx`
- Create: `src/styles/auth.css`

**Interfaces:**
- Consumes: `useAuth()` from `src/context/AuthContext`, `AUTH_SCENES`, `preloadScenes` from `src/utils/authScenes`
- Produces: `<AuthGatewayView />` component

- [ ] **Step 1: Write `src/styles/auth.css` with strict Anthropic token discipline**

Styles will declare:
- `.auth-viewport`: full viewport container (`100vw`, `100vh`, `position: relative`, `overflow: hidden`).
- `.auth-bg-layer`: absolute cover elements with `opacity` transition for smooth 1.6s crossfades.
- `.auth-center-card`: centered dual-column container with `background: var(--surface-card-surface)` (or `#ffffff`), `border-radius: var(--radius-3xl)`, subtle border hairline `1px solid var(--color-stone)`, soft elevation.
- `.auth-heading`: **strictly** `font-family: var(--font-anthropic-serif)`, `font-size: var(--text-2xl)`, `font-weight: 600`.
- `.auth-body`, `.auth-subtitle`, `.auth-input`, `.auth-btn`, `.auth-guest-link`: **strictly** `font-family: var(--font-anthropic-sans)`.
- `.auth-input-wrapper`: relative box for password field with toggleable eye button.
- `.auth-submit-btn`: dark solid CTA button (`background: var(--color-slate-dark)`), rounded (`var(--radius-buttons)`), hover state.
- `.auth-google-btn`: clean outlined button with official multicolor Google "G" SVG icon.
- `.auth-window-pane`: inner rounded viewport (`border-radius: 24px`) displaying the active scenic image, synced to the background.
- Responsive queries: at `@media (max-width: 860px)`, collapse right column and adjust card width.

- [ ] **Step 2: Write `src/components/AuthGatewayView.jsx`**

Implement:
- Scene rotation timer (`setInterval` every 7500ms).
- Mode toggle (`isSignUp` state: `"Create an account"` vs `"Welcome back"`).
- Password visibility toggle (`showPassword`).
- Validation: email check, password minimum length check.
- Error banner styling for auth error feedback.
- Google OAuth trigger and guest bypass link (`continueAsGuest`).

---

### Task 5: App Gating & Sidebar Integration

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/GlassSidebar.jsx`
- Modify: `src/styles/sidebar.css`

**Interfaces:**
- Consumes: `user`, `isGuest`, `isLoading`, `signOut` from `useAuth()`
- Produces:
  - Conditional rendering: unauthenticated visitors see `<AuthGatewayView />`, authenticated or guest users see `<FramedWindow>`
  - Reactive user badge in sidebar footer with avatar, name/email, and logout trigger

- [ ] **Step 1: Update `src/App.jsx` with access gating**

```jsx
const { user, isGuest, isLoading } = useAuth();

if (isLoading) {
  return <div className="auth-loading-screen">...</div>;
}

if (!user && !isGuest) {
  return <AuthGatewayView />;
}

return (
  <FramedWindow ...>
    ...
  </FramedWindow>
);
```

- [ ] **Step 2: Update `src/components/GlassSidebar.jsx` with dynamic user profile and logout**

- Show authenticated user's email / display name.
- If in guest mode, show `"Guest Creator"` with a `"Sign In"` button.
- Provide a subtle Log Out icon button (`LogOut` from `lucide-react`) to call `signOut()`.

- [ ] **Step 3: Update `src/styles/sidebar.css`**

Add styling for sidebar user profile actions, guest badge, and logout button.

---

### Task 6: Verification & End-to-End Validation

**Files:**
- Verification only

- [ ] **Step 1: Execute build sanity check**

Run: `npm run build`
Expected: Build succeeds with zero compile errors.

- [ ] **Step 2: Verify in browser with subagent / local dev server**

Verify:
1. Unauthenticated page loads the scenic gateway card.
2. Background and inner frame crossfade between scenic vistas every 7.5s.
3. Typography inspection: Heading uses `var(--font-anthropic-serif)`, inputs/body use `var(--font-anthropic-sans)`.
4. Sign-up validation triggers on invalid email or short password.
5. "Continue as Guest" successfully transitions into the studio workspace.
6. Sidebar displays guest badge; clicking "Sign In" or logout returns to the auth gateway.
7. Mock / Supabase login signs in and displays email in sidebar.
