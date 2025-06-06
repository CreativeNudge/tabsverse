-- Tabsverse Database Schema
-- Run this in your Supabase SQL Editor
-- Version: 1.0 (MVP Schema)
-- Last Updated: June 2025

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'team');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'trialing');
CREATE TYPE visibility AS ENUM ('private', 'public');
CREATE TYPE resource_type AS ENUM ('webpage', 'pdf', 'video', 'image', 'document');

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  signup_ip INET,
  signup_country TEXT,
  last_login_ip INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_status subscription_status DEFAULT 'active',
  settings JSONB DEFAULT '{
    "privacy_level": "private",
    "notification_preferences": {
      "email_notifications": true,
      "push_notifications": true
    },
    "display_preferences": {
      "theme": "light",
      "default_view": "grid"
    }
  }',
  stats JSONB DEFAULT '{
    "total_groups": 0,
    "total_tabs": 0,
    "followers_count": 0,
    "following_count": 0,
    "total_views": 0
  }'
);

-- Create groups table (renamed from collections)
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL,
  cover_image_url TEXT,
  visibility visibility DEFAULT 'private',
  tab_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  comments_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT[],
  settings JSONB DEFAULT '{
    "allow_comments": true,
    "display_style": "grid"
  }'
);

-- Create tabs table (renamed from resources)
CREATE TABLE IF NOT EXISTS public.tabs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  favicon_url TEXT,
  domain TEXT,
  resource_type resource_type DEFAULT 'webpage',
  position INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT[],
  notes TEXT,
  is_favorite BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'
);

-- Create follows table
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notification_enabled BOOLEAN DEFAULT true,
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create group_likes table
CREATE TABLE IF NOT EXISTS public.group_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Create group_comments table
CREATE TABLE IF NOT EXISTS public.group_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  parent_comment_id UUID REFERENCES public.group_comments(id) ON DELETE CASCADE,
  is_deleted BOOLEAN DEFAULT false
);

-- Create group_views table (for analytics)
CREATE TABLE IF NOT EXISTS public.group_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  viewer_ip INET,
  viewer_country TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT,
  referrer TEXT
);

-- Create tab_clicks table (for analytics)
CREATE TABLE IF NOT EXISTS public.tab_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tab_id UUID REFERENCES public.tabs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  click_ip INET,
  click_country TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

CREATE INDEX IF NOT EXISTS idx_groups_user_id ON public.groups(user_id);
CREATE INDEX IF NOT EXISTS idx_groups_visibility ON public.groups(visibility);
CREATE INDEX IF NOT EXISTS idx_groups_updated_at ON public.groups(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_groups_slug ON public.groups(user_id, slug);

CREATE INDEX IF NOT EXISTS idx_tabs_group_id ON public.tabs(group_id);
CREATE INDEX IF NOT EXISTS idx_tabs_user_id ON public.tabs(user_id);
CREATE INDEX IF NOT EXISTS idx_tabs_position ON public.tabs(group_id, position);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);

CREATE INDEX IF NOT EXISTS idx_group_likes_group ON public.group_likes(group_id);
CREATE INDEX IF NOT EXISTS idx_group_likes_user ON public.group_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_group_comments_group ON public.group_comments(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_group_comments_user ON public.group_comments(user_id);

CREATE INDEX IF NOT EXISTS idx_group_views_group ON public.group_views(group_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_group_views_viewer ON public.group_views(viewer_id, viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_tab_clicks_tab ON public.tab_clicks(tab_id, clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_tab_clicks_user ON public.tab_clicks(user_id, clicked_at DESC);

-- Add unique constraints
ALTER TABLE public.groups ADD CONSTRAINT unique_user_slug UNIQUE (user_id, slug);
ALTER TABLE public.tabs ADD CONSTRAINT unique_group_url UNIQUE (group_id, url);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tab_clicks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users: Users can read their own data and public profiles
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view public user data" ON public.users
  FOR SELECT USING (true);

-- Groups: Users can manage their own groups, view public groups
CREATE POLICY "Users can view their own groups" ON public.groups
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public groups" ON public.groups
  FOR SELECT USING (visibility = 'public');

CREATE POLICY "Users can create groups" ON public.groups
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own groups" ON public.groups
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own groups" ON public.groups
  FOR DELETE USING (auth.uid() = user_id);

-- Tabs: Follow group permissions
CREATE POLICY "Users can view tabs in accessible groups" ON public.tabs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = tabs.group_id 
      AND (groups.user_id = auth.uid() OR groups.visibility = 'public')
    )
  );

CREATE POLICY "Users can create tabs in their own groups" ON public.tabs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = tabs.group_id 
      AND groups.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tabs in their own groups" ON public.tabs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = tabs.group_id 
      AND groups.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tabs in their own groups" ON public.tabs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = tabs.group_id 
      AND groups.user_id = auth.uid()
    )
  );

-- Follows: Users can manage their own follows
CREATE POLICY "Users can view follows" ON public.follows
  FOR SELECT USING (true);

CREATE POLICY "Users can create follows" ON public.follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows" ON public.follows
  FOR DELETE USING (auth.uid() = follower_id);

