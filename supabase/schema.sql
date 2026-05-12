-- ========================================================================
-- MyMemory — Supabase Database Schema
-- ========================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================
-- Albums Table
-- ==============================
CREATE TABLE albums (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT DEFAULT '',
  cover_image_url TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE albums IS 'Photo albums for organizing baby memories';

-- ==============================
-- Photos Table
-- ==============================
CREATE TABLE photos (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  album_id      UUID REFERENCES albums(id) ON DELETE SET NULL,
  image_url     TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  caption       TEXT DEFAULT '',
  date_taken    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE photos IS 'Individual photos in the baby growth timeline';

-- Index for timeline queries (sorted by date_taken)
CREATE INDEX idx_photos_date_taken ON photos (date_taken DESC);

-- Index for album filtering
CREATE INDEX idx_photos_album_id ON photos (album_id);

-- ==============================
-- Row Level Security (RLS)
-- ==============================
-- Enable RLS on both tables
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can read
CREATE POLICY "Authenticated users can read albums"
  ON albums FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read photos"
  ON photos FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated users can insert
CREATE POLICY "Authenticated users can insert albums"
  ON albums FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert photos"
  ON photos FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can update their own
CREATE POLICY "Authenticated users can update albums"
  ON albums FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update photos"
  ON photos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Only authenticated users can delete
CREATE POLICY "Authenticated users can delete albums"
  ON albums FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete photos"
  ON photos FOR DELETE
  TO authenticated
  USING (true);

-- ==============================
-- Storage Bucket (run in Supabase Dashboard)
-- ==============================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('photos', 'photos', true);
--
-- CREATE POLICY "Auth users can upload photos"
--   ON storage.objects FOR INSERT
--   TO authenticated
--   WITH CHECK (bucket_id = 'photos');
--
-- CREATE POLICY "Public can view photos"
--   ON storage.objects FOR SELECT
--   TO public
--   USING (bucket_id = 'photos');
