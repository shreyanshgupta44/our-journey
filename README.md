<![CDATA[# ✦ Our Journey — A Love Story in Places

A private, luxury-styled couples travel photo album web app. Document every sunset, every road walked, and every memory shared — beautifully.

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000?style=for-the-badge&logo=vercel)

🔗 **Live Demo:** [our-journey-hazel.vercel.app](https://our-journey-hazel.vercel.app) — click **"View as Guest"** to explore

---

## ✨ Features

### Core Functionality
- **🔐 Private Authentication** — Email/password login via Supabase Auth, only 2 users (you & your partner)
- **📸 Trip Albums** — Create albums for each trip with destination, dates, description & cover photo
- **🖼️ Photo & Video Uploads** — Drag-and-drop upload with real-time progress bars
- **🔍 Full-Screen Lightbox** — View media in a cinematic lightbox with keyboard navigation (←/→/Esc)
- **🧱 Masonry Grid** — Pinterest-style photo layout with responsive columns
- **🎯 Album Management** — Set cover photos, delete media, remove entire albums

### Guest Mode (for Portfolio Showcase)
- **👁️ View as Guest** — One-click guest access, no account needed
- **🔒 Read-Only** — Guests see demo albums (Santorini, Tokyo, Paris) with sample photos
- **🛡️ Privacy** — Your real photos are never visible to guests
- **🚫 No Write Access** — Upload, delete, and edit buttons are hidden for guests

### Design & UX
- **📰 Editorial Aesthetic** — Warm, luxury travel magazine feel
- **🎨 Custom Palette** — Espresso, cream, gold, and sand tones
- **✒️ Premium Typography** — Cormorant Garamond (serif) + DM Sans (sans-serif)
- **💫 Micro-Animations** — Smooth fade-ins, hover lifts, and staggered reveals
- **📱 Fully Responsive** — Beautiful on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Auth & Database** | Supabase (Auth, PostgreSQL, Storage) |
| **Deployment** | Vercel |
| **Fonts** | Google Fonts (Cormorant Garamond, DM Sans) |

---

## 📁 Project Structure

```
our-journey/
├── app/
│   ├── layout.tsx          # Root layout with fonts + AuthGuard + GuestProvider
│   ├── page.tsx            # Home — hero section, album grid, recent memories
│   ├── login/page.tsx      # Login page with guest mode button
│   └── albums/
│       ├── page.tsx        # All albums grid
│       ├── new/page.tsx    # Create new trip album
│       └── [id]/page.tsx   # Album detail — masonry grid, lightbox, uploads
├── components/
│   ├── AuthGuard.tsx       # Client-side auth wrapper (supports guest cookies)
│   ├── GuestContext.tsx    # Guest mode context (cookie-based)
│   ├── Navbar.tsx          # Sticky navigation with glass effect
│   ├── Lightbox.tsx        # Full-screen media viewer
│   ├── MasonryGrid.tsx     # CSS columns masonry layout
│   ├── FileUpload.tsx      # Drag-and-drop uploader with progress
│   └── Skeleton.tsx        # Loading skeleton components
├── lib/
│   ├── supabase.ts         # Browser Supabase client
│   ├── supabase-server.ts  # Server-side Supabase client
│   └── demo-data.ts        # Demo albums & photos for guest mode
├── types/index.ts          # TypeScript interfaces
└── middleware.ts           # Auth middleware (Supabase + guest cookie check)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/shreyanshgupta44/our-journey.git
cd our-journey
npm install
```

### 2. Set Up Supabase

Create a new project at [supabase.com](https://supabase.com), then run this SQL in the **SQL Editor**:

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

-- Enable RLS
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "auth_select_albums" ON albums FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_albums" ON albums FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_albums" ON albums FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth_delete_albums" ON albums FOR DELETE TO authenticated USING (true);

CREATE POLICY "auth_select_media" ON media FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_media" ON media FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_delete_media" ON media FOR DELETE TO authenticated USING (true);
```

### 3. Set Up Storage

In Supabase Dashboard → **Storage** → **New Bucket**:
- Name: `travel-media`
- Public: ✅ Yes

Add these **Storage Policies** for `travel-media`:

```sql
-- Allow authenticated uploads
CREATE POLICY "auth_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'travel-media');
-- Allow public reads
CREATE POLICY "public_read" ON storage.objects FOR SELECT USING (bucket_id = 'travel-media');
-- Allow authenticated deletes
CREATE POLICY "auth_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'travel-media');
```

### 4. Create User Accounts

In Supabase → **Authentication** → **Users** → **Add User**:
- Create 2 accounts (you & your partner)
- Check "Auto Confirm User"

### 5. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these in Supabase → **Settings** → **API**

### 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   Vercel (CDN)                   │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐  │
│  │ Next.js  │  │ Middleware │  │  Static +    │  │
│  │ App      │──│ (Auth +   │──│  Dynamic     │  │
│  │ Router   │  │  Guest)   │  │  Rendering   │  │
│  └────┬─────┘  └───────────┘  └──────────────┘  │
└───────┼──────────────────────────────────────────┘
        │
┌───────▼──────────────────────────────────────────┐
│                 Supabase Cloud                    │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐  │
│  │   Auth   │  │ PostgreSQL│  │   Storage    │  │
│  │ (Email/  │  │ (Albums + │  │ (Photos +   │  │
│  │  Pass)   │  │  Media)   │  │  Videos)    │  │
│  └──────────┘  └───────────┘  └──────────────┘  │
└──────────────────────────────────────────────────┘
```

---

## 📄 License

This project is for personal use. Feel free to fork and customize for your own relationship! 💕

---

<p align="center">
  <i>Built with ❤️ for documenting love stories, one trip at a time.</i>
</p>
]]>
