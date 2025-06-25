-- Complete Tabsverse Database Reset & Rebuild
-- This will destroy everything and build from scratch
-- Execute this in Supabase SQL Editor

-- Step 1: Drop everything first (clean slate)
DROP TABLE IF EXISTS public.tab_clicks CASCADE;
DROP TABLE IF EXISTS public.group_views CASCADE;
DROP TABLE IF EXISTS public.group_comments CASCADE;
DROP TABLE IF EXISTS public.group_likes CASCADE;
DROP TABLE IF EXISTS public.follows CASCADE;
DROP TABLE IF EXISTS public.tabs CASCADE;
DROP TABLE IF EXISTS public.groups CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.update_group_tab_count() CASCADE;
DROP FUNCTION IF EXISTS public.update_group_like_count() CASCADE;
DROP FUNCTION IF EXISTS public.update_group_comment_count() CASCADE;

-- Drop types
DROP TYPE IF EXISTS public.resource_type CASCADE;
DROP TYPE IF EXISTS public.visibility CASCADE;
DROP TYPE IF EXISTS public.subscription_status CASCADE;
DROP TYPE IF EXISTS public.subscription_tier CASCADE;

-- Step 2: Create all custom types
CREATE TYPE public.resource_type AS ENUM ('webpage', 'pdf', 'video', 'image', 'document');
CREATE TYPE public.visibility AS ENUM ('private', 'public');
CREATE TYPE public.subscription_status AS ENUM ('active', 'cancelled', 'trialing');
CREATE TYPE public.subscription_tier AS ENUM ('free', 'pro', 'team');

-- Step 3: Create tables in correct dependency order

-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  signup_ip INET,
  signup_country TEXT,
  last_login_ip INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  subscription_tier subscription_tier DEFAULT 'free' NOT NULL,
  subscription_status subscription_status DEFAULT 'active' NOT NULL,
  settings JSONB DEFAULT '{}' NOT NULL,
  stats JSONB DEFAULT '{"total_groups": 0, "total_tabs": 0, "followers_count": 0, "following_count": 0, "total_views": 0}' NOT NULL
);

-- Groups table (collections of tabs)
CREATE TABLE public.groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL,
  cover_image_url TEXT,
  visibility visibility DEFAULT 'private' NOT NULL,
  tab_count INTEGER DEFAULT 0 NOT NULL,
  view_count INTEGER DEFAULT 0 NOT NULL,
  like_count INTEGER DEFAULT 0 NOT NULL,
  comment_count INTEGER DEFAULT 0 NOT NULL,
  comments_enabled BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  tags TEXT[] DEFAULT '{}' NOT NULL,
  settings JSONB DEFAULT '{"allow_comments": true, "display_style": "grid", "personality": "creative"}' NOT NULL,
  UNIQUE(user_id, slug)
);

-- Tabs table (individual saved links)
CREATE TABLE public.tabs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  favicon_url TEXT,
  domain TEXT,
  resource_type resource_type DEFAULT 'webpage' NOT NULL,
  position INTEGER DEFAULT 0 NOT NULL,
  click_count INTEGER DEFAULT 0 NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  tags TEXT[] DEFAULT '{}' NOT NULL,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT false NOT NULL,
  metadata JSONB DEFAULT '{}' NOT NULL
);

-- Social tables
CREATE TABLE public.follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  notification_enabled BOOLEAN DEFAULT true NOT NULL,
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE TABLE public.group_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(group_id, user_id)
);

CREATE TABLE public.group_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  parent_comment_id UUID REFERENCES public.group_comments(id) ON DELETE CASCADE,
  is_deleted BOOLEAN DEFAULT false NOT NULL
);

-- Analytics tables
CREATE TABLE public.group_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  viewer_ip INET,
  viewer_country TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  session_id TEXT,
  referrer TEXT
);

CREATE TABLE public.tab_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tab_id UUID REFERENCES public.tabs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  click_ip INET,
  click_country TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  session_id TEXT
);

-- Step 4: Create indexes for performance
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_email ON public.users(email);

CREATE INDEX idx_groups_user_id ON public.groups(user_id);
CREATE INDEX idx_groups_visibility ON public.groups(visibility);
CREATE INDEX idx_groups_updated_at ON public.groups(updated_at DESC);
CREATE INDEX idx_groups_last_activity_at ON public.groups(last_activity_at DESC);
CREATE INDEX idx_groups_user_slug ON public.groups(user_id, slug);

CREATE INDEX idx_tabs_group_id ON public.tabs(group_id);
CREATE INDEX idx_tabs_user_id ON public.tabs(user_id);
CREATE INDEX idx_tabs_position ON public.tabs(group_id, position);

CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);

