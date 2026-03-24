# Our Journey — A Private Travel Photo Album

A full-stack travel photo and video album web application with authentication, cloud storage, drag-and-drop uploads, and a guest demo mode. Built with a warm, editorial design aesthetic.

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000?style=for-the-badge&logo=vercel)

**Live Demo:** [our-journey-hazel.vercel.app](https://our-journey-hazel.vercel.app) — click **"View as Guest"** to explore

---

## Features

### Core
- **Authentication** — Email/password login via Supabase Auth with protected routes
- **Trip Albums** — Create, view, and delete albums with destination, dates, description, and cover photos
- **Media Uploads** — Drag-and-drop photo and video upload with real-time progress tracking
- **Lightbox Viewer** — Full-screen media viewer with keyboard navigation (arrow keys, Escape)
- **Masonry Grid** — Responsive Pinterest-style layout using CSS columns
- **Album Management** — Set cover photos, delete individual media, or remove entire albums with cascade

### Guest Demo Mode
- **One-Click Access** — No account required, uses a browser cookie for session
- **Read-Only** — Guests see sample demo albums with Unsplash photos
- **Privacy** — Real user data is never exposed to guest sessions
- **Hidden Controls** — Upload, delete, and edit actions are conditionally hidden

### Design
- **Editorial Aesthetic** — Warm color palette (espresso, cream, gold, sand)
- **Premium Typography** — Cormorant Garamond (serif) + DM Sans (sans-serif) via Google Fonts
- **Micro-Animations** — Fade-ins, hover lifts, staggered reveals, glass-effect navbar
- **Responsive** — Fully responsive across desktop, tablet, and mobile

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth & Database | Supabase (Auth, PostgreSQL, Storage) |
| Deployment | Vercel |
| Fonts | Google Fonts (Cormorant Garamond, DM Sans) |

---

## Project Structure

```
our-journey/
├── app/
│   ├── layout.tsx            # Root layout with AuthGuard + GuestProvider
│   ├── page.tsx              # Home — hero, album grid, recent memories
│   ├── login/page.tsx        # Login page with guest mode button
│   └── albums/
│       ├── page.tsx          # Albums list
│       ├── new/page.tsx      # Create new album
│       └── [id]/page.tsx     # Album detail — masonry grid, lightbox, uploads
├── components/
│   ├── AuthGuard.tsx         # Client-side auth wrapper (cookie-based guest support)
│   ├── GuestContext.tsx      # Guest mode context provider
│   ├── Navbar.tsx            # Sticky navigation with glass effect
│   ├── Lightbox.tsx          # Full-screen media viewer
│   ├── MasonryGrid.tsx       # CSS columns masonry layout
│   ├── FileUpload.tsx        # Drag-and-drop uploader with progress bars
│   └── Skeleton.tsx          # Loading skeleton components
├── lib/
│   ├── supabase.ts           # Browser Supabase client
│   ├── supabase-server.ts    # Server-side Supabase client (cookies)
│   └── demo-data.ts          # Sample albums and photos for guest mode
├── types/index.ts            # TypeScript interfaces (Album, Media)
└── middleware.ts             # Route protection (Supabase auth + guest cookie)
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- [Supabase](https://supabase.com) account (free tier)

### 1. Clone and Install

```bash
git clone https://github.com/shreyanshgupta44/our-journey.git
cd our-journey
npm install
```

### 2. Supabase Setup

Create a project at [supabase.com](https://supabase.com), then run this SQL in the **SQL Editor**:

```sql
-- Albums table
CREATE TABLE albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  destination TEXT,
  date_from DATE,
  date_to DATE,
  description TEXT,
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media table
CREATE TABLE media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT CHECK (type IN ('image', 'video')) DEFAULT 'image',
  filename TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_select_albums" ON albums FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_albums" ON albums FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_albums" ON albums FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth_delete_albums" ON albums FOR DELETE TO authenticated USING (true);

CREATE POLICY "auth_select_media" ON media FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_media" ON media FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_delete_media" ON media FOR DELETE TO authenticated USING (true);
```

### 3. Storage Bucket

In Supabase Dashboard, go to **Storage** and create a public bucket named `travel-media`, then add these policies:

```sql
CREATE POLICY "auth_upload" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'travel-media');
CREATE POLICY "public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'travel-media');
CREATE POLICY "auth_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'travel-media');
```

### 4. Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these values in Supabase **Settings > API**.

### 5. Create Users

In Supabase **Authentication > Users > Add User**, create your accounts with "Auto Confirm User" checked.

### 6. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) > **New Project** > Import your repo
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy

---

## Architecture

```
┌──────────────────────────────────────────────┐
│                Vercel (CDN)                   │
│  Next.js App Router + Middleware (Auth/Guest) │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│              Supabase Cloud                   │
│  ┌─────────┐  ┌───────────┐  ┌────────────┐  │
│  │  Auth   │  │ PostgreSQL│  │  Storage   │  │
│  │ (Email) │  │ (Albums,  │  │ (Photos,  │  │
│  │         │  │  Media)   │  │  Videos)  │  │
│  └─────────┘  └───────────┘  └────────────┘  │
└──────────────────────────────────────────────┘
```

---

## License

MIT
