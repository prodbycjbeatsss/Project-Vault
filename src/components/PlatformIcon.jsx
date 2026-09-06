import React from 'react';

/**
 * PlatformIcon: Crisp vector SVG brand icons for content and music distribution platforms.
 */
export default function PlatformIcon({ platform, size = 12, className = '' }) {
  const plat = (platform || '').toLowerCase();

  if (plat === 'youtube' || plat.includes('youtube_main')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }

  if (plat === 'youtube_shorts' || plat.includes('shorts')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <path d="M17.77 10.32l-1.2-.5a3.83 3.83 0 0 0 .93-.72 4.17 4.17 0 0 0 1-2.67 4.29 4.29 0 0 0-4.29-4.29 4.2 4.2 0 0 0-2.58.91 4.7 4.7 0 0 0-.82.72l-.76.92-.76-.92a4.7 4.7 0 0 0-.82-.72 4.2 4.2 0 0 0-2.58-.91 4.29 4.29 0 0 0-4.29 4.29 4.17 4.17 0 0 0 1 2.67 3.83 3.83 0 0 0 .93.72l-1.2.5A4.47 4.47 0 0 0 0 14.54a4.57 4.57 0 0 0 4.53 4.53 4.41 4.41 0 0 0 2.68-.9 5.38 5.38 0 0 0 .84-.73l1.95 1.95A4.45 4.45 0 0 0 13.15 20.7a4.58 4.58 0 0 0 4.54-4.54 4.47 4.47 0 0 0-2.48-3.99l2.56-1.85zM10 14.5v-5l4.5 2.5-4.5 2.5z" />
      </svg>
    );
  }

  if (plat === 'tiktok') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01v8.19a7.61 7.61 0 0 1-1.32 4.34 7.65 7.65 0 0 1-5.32 3.37 7.74 7.74 0 0 1-5.63-.99A7.63 7.63 0 0 1 1.05 17.5a7.63 7.63 0 0 1 1.73-7.52 7.67 7.67 0 0 1 5.92-2.31c.36.02.72.06 1.08.13v4.18a3.57 3.57 0 0 0-1.78-.17 3.63 3.63 0 0 0-2.8 2.62 3.62 3.62 0 0 0 .8 3.56 3.63 3.63 0 0 0 3.39 1.14 3.64 3.64 0 0 0 2.92-3.41V.02h.21z" />
      </svg>
    );
  }

  if (plat.includes('instagram') || plat === 'reels') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    );
  }

  if (plat === 'soundcloud') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <path d="M11.56 8.87V17h7.22c2.32 0 4.22-1.9 4.22-4.22 0-2.3-1.85-4.17-4.14-4.22-.38-2.61-2.63-4.63-5.35-4.63-1.02 0-1.98.29-2.8.8-1.05.65-1.8 1.7-2.07 2.94-.13-.02-.27-.04-.41-.04-.79 0-1.52.32-2.06.84L6 8.5v8.5h4v-8.13zm-8.56 2.5v6H4v-6H3zm-2 1.5v4.5h1v-4.5H1z" />
      </svg>
    );
  }

  if (plat === 'bandcamp') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <path d="M0 18.75l7.437-13.5H24l-7.438 13.5H0z" />
      </svg>
    );
  }

  if (plat === 'spotify') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.495 17.305c-.216.353-.675.467-1.028.252-2.816-1.72-6.36-2.109-10.536-1.156-.405.092-.81-.161-.902-.566-.093-.404.161-.81.566-.902 4.568-1.045 8.487-.604 11.648 1.344.353.216.467.676.252 1.028zm1.467-3.262c-.272.441-.849.581-1.29.31-3.224-1.982-8.139-2.555-11.95-1.398-.498.151-1.03-.136-1.181-.634-.151-.498.136-1.03.634-1.181 4.356-1.322 9.774-.682 13.477 1.593.441.272.581.849.31 1.29v.02zm.126-3.41c-3.864-2.294-10.244-2.507-13.923-1.39-.593.18-1.222-.162-1.402-.755-.18-.593.162-1.222.755-1.402 4.231-1.284 11.278-1.036 15.733 1.609.533.316.707 1.008.391 1.541-.316.533-1.008.707-1.541.391l-.013.006z" />
      </svg>
    );
  }

  if (plat === 'original' || plat === 'original_track' || plat.includes('original')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        style={{ flexShrink: 0 }}
      >
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
    );
  }

  // Default audio/video fallback icon
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    </svg>
  );
}
