-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bio TEXT DEFAULT 'A passionate writer contributing to The Gallery community.',
  avatar_url TEXT,
  role TEXT DEFAULT 'writer' CHECK (role IN ('writer', 'editor', 'managing_editor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drafts table
CREATE TABLE IF NOT EXISTS drafts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  share_to_community BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'poetry',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'queued', 'in_issue', 'published', 'revisions_requested', 'rejected')),
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  rating INTEGER CHECK (rating >= 0 AND rating <= 5),
  internal_notes TEXT,
  scheduled_date DATE,
  published_at TIMESTAMPTZ,
  wall_number TEXT,
  share_to_community BOOLEAN DEFAULT true,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hearts table (for appreciation system)
CREATE TABLE IF NOT EXISTS hearts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  piece_id UUID NOT NULL, -- Can reference submissions or other content
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, piece_id)
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_drafts_user_id ON drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_drafts_created_at ON drafts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_hearts_user_id ON hearts(user_id);
CREATE INDEX IF NOT EXISTS idx_hearts_piece_id ON hearts(piece_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hearts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, update only their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Drafts: Users can only see and modify their own drafts (COMPLETELY PRIVATE)
CREATE POLICY "Users can view own drafts" ON drafts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drafts" ON drafts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts" ON drafts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own drafts" ON drafts
  FOR DELETE USING (auth.uid() = user_id);

-- Submissions: Only submitted/published visible to authenticated users, all to editors
CREATE POLICY "Authenticated users can view submitted and published" ON submissions
  FOR SELECT USING (
    -- Own submissions always visible
    auth.uid() = user_id OR
    -- Editors see all
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor', 'managing_editor')) OR
    -- Authenticated users see submitted/published only
    (auth.uid() IS NOT NULL AND status IN ('submitted', 'pending', 'published'))
  );

CREATE POLICY "Public can view published only" ON submissions
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can insert own submissions" ON submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Editors can update submissions" ON submissions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor', 'managing_editor'))
  );

-- Hearts: Users can view all, insert/delete their own
CREATE POLICY "Hearts are viewable by everyone" ON hearts
  FOR SELECT USING (true);

CREATE POLICY "Users can add hearts" ON hearts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own hearts" ON hearts
  FOR DELETE USING (auth.uid() = user_id);

-- Newsletter: Public can subscribe, no reads
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drafts_updated_at BEFORE UPDATE ON drafts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();