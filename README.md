# Our Journey ✦

A private couples travel photo & video album — built with Next.js 14, Tailwind CSS, and Supabase.

> *"Every road we walked, every sunset we shared."*

---

## Getting Started

### 1. Install Dependencies

```bash
cd our-journey
npm install
```

### 2. Set Up Supabase

Create a [Supabase project](https://supabase.com) and add your credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Create Database Tables

Run this SQL in the Supabase SQL Editor:

```sql
-- Albums table
create table albums (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  destination text,
  date_from date,
  date_to date,
  description text,
  cover_url text,
  created_at timestamp default now()
);

-- Media table
create table media (
  id uuid default gen_random_uuid() primary key,
  album_id uuid references albums(id) on delete cascade,
  url text not null,
  type text check (type in ('image', 'video')),
  filename text,
  uploaded_at timestamp default now()
);

-- Enable Row Level Security
alter table albums enable row level security;
alter table media enable row level security;

-- Policies: Only authenticated users can do anything
create policy "Authenticated users can read albums"
  on albums for select to authenticated using (true);

create policy "Authenticated users can insert albums"
  on albums for insert to authenticated with check (true);

create policy "Authenticated users can update albums"
  on albums for update to authenticated using (true);

create policy "Authenticated users can delete albums"
  on albums for delete to authenticated using (true);

create policy "Authenticated users can read media"
  on media for select to authenticated using (true);

create policy "Authenticated users can insert media"
  on media for insert to authenticated with check (true);

create policy "Authenticated users can delete media"
  on media for delete to authenticated using (true);
```

### 4. Create Storage Bucket

In Supabase Dashboard → Storage:
1. Create a new bucket called `travel-media`
2. Set it to **Public**
3. Add a policy allowing authenticated users to upload/delete

### 5. Create User Accounts

In Supabase Dashboard → Authentication → Users:
- Create 2 email/password accounts (one for each of you)

### 6. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page.

---

## Deployment (Vercel)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy ✨

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Auth | Supabase Auth (email/password) |
| Hosting | Vercel |
