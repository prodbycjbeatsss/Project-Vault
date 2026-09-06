# Anthropic — Style Reference
> scientific field journal on warm parchment — quiet ivory surfaces, editorial serif headlines, and a single clay accent that only appears when you must act

**Theme:** light

Anthropic's interface reads like a curated research publication on warm parchment paper. Ivory and oat neutrals replace the typical cool-gray tech palette, giving every surface a paper-like quality that pairs with a custom serif used at unprecedented scale for both body and display text. A single clay-toned accent surfaces only at moments of action; everything else stays quiet and editorial. Components are flat — hairline borders and selective bottom-corner radii replace shadows as the elevation language, sans-serif handles UI chrome, and the serif carries voice.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Slate Dark | `#141413` | `--color-slate-dark` | Primary text, headings, footer background, hairline borders — near-black with a hint of warmth, never pure black |
| Ivory Medium | `#f0eee6` | `--color-ivory-medium` | Page canvas and large surface fills — the parchment background that sets the entire warm tone |
| Ivory Light | `#faf9f5` | `--color-ivory-light` | Card surfaces, elevated panels, skip-link buttons — one step brighter than canvas for subtle layering without shadows |
| Cloud Medium | `#b0aea5` | `--color-cloud-medium` | Muted helper text, inactive nav items, secondary labels — the neutral that recedes without disappearing |
| Cloud Dark | `#87867f` | `--color-cloud-dark` | Outlined button borders, mid-contrast dividers |
| Stone | `#cccbc8` | `--color-stone` | Hairline borders and dividers between sections — visible but never assertive |
| Slate Medium | `#3d3d3a` | `--color-slate-medium` | Dark-on-dark borders inside the footer |
| Oat Warm | `#e3dacc` | `--color-oat-warm` | Secondary warm surface for grouped panels and feature containers — a deeper paper tone for variety |
| Manilla | `#f5e3c7` | `--color-manilla` | Featured hero card background — vintage paper tone that signals editorial importance without color shouting |
| Clay | `#d97757` | `--color-clay` | Filled CTA buttons — the single chromatic accent in the system, a terracotta warmth that belongs to the earth-tone family rather than typical UI blue |
| Clay Deep | `#c6613f` | `--color-clay-deep` | Hover/pressed state for Clay CTAs and the canonical accent token — deeper version of the primary accent |

## Tokens — Typography

### Anthropic Serif — Editorial voice — used for display headings, body copy, card titles, and supporting paragraphs. Signals research-publication DNA. Default weight 400, emphasis 600. · `--font-anthropic-serif`
- **Substitute:** Source Serif 4, Lora, Georgia, Charter
- **Weights:** 400, 600
- **Sizes:** 14px, 18px, 20px, 24px, 32px, 36px, 61px, 68px
- **Line height:** 1.10, 1.25, 1.40, 1.43

### Anthropic Sans — UI chrome and display sans — nav links, buttons, footers, badges, counters, and small UI labels. · `--font-anthropic-sans`
- **Substitute:** Inter, system-ui, -apple-system, sans-serif
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 14px, 15px, 16px, 20px, 24px, 61px
- **Line height:** 1.00, 1.10, 1.25, 1.30, 1.40
- **Letter spacing:** -0.02em at 12px, -0.005em at 15-16px

### Anthropic Mono — Reserved for code, BPM, Key, clip timestamps, or technical snippets · `--font-anthropic-mono`
- **Substitute:** JetBrains Mono, SF Mono, monospace
- **Weights:** 400, 500
- **Sizes:** 12px, 13px, 14px, 16px
- **Line height:** 1.40

## Tokens — Spacing & Shapes

**Base unit:** 4px

### Border Radius

| Element | Value |
|---------|-------|
| nav | 0px / 8px |
| cards | 24px |
| links | 0px |
| badges | 4px / 0px |
| buttons | 8px (signature bottom-only on filled variants: 0 0 8px 8px), 12px (outlined) |
| inputs | 6px |

### Surfaces & Elevation

- **Canvas:** `#f0eee6` (Ivory Medium)
- **Card Surface:** `#faf9f5` (Ivory Light)
- **Featured Surface:** `#f5e3c7` (Manilla vintage paper tone)
- **Grouped Surface:** `#e3dacc` (Oat Warm)
- **Dividers & Hairlines:** 1px solid `#cccbc8` (Stone)
- **Elevation Language:** Flat solid fills + tone-step layering + 1px hairline borders; zero heavy blurred drop shadows.

## Components & Buttons

### Clay Filled Button
**Role:** The single chromatic CTA for the primary action (e.g. Create Project, Save, Confirm Action).
Background: `#d97757` (Clay), white text, 8px/12px radius, hover deepens to `#c6613f`.

### Filled Ivory Button
**Role:** Secondary action button on light surfaces.
Background: `#faf9f5`, text: `#141413`, 1px solid `#cccbc8`, 8px/12px radius.

### Outlined Dark / Stone Button
**Role:** Neutral action button.
Transparent or `#f0eee6` background, `#141413` text, 1px border `#87867f` or `#cccbc8`, 12px radius.

### Release Card / Folder Card
Background `#faf9f5` (Ivory Light), 24px radius, 1px hairline border in `#cccbc8`. Title in Anthropic Serif or Sans, body in serif.
