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
-- Media Items Table
-- ==============================
CREATE TABLE media_items (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  album_id      UUID REFERENCES albums(id) ON DELETE SET NULL,
  media_type    TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  url           TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  placeholder_url TEXT NOT NULL DEFAULT '',
  caption       TEXT DEFAULT '',
  date_taken    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE media_items IS 'Individual photos and videos in the baby growth timeline';

-- Index for timeline queries (sorted by date_taken)
CREATE INDEX idx_media_items_date_taken ON media_items (date_taken DESC);

-- Index for album filtering
CREATE INDEX idx_media_items_album_id ON media_items (album_id);

-- ==============================
-- Row Level Security (RLS)
-- ==============================
-- Enable RLS on both tables
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read
CREATE POLICY "Public users can read albums"
  ON albums FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public users can read media_items"
  ON media_items FOR SELECT
  TO public
  USING (true);

-- Policy: Allow public insert
CREATE POLICY "Public users can insert albums"
  ON albums FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public users can insert media_items"
  ON media_items FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Allow public update
CREATE POLICY "Public users can update albums"
  ON albums FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public users can update media_items"
  ON media_items FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Policy: Allow public delete
CREATE POLICY "Public users can delete albums"
  ON albums FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Public users can delete media_items"
  ON media_items FOR DELETE
  TO public
  USING (true);

-- ==============================
-- Database Functions
-- ==============================
-- Hàm tính toán thống kê ảnh trong Album giúp giảm tải mạng ở trang danh sách
CREATE OR REPLACE FUNCTION get_album_media_stats()
RETURNS TABLE (
  album_id UUID,
  media_count BIGINT,
  cover_image_url TEXT
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  WITH ranked_media AS (
    SELECT
      media_items.album_id,
      media_items.thumbnail_url,
      row_number() OVER (
        PARTITION BY media_items.album_id
        ORDER BY media_items.date_taken DESC, media_items.created_at DESC
      ) AS row_number
    FROM media_items
    WHERE media_items.album_id IS NOT NULL
  )
  SELECT
    ranked_media.album_id,
    count(*) AS media_count,
    max(ranked_media.thumbnail_url) FILTER (WHERE ranked_media.row_number = 1) AS cover_image_url
  FROM ranked_media
  GROUP BY ranked_media.album_id;
$$;

-- ==============================
-- Storage Bucket & Security Policies
-- ==============================
-- 1. Tạo bucket 'media' ở chế độ công khai nếu chưa tồn tại
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Thêm policy cho phép mọi người (anon/public) tải ảnh lên bucket 'media'
CREATE POLICY "Allow public upload to media"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'media');

-- 3. Thêm policy cho phép mọi người xem ảnh công khai từ bucket 'media'
CREATE POLICY "Allow public select from media"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'media');
