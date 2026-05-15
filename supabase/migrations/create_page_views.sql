-- ========================================================================
-- page_views — Stores visitor tracking data for the Analytics page.
-- Run this in Supabase SQL Editor to create the table.
-- ========================================================================

create table if not exists page_views (
  id uuid default gen_random_uuid() primary key,
  page text not null,
  user_agent text not null default '',
  ip_address text,
  screen_width integer not null default 0,
  screen_height integer not null default 0,
  referrer text not null default '',
  visited_at timestamptz not null default now()
);

-- Index for faster date range queries
create index if not exists idx_page_views_visited_at on page_views (visited_at desc);

-- RLS: Allow anonymous inserts (tracking) and reads (dashboard)
alter table page_views enable row level security;

create policy "Allow anonymous insert" on page_views
  for insert with check (true);

create policy "Allow anonymous select" on page_views
  for select using (true);
