-- Aggregated album media stats for the albums listing.
-- Keeps the frontend from downloading every media row just to count items.

create or replace function get_album_media_stats()
returns table (
  album_id uuid,
  media_count bigint,
  cover_image_url text
)
language sql
stable
security invoker
set search_path = public
as $$
  with ranked_media as (
    select
      media_items.album_id,
      media_items.thumbnail_url,
      row_number() over (
        partition by media_items.album_id
        order by media_items.date_taken desc, media_items.created_at desc
      ) as row_number
    from media_items
    where media_items.album_id is not null
  )
  select
    ranked_media.album_id,
    count(*) as media_count,
    max(ranked_media.thumbnail_url) filter (where ranked_media.row_number = 1) as cover_image_url
  from ranked_media
  group by ranked_media.album_id;
$$;
