import { Album, Media } from "@/types";

// Demo albums for guest users — no real personal data is shown
export const DEMO_ALBUMS: Album[] = [
  {
    id: "demo-1",
    name: "Summer in Santorini",
    destination: "Santorini, Greece",
    date_from: "2025-06-15",
    date_to: "2025-06-22",
    description: "Sunsets over the caldera, white-washed villages, and the bluest waters we've ever seen.",
    cover_url: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
    created_at: "2025-06-15T00:00:00Z",
    media_count: 4,
    photo_count: 4,
    video_count: 0,
  },
  {
    id: "demo-2",
    name: "Tokyo Drift",
    destination: "Tokyo, Japan",
    date_from: "2025-03-20",
    date_to: "2025-03-28",
    description: "Cherry blossoms, ramen alleys, and neon-lit nights in the world's greatest city.",
    cover_url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    created_at: "2025-03-20T00:00:00Z",
    media_count: 4,
    photo_count: 4,
    video_count: 0,
  },
  {
    id: "demo-3",
    name: "Parisian Mornings",
    destination: "Paris, France",
    date_from: "2024-12-20",
    date_to: "2024-12-27",
    description: "Croissants at dawn, the Eiffel Tower at dusk, and love in every arrondissement.",
    cover_url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    created_at: "2024-12-20T00:00:00Z",
    media_count: 4,
    photo_count: 4,
    video_count: 0,
  },
];

// Demo media for guest users
export const DEMO_MEDIA: Record<string, Media[]> = {
  "demo-1": [
    { id: "dm-1", album_id: "demo-1", url: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80", type: "image", filename: "santorini-sunset.jpg", uploaded_at: "2025-06-16T10:00:00Z" },
    { id: "dm-2", album_id: "demo-1", url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80", type: "image", filename: "blue-dome.jpg", uploaded_at: "2025-06-17T10:00:00Z" },
    { id: "dm-3", album_id: "demo-1", url: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=800&q=80", type: "image", filename: "oia-village.jpg", uploaded_at: "2025-06-18T10:00:00Z" },
    { id: "dm-4", album_id: "demo-1", url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80", type: "image", filename: "greek-sea.jpg", uploaded_at: "2025-06-19T10:00:00Z" },
  ],
  "demo-2": [
    { id: "dm-5", album_id: "demo-2", url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80", type: "image", filename: "tokyo-tower.jpg", uploaded_at: "2025-03-21T10:00:00Z" },
    { id: "dm-6", album_id: "demo-2", url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80", type: "image", filename: "shibuya.jpg", uploaded_at: "2025-03-22T10:00:00Z" },
    { id: "dm-7", album_id: "demo-2", url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80", type: "image", filename: "cherry-blossom.jpg", uploaded_at: "2025-03-23T10:00:00Z" },
    { id: "dm-8", album_id: "demo-2", url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80", type: "image", filename: "temple.jpg", uploaded_at: "2025-03-24T10:00:00Z" },
  ],
  "demo-3": [
    { id: "dm-9", album_id: "demo-3", url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80", type: "image", filename: "eiffel-tower.jpg", uploaded_at: "2024-12-21T10:00:00Z" },
    { id: "dm-10", album_id: "demo-3", url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80", type: "image", filename: "louvre.jpg", uploaded_at: "2024-12-22T10:00:00Z" },
    { id: "dm-11", album_id: "demo-3", url: "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800&q=80", type: "image", filename: "seine-river.jpg", uploaded_at: "2024-12-23T10:00:00Z" },
    { id: "dm-12", album_id: "demo-3", url: "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800&q=80", type: "image", filename: "montmartre.jpg", uploaded_at: "2024-12-24T10:00:00Z" },
  ],
};

export const ALL_DEMO_MEDIA: Media[] = Object.values(DEMO_MEDIA).flat();