CREATE INDEX idx_group_likes_group_id ON public.group_likes(group_id);
CREATE INDEX idx_group_likes_user_id ON public.group_likes(user_id);

CREATE INDEX idx_group_comments_group_id ON public.group_comments(group_id);
CREATE INDEX idx_group_comments_user_id ON public.group_comments(user_id);

CREATE INDEX idx_group_views_group_id ON public.group_views(group_id);
CREATE INDEX idx_group_views_viewed_at ON public.group_views(viewed_at DESC);

CREATE INDEX idx_tab_clicks_tab_id ON public.tab_clicks(tab_id);
CREATE INDEX idx_tab_clicks_clicked_at ON public.tab_clicks(clicked_at DESC);

-- Step 5: Create trigger functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS '
BEGIN
  NEW.updated_at = timezone(''utc''::text, now());
  RETURN NEW;
END;
' language 'plpgsql';

CREATE OR REPLACE FUNCTION public.update_group_tab_count()
RETURNS TRIGGER AS '
BEGIN
  IF TG_OP = ''INSERT'' THEN
    UPDATE public.groups 
    SET tab_count = tab_count + 1,
        last_activity_at = timezone(''utc''::text, now())
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = ''DELETE'' THEN
    UPDATE public.groups 
    SET tab_count = tab_count - 1,
        last_activity_at = timezone(''utc''::text, now())
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
' language 'plpgsql';

CREATE OR REPLACE FUNCTION public.update_group_like_count()
RETURNS TRIGGER AS '
BEGIN
  IF TG_OP = ''INSERT'' THEN
    UPDATE public.groups 
    SET like_count = like_count + 1,
        last_activity_at = timezone(''utc''::text, now())
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = ''DELETE'' THEN
    UPDATE public.groups 
    SET like_count = like_count - 1,
        last_activity_at = timezone(''utc''::text, now())
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
' language 'plpgsql';

CREATE OR REPLACE FUNCTION public.update_group_comment_count()
RETURNS TRIGGER AS '
BEGIN
  IF TG_OP = ''INSERT'' THEN
    UPDATE public.groups 
    SET comment_count = comment_count + 1,
        last_activity_at = timezone(''utc''::text, now())
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = ''DELETE'' THEN
    UPDATE public.groups 
    SET comment_count = comment_count - 1,
        last_activity_at = timezone(''utc''::text, now())
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
' language 'plpgsql';

-- Step 6: Create triggers
CREATE TRIGGER trigger_update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_update_groups_updated_at
  BEFORE UPDATE ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_update_group_comments_updated_at
  BEFORE UPDATE ON public.group_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_update_group_tab_count
  AFTER INSERT OR DELETE ON public.tabs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_group_tab_count();

CREATE TRIGGER trigger_update_group_like_count
  AFTER INSERT OR DELETE ON public.group_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_group_like_count();

CREATE TRIGGER trigger_update_group_comment_count
  AFTER INSERT OR DELETE ON public.group_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_group_comment_count();

-- Step 7: Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tab_clicks ENABLE ROW LEVEL SECURITY;

-- Step 8: Create RLS policies

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Groups policies
CREATE POLICY "Public groups are viewable by everyone" ON public.groups
  FOR SELECT USING (visibility = 'public' OR user_id = auth.uid());

CREATE POLICY "Users can manage own groups" ON public.groups
  FOR ALL USING (user_id = auth.uid());

-- Tabs policies
CREATE POLICY "Tabs viewable if group is viewable" ON public.tabs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE id = group_id 
      AND (visibility = 'public' OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage own tabs" ON public.tabs
  FOR ALL USING (user_id = auth.uid());

-- Social policies
CREATE POLICY "Users can view follows" ON public.follows
  FOR SELECT USING (follower_id = auth.uid() OR following_id = auth.uid());

CREATE POLICY "Users can manage own follows" ON public.follows
  FOR ALL USING (follower_id = auth.uid());

CREATE POLICY "Users can like public groups" ON public.group_likes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE id = group_id 
      AND visibility = 'public'
    ) OR user_id = auth.uid()
  );

CREATE POLICY "Users can comment on public groups" ON public.group_comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE id = group_id 
      AND (visibility = 'public' OR user_id = auth.uid())
    )
  );

-- Analytics policies
CREATE POLICY "Users can view own group analytics" ON public.group_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE id = group_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create group views" ON public.group_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own tab analytics" ON public.tab_clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tabs t
      JOIN public.groups g ON g.id = t.group_id
      WHERE t.id = tab_id 
      AND g.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create tab clicks" ON public.tab_clicks
  FOR INSERT WITH CHECK (true);

SELECT 'DATABASE REBUILD COMPLETE' as status,
       'All tables, types, functions, and policies created successfully' as message;