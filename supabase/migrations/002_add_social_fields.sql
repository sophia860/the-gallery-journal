-- Migration: Add social media fields to profiles table
-- Related to Issue #16: Author bio and social media links in submission flow
-- The profiles table already has a 'bio' column, so we only need to add social URLs

-- Add social media URL columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Add author_bio field to submissions table for snapshot at time of submission
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS author_bio TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS author_instagram_url TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS author_twitter_url TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS author_website_url TEXT;
