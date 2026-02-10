-- THE GARDEN DATABASE SCHEMA
-- Complete schema for the social writing platform

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  writer_name TEXT, -- Optional pen name
  bio TEXT,
  avatar_url TEXT,
  garden_theme TEXT DEFAULT 'default', -- For future customization
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- WRITINGS TABLE (the core content)
-- ============================================
CREATE TABLE IF NOT EXISTS writings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('essay', 'poem', 'fragment', 'marginalia')),
  growth_stage TEXT NOT NULL DEFAULT 'seed' CHECK (growth_stage IN ('seed', 'sprout', 'bloom')),
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'circles', 'public')),
  tags TEXT[], -- Array of tags
  position_x FLOAT, -- For visual garden layout
  position_y FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ -- When it became a "bloom"
);

CREATE INDEX writings_user_id_idx ON writings(user_id);
CREATE INDEX writings_visibility_idx ON writings(visibility);
CREATE INDEX writings_growth_stage_idx ON writings(growth_stage);
CREATE INDEX writings_tags_idx ON writings USING GIN(tags);

ALTER TABLE writings ENABLE ROW LEVEL SECURITY;

-- Policies for writings
CREATE POLICY "Users can view own writings"
  ON writings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public blooms are viewable by everyone"
  ON writings FOR SELECT
  USING (visibility = 'public' AND growth_stage = 'bloom');

CREATE POLICY "Users can insert own writings"
  ON writings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own writings"
  ON writings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own writings"
  ON writings FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- WRITING_LINKS TABLE (paths/constellations)
-- ============================================
CREATE TABLE IF NOT EXISTS writing_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  from_writing_id UUID NOT NULL REFERENCES writings(id) ON DELETE CASCADE,
  to_writing_id UUID NOT NULL REFERENCES writings(id) ON DELETE CASCADE,
  label TEXT, -- Optional label for the connection
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_writing_id, to_writing_id)
);

ALTER TABLE writing_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own writing links"
  ON writing_links FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- CIRCLES TABLE (small communities)
-- ============================================
CREATE TABLE IF NOT EXISTS circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  member_limit INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE circles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Circle members can view circle"
  ON circles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM circle_members
      WHERE circle_id = circles.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Circle creators can update circle"
  ON circles FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Any authenticated user can create a circle"
  ON circles FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- ============================================
-- CIRCLE_MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS circle_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('creator', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(circle_id, user_id)
);

CREATE INDEX circle_members_circle_id_idx ON circle_members(circle_id);
CREATE INDEX circle_members_user_id_idx ON circle_members(user_id);

ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Circle members can view other members"
  ON circle_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM circle_members cm
      WHERE cm.circle_id = circle_members.circle_id AND cm.user_id = auth.uid()
    )
  );

-- ============================================
-- CIRCLE_INVITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS circle_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invite_code TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  max_uses INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE circle_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view valid invite by code"
  ON circle_invites FOR SELECT
  USING (expires_at > NOW() AND current_uses < max_uses);

-- ============================================
-- MARGINALIA TABLE (inline comments)
-- ============================================
CREATE TABLE IF NOT EXISTS marginalia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  writing_id UUID NOT NULL REFERENCES writings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  highlighted_text TEXT NOT NULL, -- The text being commented on
  position INTEGER NOT NULL, -- Character position in the writing
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX marginalia_writing_id_idx ON marginalia(writing_id);

ALTER TABLE marginalia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view marginalia on accessible writings"
  ON marginalia FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM writings w
      WHERE w.id = marginalia.writing_id
      AND (
        w.user_id = auth.uid() OR
        (w.visibility = 'public' AND w.growth_stage = 'bloom')
      )
    )
  );

CREATE POLICY "Users can create marginalia"
  ON marginalia FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- BOOKMARKS TABLE (private saves)
-- ============================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  writing_id UUID NOT NULL REFERENCES writings(id) ON DELETE CASCADE,
  notes TEXT, -- Private notes on the bookmark
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, writing_id)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own bookmarks"
  ON bookmarks FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- TENDS TABLE (gentle appreciation - counts private)
-- ============================================
CREATE TABLE IF NOT EXISTS tends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  writing_id UUID NOT NULL REFERENCES writings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, writing_id)
);

ALTER TABLE tends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tends"
  ON tends FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Writing authors can view tends on their work"
  ON tends FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM writings w
      WHERE w.id = tends.writing_id AND w.user_id = auth.uid()
    )
  );

-- ============================================
-- SUBMISSIONS TABLE (to The Gallery)
-- ============================================
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  writing_id UUID NOT NULL REFERENCES writings(id) ON DELETE CASCADE,
  cover_letter TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'accepted', 'declined')),
  reviewer_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions"
  ON submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create submissions"
  ON submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- READING_QUEUE TABLE (save for later)
-- ============================================
CREATE TABLE IF NOT EXISTS reading_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  writing_id UUID NOT NULL REFERENCES writings(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, writing_id)
);

ALTER TABLE reading_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own reading queue"
  ON reading_queue FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS FOR AUTOMATIC TIMESTAMPS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_writings_updated_at BEFORE UPDATE ON writings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_circles_updated_at BEFORE UPDATE ON circles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
