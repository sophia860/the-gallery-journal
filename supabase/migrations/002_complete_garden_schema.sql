-- Complete Garden Schema Migration
-- This creates all necessary tables for The Garden platform

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  writer_name TEXT,
  garden_name TEXT,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  garden_theme TEXT DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- WRITINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS writings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  work_type TEXT CHECK (work_type IN ('poetry', 'prose', 'fiction', 'essay', 'fragment', 'personal', 'experimental', 'memoir')),
  growth_stage TEXT NOT NULL DEFAULT 'seed' CHECK (growth_stage IN ('seed', 'sprout', 'bloom')),
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'circles', 'garden', 'public')),
  word_count INTEGER DEFAULT 0,
  character_count INTEGER DEFAULT 0,
  tags TEXT[],
  position_x FLOAT,
  position_y FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS writings_user_id_idx ON writings(user_id);
CREATE INDEX IF NOT EXISTS writings_visibility_idx ON writings(visibility);
CREATE INDEX IF NOT EXISTS writings_growth_stage_idx ON writings(growth_stage);
CREATE INDEX IF NOT EXISTS writings_tags_idx ON writings USING GIN(tags);

ALTER TABLE writings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own writings" ON writings;
CREATE POLICY "Users can view own writings"
  ON writings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public blooms are viewable by everyone" ON writings;
CREATE POLICY "Public blooms are viewable by everyone"
  ON writings FOR SELECT
  USING ((visibility = 'public' OR visibility = 'garden') AND growth_stage = 'bloom');

DROP POLICY IF EXISTS "Users can insert own writings" ON writings;
CREATE POLICY "Users can insert own writings"
  ON writings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own writings" ON writings;
CREATE POLICY "Users can update own writings"
  ON writings FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own writings" ON writings;
CREATE POLICY "Users can delete own writings"
  ON writings FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CIRCLES TABLE
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

DROP POLICY IF EXISTS "Circle members can view circle" ON circles;
CREATE POLICY "Circle members can view circle"
  ON circles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM circle_members
      WHERE circle_id = circles.id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Circle creators can update circle" ON circles;
CREATE POLICY "Circle creators can update circle"
  ON circles FOR UPDATE
  USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Any authenticated user can create a circle" ON circles;
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

CREATE INDEX IF NOT EXISTS circle_members_circle_id_idx ON circle_members(circle_id);
CREATE INDEX IF NOT EXISTS circle_members_user_id_idx ON circle_members(user_id);

ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Circle members can view other members" ON circle_members;
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

DROP POLICY IF EXISTS "Anyone can view valid invite by code" ON circle_invites;
CREATE POLICY "Anyone can view valid invite by code"
  ON circle_invites FOR SELECT
  USING (expires_at > NOW() AND current_uses < max_uses);

-- ============================================
-- TENDS TABLE (gentle appreciation)
-- ============================================
CREATE TABLE IF NOT EXISTS tends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  writing_id UUID NOT NULL REFERENCES writings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, writing_id)
);

ALTER TABLE tends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own tends" ON tends;
CREATE POLICY "Users can manage own tends"
  ON tends FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Writing authors can view tends on their work" ON tends;
CREATE POLICY "Writing authors can view tends on their work"
  ON tends FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM writings w
      WHERE w.id = tends.writing_id AND w.user_id = auth.uid()
    )
  );

-- ============================================
-- BOOKMARKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  writing_id UUID NOT NULL REFERENCES writings(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, writing_id)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own bookmarks" ON bookmarks;
CREATE POLICY "Users can manage own bookmarks"
  ON bookmarks FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_writings_updated_at ON writings;
CREATE TRIGGER update_writings_updated_at BEFORE UPDATE ON writings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_circles_updated_at ON circles;
CREATE TRIGGER update_circles_updated_at BEFORE UPDATE ON circles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