-- Group likes: Users can like public groups
CREATE POLICY "Users can view group likes" ON public.group_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can create group likes" ON public.group_likes
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = group_likes.group_id 
      AND groups.visibility = 'public'
    )
  );

CREATE POLICY "Users can delete their own group likes" ON public.group_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Group comments: Users can comment on public groups with comments enabled
CREATE POLICY "Users can view comments on accessible groups" ON public.group_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = group_comments.group_id 
      AND (groups.user_id = auth.uid() OR groups.visibility = 'public')
    )
  );

CREATE POLICY "Users can create comments on public groups" ON public.group_comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = group_comments.group_id 
      AND groups.visibility = 'public'
      AND groups.comments_enabled = true
    )
  );

CREATE POLICY "Users can update their own comments" ON public.group_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.group_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Analytics tables: Permissive for data collection
CREATE POLICY "Anyone can create group views" ON public.group_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own group analytics" ON public.group_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = group_views.group_id 
      AND groups.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create tab clicks" ON public.tab_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own tab analytics" ON public.tab_clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tabs 
      JOIN public.groups ON groups.id = tabs.group_id
      WHERE tabs.id = tab_clicks.tab_id 
      AND groups.user_id = auth.uid()
    )
  );

-- Create functions for updating counters
CREATE OR REPLACE FUNCTION update_group_tab_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.groups 
    SET tab_count = tab_count + 1,
        last_activity_at = NOW()
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.groups 
    SET tab_count = tab_count - 1,
        last_activity_at = NOW()
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_group_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.groups 
    SET like_count = like_count + 1
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.groups 
    SET like_count = like_count - 1
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_group_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.groups 
    SET comment_count = comment_count + 1
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.groups 
    SET comment_count = comment_count - 1
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'groups' THEN
      UPDATE public.users 
      SET stats = jsonb_set(stats, '{total_groups}', 
          (COALESCE((stats->>'total_groups')::integer, 0) + 1)::text::jsonb)
      WHERE id = NEW.user_id;
    ELSIF TG_TABLE_NAME = 'follows' THEN
      -- Update follower count
      UPDATE public.users 
      SET stats = jsonb_set(stats, '{followers_count}', 
          (COALESCE((stats->>'followers_count')::integer, 0) + 1)::text::jsonb)
      WHERE id = NEW.following_id;
      -- Update following count
      UPDATE public.users 
      SET stats = jsonb_set(stats, '{following_count}', 
          (COALESCE((stats->>'following_count')::integer, 0) + 1)::text::jsonb)
      WHERE id = NEW.follower_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF TG_TABLE_NAME = 'groups' THEN
      UPDATE public.users 
      SET stats = jsonb_set(stats, '{total_groups}', 
          (GREATEST(COALESCE((stats->>'total_groups')::integer, 0) - 1, 0))::text::jsonb)
      WHERE id = OLD.user_id;
    ELSIF TG_TABLE_NAME = 'follows' THEN
      -- Update follower count
      UPDATE public.users 
      SET stats = jsonb_set(stats, '{followers_count}', 
          (GREATEST(COALESCE((stats->>'followers_count')::integer, 0) - 1, 0))::text::jsonb)
      WHERE id = OLD.following_id;
      -- Update following count
      UPDATE public.users 
      SET stats = jsonb_set(stats, '{following_count}', 
          (GREATEST(COALESCE((stats->>'following_count')::integer, 0) - 1, 0))::text::jsonb)
      WHERE id = OLD.follower_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_group_tab_count
  AFTER INSERT OR DELETE ON public.tabs
  FOR EACH ROW EXECUTE FUNCTION update_group_tab_count();

CREATE TRIGGER trigger_update_group_like_count
  AFTER INSERT OR DELETE ON public.group_likes
  FOR EACH ROW EXECUTE FUNCTION update_group_like_count();

CREATE TRIGGER trigger_update_group_comment_count
  AFTER INSERT OR DELETE ON public.group_comments
  FOR EACH ROW EXECUTE FUNCTION update_group_comment_count();

CREATE TRIGGER trigger_update_user_stats_groups
  AFTER INSERT OR DELETE ON public.groups
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

CREATE TRIGGER trigger_update_user_stats_follows
  AFTER INSERT OR DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_groups_updated_at
  BEFORE UPDATE ON public.groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_group_comments_updated_at
  BEFORE UPDATE ON public.group_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Insert initial data (optional)
-- You can add default data here if needed

COMMENT ON TABLE public.users IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.groups IS 'User-created collections of tabs (renamed from collections)';
COMMENT ON TABLE public.tabs IS 'Individual saved links/content within groups';
COMMENT ON TABLE public.follows IS 'Social following relationships between users';
COMMENT ON TABLE public.group_likes IS 'Like interactions on groups';
COMMENT ON TABLE public.group_comments IS 'Comments on groups with reply support';
COMMENT ON TABLE public.group_views IS 'Analytics tracking for group views';
COMMENT ON TABLE public.tab_clicks IS 'Analytics tracking for tab clicks';
