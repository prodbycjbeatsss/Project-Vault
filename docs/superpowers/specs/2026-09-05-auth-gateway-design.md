# Design Spec: Scenic Auth Gateway & Supabase Authentication

**Date:** 2026-09-05  
**Topic:** Sign Up / Login Screen & Supabase Authentication  
**Status:** Validated & Ready for Planning  

---

## 1. Overview & Objectives

ProjectVault requires an authentic, immersive, and secure account creation and sign-in experience supporting both **Email/Password** and **Google OAuth**, along with a **"Continue as Guest"** bypass for instant studio previewing.

The visual direction follows the user's reference designs:
- A centered, rounded floating card positioned over a full-viewport ambient nature landscape.
- The left column hosts the authentication forms, branding, and OAuth buttons.
- The right column acts as a photo-in-photo window framing the scenic landscape.
- Atmospheric nature scenes crossfade smoothly in the background and within the window frame.
- Strict typography discipline utilizing the design tokens (`var(--font-anthropic-serif)` for headings, `var(--font-anthropic-sans)` for body, inputs, and UI chrome).

---

## 2. Visual Architecture & Component Layout

### 2.1 Component: `AuthGatewayView.jsx`
Positioned at the root level when unauthenticated, taking up 100vw and 100vh.

```
+-----------------------------------------------------------------------------+
| FULL-VIEWPORT AMBIENT SCENIC BACKGROUND (Layered Crossfade)                |
|                                                                             |
|            +-------------------------+-------------------------+            |
|            | LEFT COLUMN             | RIGHT COLUMN            |            |
|            |                         |                         |            |
|            | [Icon] ProjectVault     | [ SCENIC WINDOW FRAME ] |            |
|            |                         |                         |            |
|            | Create an account       | High-resolution scenic  |            |
|            | Enter your credentials  | nature photo matching   |            |
|            | to get started...       | the ambient background  |            |
|            |                         | with inner rounded      |            |
|            | [ Enter your email    ] | corners (radius-3xl)    |            |
|            | [ Enter password   (o)] |                         |            |
|            |                         |                         |            |
|            | [ Continue            ] | [ . . . ] indicators    |            |
|            |                         |                         |            |
|            | --------- OR ---------- |                         |            |
|            |                         |                         |            |
|            | [ G  Continue w/ Google]|                         |            |
|            |                         |                         |            |
|            | Already have account?   |                         |            |
|            | Login Now               |                         |            |
|            |                         |                         |            |
|            | Terms & Privacy copy    |                         |            |
|            | Continue as Guest ->    |                         |            |
|            +-------------------------+-------------------------+            |
+-----------------------------------------------------------------------------+
```

### 2.2 Left Column Details
1. **Brand Header**:
   - Studio icon (`AudioWaveform` with 2.2 stroke width) nested in a subtle ivory badge.
   - Wordmark `"ProjectVault"` with letter-spacing `-0.02em` in `var(--font-anthropic-sans)`.
2. **Headings & Copy**:
   - Heading: `"Create an account"` (Sign Up mode) or `"Welcome back"` (Login mode).
   - Heading Font: Strictly `var(--font-anthropic-serif)`, weight `600`, size `28px`.
   - Subtitle: `"Enter your credentials to get started with ProjectVault"`, font `var(--font-anthropic-sans)`.
3. **Input Controls**:
   - Email Input: `type="email"`, placeholder `"Enter your email"`.
   - Password Input: `type={showPassword ? "text" : "password"}`, with an interactive show/hide toggle (`Eye` / `EyeOff` icons from `lucide-react`).
   - Inputs styled using `var(--surface-card-surface)`, `1px solid var(--color-stone)`, `var(--radius-inputs)`, and focused with a warm clay accent ring.
4. **Action Buttons**:
   - Primary Submit: `"Continue"`, solid button in `var(--color-slate-dark)` with smooth scale-down active state and loading spinner indicator.
   - Divider: Clean horizontal rule labeled `"OR"` in `var(--color-cloud-medium)`.
   - Google OAuth Button: Outlined card button with official colored Google "G" logo and hover elevation.
5. **Mode Switching & Bypass**:
   - Toggle switch: `"Already have an account? Login Now"` / `"Don't have an account? Sign Up"`.
   - Legal notice: `"By clicking on continue, you agree to our Terms of Service and Privacy Policy."`
   - Guest bypass link: `"Continue as Guest →"`, styled with `.btn-link` allowing one-click exploration of the studio.

### 2.3 Right Column Details
- Embedded scenic viewport with `border-radius: 24px` (`var(--radius-3xl)`), framing the active landscape image.
- Synchronized crossfade matching the ambient viewport background.
- Translucent scene pill indicators allowing direct scene switching.
- Responsive collapse: Collapses neatly to a single column on screens narrower than `860px`.

---

## 3. Design Tokens & Typography Enforcement

