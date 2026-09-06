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
  if (typeof window === 'undefined') return;
  scenes.forEach((scene) => {
    const img = new Image();
    img.src = scene.url;
  });
}
