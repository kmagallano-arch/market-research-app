-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS cache (
  id bigserial PRIMARY KEY,
  cache_key text UNIQUE NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS cache_key_idx ON cache(cache_key);
CREATE INDEX IF NOT EXISTS cache_updated_idx ON cache(updated_at);

-- Enable RLS but allow service role full access
ALTER TABLE cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON cache
  USING (true)
  WITH CHECK (true);