All styling in `src/styles/auth.css` references CSS custom properties from [variables.css](file:///c:/Users/User/Desktop/Coding/Projects/ProjectVault/src/styles/variables.css):

| Element | Token Applied | Fallback / Value |
| :--- | :--- | :--- |
| **Main Card Heading** | `var(--font-anthropic-serif)` | `'Source Serif 4', Georgia, serif` |
| **Body, Inputs, Subtitles, Buttons** | `var(--font-anthropic-sans)` | `'Inter', system-ui, sans-serif` |
| **Card Surface Fill** | `var(--surface-card-surface)` | `#faf9f5` (Ivory Light) |
| **Card Outer Radius** | `var(--radius-3xl)` | `24px` (or `28px` container clamp) |
| **Input Radius** | `var(--radius-inputs)` | `8px` |
| **Button Radius** | `var(--radius-buttons)` | `12px` |
| **Primary Accent Ring** | `var(--color-clay)` | `#8a2929` (Terracotta warmth) |
| **Border Hairline** | `var(--color-stone)` | `#cccbc8` |

Changing font families or theme variables in `variables.css` automatically reflects across the authentication views without any CSS overrides.

---

## 4. Scenic Background Crossfade System

### 4.1 Asset Repository
- Original user inspiration screenshots preserved in [design-inspo/login-screen/](file:///c:/Users/User/Desktop/Coding/Projects/ProjectVault/design-inspo/login-screen/):
  - `login-inspo-1.jpg` (Lush green mountain valley)
  - `login-inspo-2.jpg` (Alpine wildflower meadow sunset)
- Runtime high-definition landscape assets placed in `public/assets/auth/`:
  - `scene-1.jpg`: Mountain valley and dramatic clouds
  - `scene-2.jpg`: Alpine wildflower meadow at golden hour
  - `scene-3.jpg`: Serene emerald mountain lake and pine forest
  - `scene-4.jpg`: Misty summit ridge at sunrise

### 4.2 Crossfade Mechanics
- Double-buffered image rendering with `opacity` crossfade (`transition: opacity 1.6s cubic-bezier(0.4, 0, 0.2, 1)`).
- 7.5-second rotation timer with automatic clean-up on unmount.
- Preloading hook pre-fetches all images into memory on initial mount to guarantee zero flicker.

---

## 5. Authentication State & Supabase Integration

### 5.1 Supabase Client (`src/services/supabaseClient.js`)
- Configured with `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`.
- Built with automatic detection:
  - If keys are valid, connects directly to Supabase Auth API.
  - If keys are missing or set to placeholder defaults, switches into **Local Simulation Mode** with a non-intrusive console notice, allowing instant UI and session testing without runtime exceptions.

### 5.2 Context Provider (`src/context/AuthContext.jsx`)
- Wrapped around `<App />` in `src/main.jsx`.
- Exposes:
  - `user`: Authenticated user metadata (`id`, `email`, `user_metadata`).
  - `session`: Supabase session token.
  - `isGuest`: Boolean indicating bypass status.
  - `isLoading`: Initial session check state.
  - `authError`: Error string for UI feedback.
  - `signUp(email, password)`: Email registration with Supabase.
  - `signIn(email, password)`: Email login with Supabase.
  - `signInWithGoogle()`: OAuth initiation via Supabase PKCE flow.
  - `signOut()`: Session clearance and return to auth gate.
  - `continueAsGuest()`: Activates guest mode.

### 5.3 App Gate & Sidebar Profile
- **App Gate ([App.jsx](file:///c:/Users/User/Desktop/Coding/Projects/ProjectVault/src/App.jsx))**:
  - `!user && !isGuest`: Renders `<AuthGatewayView />`.
  - `user || isGuest`: Renders `<FramedWindow>` with full studio features.
- **Sidebar Integration ([GlassSidebar.jsx](file:///c:/Users/User/Desktop/Coding/Projects/ProjectVault/src/components/GlassSidebar.jsx))**:
  - Updates the bottom user profile card with user's email/name, or `"Guest Creator"`.
  - Includes quick sign-out / switch account functionality.

---

## 6. Security Standards

1. **PKCE Flow for OAuth**: Supabase v2 PKCE flow ensures authorization codes cannot be intercepted or replayed.
2. **Zero Plaintext Storage**: Passwords are never logged, stored in local storage, or exposed in error states.
3. **Environment Isolation**: Only `VITE_SUPABASE_ANON_KEY` is exposed on the client; service-role keys are strictly prohibited.
4. **Form Debounce & Throttling**: Submit triggers disable while requests are in flight to prevent duplicate submissions.
5. **Sanitized Feedback**: Error messages avoid leaking raw database or backend internals.

---

## 7. Verification & Testing

1. **Visual Testing**: Verify dual-column layout, rounded borders, crossfading transitions, and responsive single-column collapse.
2. **Typography Verification**: Inspect computed styles to confirm `var(--font-anthropic-serif)` on headings and `var(--font-anthropic-sans)` on all body/input elements.
3. **Flow Testing**:
   - Sign-up flow with validation.
   - Login flow with password toggle.
   - Google OAuth trigger.
   - "Continue as Guest" bypass into studio.
   - Sign-out return to auth screen.
4. **Resilience Testing**: Confirm graceful local fallback when Supabase keys are unset.
