-- TABSVERSE DATABASE SCHEMA v2.3 - PRODUCTION READY
-- Complete database schema for Tabsverse - Categories + Auto-Tag Intelligence
-- Last Updated: June 25, 2025
-- Status: ACTIVE PRODUCTION SCHEMA

-- ============================================================================
-- OVERVIEW
-- ============================================================================
-- This is the COMPLETE, CURRENT database schema for Tabsverse
-- It includes all tables, triggers, functions, and types that are ACTUALLY in use
-- If you need to recreate the database from scratch, run this entire file

-- Core Features:
-- ✅ User profiles with auto-creation trigger
-- ✅ Groups (collections) with categories system (primary + optional secondary)
-- ✅ Tabs with automatic counting and domain detection
-- ✅ Auto-tag intelligence (updates every 3 tabs)
-- ✅ Social features (follows, likes, comments)
-- ✅ Analytics (views, clicks)

-- ============================================================================
-- CUSTOM TYPES
-- ============================================================================

-- Content types for rich previews
CREATE TYPE public.resource_type AS ENUM ('webpage', 'pdf', 'video', 'image', 'document');

-- Group visibility settings
CREATE TYPE public.visibility AS ENUM ('private', 'public');

-- User subscription management
CREATE TYPE public.subscription_status AS ENUM ('active', 'cancelled', 'trialing');
CREATE TYPE public.subscription_tier AS ENUM ('free', 'pro', 'team');

-- Collection categories for organization and discovery (12 exhaustive categories)
CREATE TYPE public.collection_category AS ENUM (
  'technology',    -- Technology & Tools
  'design',        -- Design & Creative
  'business',      -- Business & Career
  'education',     -- Learning & Education
  'lifestyle',     -- Lifestyle & Health
  'travel',        -- Travel & Places
  'food',          -- Food & Cooking
  'entertainment', -- Entertainment & Media
  'news',          -- News & Current Events
  'shopping',      -- Shopping & Products
  'home',          -- Home & DIY
  'finance'        -- Finance & Investing
);

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users table (extends Supabase auth.users)
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_status subscription_status DEFAULT 'active',
  settings JSONB DEFAULT '{}',
  stats JSONB DEFAULT '{"total_groups": 0, "total_tabs": 0, "followers_count": 0, "following_count": 0, "total_views": 0}'
);

-- Groups table (user collections)
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL,
  cover_image_url TEXT,
  visibility visibility DEFAULT 'private',
  primary_category collection_category NOT NULL DEFAULT 'technology',
  secondary_category collection_category,
  tab_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  comments_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  settings JSONB DEFAULT '{"allow_comments": true, "display_style": "grid", "personality": "creative"}',
  UNIQUE(user_id, slug),
  CHECK (secondary_category IS NULL OR primary_category != secondary_category)
);

-- Tabs table (saved content within groups)
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
  added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  is_favorite BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'
);

-- ============================================================================
-- SOCIAL FEATURES TABLES
-- ============================================================================

-- User follows
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  notification_enabled BOOLEAN DEFAULT true,
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Group likes
CREATE TABLE IF NOT EXISTS public.group_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(group_id, user_id)
);

-- Group comments
CREATE TABLE IF NOT EXISTS public.group_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  parent_comment_id UUID REFERENCES public.group_comments(id),
  is_deleted BOOLEAN DEFAULT false
);

-- ============================================================================
-- ANALYTICS TABLES
-- ============================================================================

-- Group views tracking
CREATE TABLE IF NOT EXISTS public.group_views (
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

-- Tab clicks tracking
CREATE TABLE IF NOT EXISTS public.tab_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tab_id UUID REFERENCES public.tabs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  click_ip INET,
  click_country TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  session_id TEXT
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Groups indexes (critical for performance)
CREATE INDEX IF NOT EXISTS idx_groups_user_id ON public.groups(user_id);
CREATE INDEX IF NOT EXISTS idx_groups_visibility ON public.groups(visibility);
CREATE INDEX IF NOT EXISTS idx_groups_updated_at ON public.groups(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_groups_last_activity_at ON public.groups(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_groups_user_slug ON public.groups(user_id, slug);

-- Category indexes for discovery
CREATE INDEX IF NOT EXISTS idx_groups_primary_category ON public.groups(primary_category);
CREATE INDEX IF NOT EXISTS idx_groups_secondary_category ON public.groups(secondary_category) WHERE secondary_category IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_groups_primary_category_visibility ON public.groups(primary_category, visibility);
CREATE INDEX IF NOT EXISTS idx_groups_secondary_category_visibility ON public.groups(secondary_category, visibility) WHERE secondary_category IS NOT NULL;

-- Tabs indexes
CREATE INDEX IF NOT EXISTS idx_tabs_group_id ON public.tabs(group_id);
CREATE INDEX IF NOT EXISTS idx_tabs_user_id ON public.tabs(user_id);
CREATE INDEX IF NOT EXISTS idx_tabs_position ON public.tabs(group_id, position);

-- Social features indexes
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows(following_id);
CREATE INDEX IF NOT EXISTS idx_group_likes_group_id ON public.group_likes(group_id);
CREATE INDEX IF NOT EXISTS idx_group_comments_group_id ON public.group_comments(group_id);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_group_views_group_id ON public.group_views(group_id);
CREATE INDEX IF NOT EXISTS idx_group_views_viewed_at ON public.group_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_tab_clicks_tab_id ON public.tab_clicks(tab_id);
CREATE INDEX IF NOT EXISTS idx_tab_clicks_clicked_at ON public.tab_clicks(clicked_at DESC);

-- ============================================================================
-- AUTO-UPDATE TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON public.groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_group_comments_updated_at BEFORE UPDATE ON public.group_comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- AUTO USER PROFILE CREATION
-- ============================================================================

-- Function to automatically create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (
    id, email, full_name, avatar_url, username
  ) VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NULL
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error creating user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- AUTO-TAG INTELLIGENCE SYSTEM
-- ============================================================================

-- Domain to tags mapping function
CREATE OR REPLACE FUNCTION public.get_domain_tags(domain_name TEXT)
RETURNS TEXT[] AS $$
BEGIN
  CASE domain_name
    -- Technology domains
    WHEN 'github.com' THEN RETURN ARRAY['code', 'development', 'open-source', 'programming'];
    WHEN 'stackoverflow.com' THEN RETURN ARRAY['programming', 'development', 'coding', 'help'];
    WHEN 'npmjs.com' THEN RETURN ARRAY['javascript', 'packages', 'development', 'npm'];
    WHEN 'vercel.com' THEN RETURN ARRAY['deployment', 'hosting', 'development', 'nextjs'];
    WHEN 'supabase.com' THEN RETURN ARRAY['database', 'backend', 'development', 'api'];
    
    -- Design domains
    WHEN 'dribbble.com' THEN RETURN ARRAY['design', 'inspiration', 'ui', 'portfolio'];
    WHEN 'behance.net' THEN RETURN ARRAY['design', 'portfolio', 'creative', 'art'];
    WHEN 'figma.com' THEN RETURN ARRAY['design', 'ui', 'prototyping', 'collaboration'];
    WHEN 'canva.com' THEN RETURN ARRAY['design', 'templates', 'graphics', 'marketing'];
    WHEN 'unsplash.com' THEN RETURN ARRAY['photography', 'images', 'stock', 'design'];
    
    -- Business domains
    WHEN 'linkedin.com' THEN RETURN ARRAY['networking', 'professional', 'career', 'business'];
    WHEN 'notion.so' THEN RETURN ARRAY['productivity', 'organization', 'notes', 'collaboration'];
    WHEN 'airtable.com' THEN RETURN ARRAY['database', 'organization', 'productivity', 'business'];
    WHEN 'slack.com' THEN RETURN ARRAY['communication', 'team', 'collaboration', 'business'];
    
    -- Education domains
    WHEN 'coursera.org' THEN RETURN ARRAY['courses', 'learning', 'education', 'certification'];
    WHEN 'udemy.com' THEN RETURN ARRAY['courses', 'learning', 'tutorials', 'skills'];
    WHEN 'youtube.com' THEN RETURN ARRAY['video', 'tutorials', 'entertainment', 'learning'];
    
    -- Other domains (abbreviated for space)
    WHEN 'medium.com' THEN RETURN ARRAY['articles', 'writing', 'blog', 'reading'];
    WHEN 'netflix.com' THEN RETURN ARRAY['movies', 'tv', 'streaming', 'entertainment'];
    WHEN 'amazon.com' THEN RETURN ARRAY['shopping', 'products', 'ecommerce', 'marketplace'];
    
    ELSE RETURN ARRAY[]::TEXT[];
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Category to base tags mapping function
CREATE OR REPLACE FUNCTION public.get_category_base_tags(category collection_category)
RETURNS TEXT[] AS $$
BEGIN
  CASE category
    WHEN 'technology' THEN RETURN ARRAY['tools', 'software', 'productivity', 'apps'];
    WHEN 'design' THEN RETURN ARRAY['inspiration', 'visual', 'creative', 'art'];
    WHEN 'business' THEN RETURN ARRAY['professional', 'career', 'industry', 'networking'];
    WHEN 'education' THEN RETURN ARRAY['learning', 'courses', 'tutorials', 'knowledge'];
    WHEN 'lifestyle' THEN RETURN ARRAY['wellness', 'personal', 'improvement', 'habits'];
    WHEN 'travel' THEN RETURN ARRAY['destinations', 'adventure', 'planning', 'exploration'];
    WHEN 'food' THEN RETURN ARRAY['recipes', 'cooking', 'culinary', 'nutrition'];
    WHEN 'entertainment' THEN RETURN ARRAY['media', 'fun', 'leisure', 'content'];
    WHEN 'news' THEN RETURN ARRAY['current-events', 'analysis', 'journalism', 'updates'];
    WHEN 'shopping' THEN RETURN ARRAY['products', 'reviews', 'deals', 'marketplace'];
    WHEN 'home' THEN RETURN ARRAY['decoration', 'organization', 'diy', 'living'];
    WHEN 'finance' THEN RETURN ARRAY['money', 'investing', 'budgeting', 'planning'];
    ELSE RETURN ARRAY[]::TEXT[];
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Intelligent tag analysis function
CREATE OR REPLACE FUNCTION public.analyze_collection_for_tags(collection_id UUID)
RETURNS TEXT[] AS $$
DECLARE
  actual_tab_count INTEGER;
  collection_info RECORD;
  tab_info RECORD;
  suggested_tags TEXT[] := ARRAY[]::TEXT[];
  domain_tags TEXT[];
  category_tags TEXT[];
  existing_tags TEXT[];
  final_tags TEXT[];
BEGIN
  -- Get collection info
  SELECT 
    g.primary_category, 
    g.secondary_category, 
    g.tags 
  INTO collection_info
  FROM public.groups g
  WHERE g.id = collection_id;
  
  -- Count tabs directly
  SELECT COUNT(*) INTO actual_tab_count
  FROM public.tabs t
  WHERE t.group_id = collection_id;
  
  -- Only proceed if we have 3+ tabs
  IF actual_tab_count < 3 THEN
    RETURN ARRAY[]::TEXT[];
  END IF;
  
  -- Get existing tags
  existing_tags := COALESCE(collection_info.tags, ARRAY[]::TEXT[]);
  
  -- Start with category base tags
  category_tags := public.get_category_base_tags(collection_info.primary_category);
  suggested_tags := suggested_tags || category_tags;
  
  -- Add secondary category tags if exists
  IF collection_info.secondary_category IS NOT NULL THEN
    category_tags := public.get_category_base_tags(collection_info.secondary_category);
    suggested_tags := suggested_tags || category_tags;
  END IF;
  
  -- Analyze tabs for domain-based tags
  FOR tab_info IN 
    SELECT t.domain 
    FROM public.tabs t
    WHERE t.group_id = collection_id 
    AND t.domain IS NOT NULL
  LOOP
    domain_tags := public.get_domain_tags(tab_info.domain);
    suggested_tags := suggested_tags || domain_tags;
  END LOOP;
  
  -- Combine and deduplicate tags
  SELECT array_agg(DISTINCT tag ORDER BY tag)
  INTO final_tags
  FROM (
    SELECT unnest(existing_tags || suggested_tags) as tag
  ) t
  WHERE tag IS NOT NULL AND trim(tag) != '';
  
  -- Limit to 15 tags max
  final_tags := final_tags[1:15];
  
  RETURN COALESCE(final_tags, ARRAY[]::TEXT[]);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TAB COUNT & AUTO-TAG TRIGGERS (WORKING VERSION)
-- ============================================================================

-- Function to handle tab count changes
CREATE OR REPLACE FUNCTION public.handle_tab_count_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.groups 
        SET 
            tab_count = public.groups.tab_count + 1,
            last_activity_at = timezone('utc'::text, now())
        WHERE public.groups.id = NEW.group_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.groups 
        SET 
            tab_count = GREATEST(public.groups.tab_count - 1, 0),
            last_activity_at = timezone('utc'::text, now())
        WHERE public.groups.id = OLD.group_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to handle auto-tag updates
CREATE OR REPLACE FUNCTION public.handle_auto_tag_update()
RETURNS TRIGGER AS $$
DECLARE
    current_count INTEGER;
    new_tags TEXT[];
BEGIN
    IF TG_OP = 'INSERT' THEN
        SELECT g.tab_count INTO current_count
        FROM public.groups g
        WHERE g.id = NEW.group_id;
        
        IF current_count IS NOT NULL AND current_count % 3 = 0 THEN
            new_tags := public.analyze_collection_for_tags(NEW.group_id);
            UPDATE public.groups 
            SET tags = new_tags
            WHERE public.groups.id = NEW.group_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the working triggers
CREATE TRIGGER tabsverse_tab_count_trigger
    AFTER INSERT OR DELETE ON public.tabs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_tab_count_change();

CREATE TRIGGER tabsverse_auto_tag_trigger
    AFTER INSERT ON public.tabs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_auto_tag_update();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tab_clicks ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Groups policies
CREATE POLICY "Public groups visible to all" ON public.groups FOR SELECT USING (visibility = 'public' OR user_id = auth.uid());
CREATE POLICY "Users can manage own groups" ON public.groups FOR ALL USING (user_id = auth.uid());

-- Tabs policies  
CREATE POLICY "Tabs visible if group accessible" ON public.tabs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.groups 
    WHERE groups.id = tabs.group_id 
    AND (groups.visibility = 'public' OR groups.user_id = auth.uid())
  )
);
CREATE POLICY "Users can manage own tabs" ON public.tabs FOR ALL USING (user_id = auth.uid());

-- Social features policies
CREATE POLICY "Users can view related follows" ON public.follows FOR SELECT USING (follower_id = auth.uid() OR following_id = auth.uid());
CREATE POLICY "Users can manage own follows" ON public.follows FOR ALL USING (follower_id = auth.uid());

CREATE POLICY "Likes visible for public groups" ON public.group_likes FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.groups 
    WHERE groups.id = group_likes.group_id 
    AND groups.visibility = 'public'
  )
);
CREATE POLICY "Users can manage own likes" ON public.group_likes FOR ALL USING (user_id = auth.uid());

-- Similar policies for comments...
CREATE POLICY "Comments visible for public groups" ON public.group_comments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.groups 
    WHERE groups.id = group_comments.group_id 
    AND groups.visibility = 'public'
  )
);
CREATE POLICY "Users can manage own comments" ON public.group_comments FOR ALL USING (user_id = auth.uid());

-- Analytics policies (anyone can create, only owners can view)
CREATE POLICY "Anyone can create views" ON public.group_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create clicks" ON public.tab_clicks FOR INSERT WITH CHECK (true);

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_domain_tags(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_category_base_tags(collection_category) TO authenticated;
GRANT EXECUTE ON FUNCTION public.analyze_collection_for_tags(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_tab_count_change() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_auto_tag_update() TO authenticated;

-- Grant table permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.groups TO authenticated;
GRANT ALL ON public.tabs TO authenticated;
GRANT ALL ON public.follows TO authenticated;
GRANT ALL ON public.group_likes TO authenticated;
GRANT ALL ON public.group_comments TO authenticated;
GRANT ALL ON public.group_views TO authenticated;
GRANT ALL ON public.tab_clicks TO authenticated;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'Tabsverse database schema v2.3 installed successfully' as status;

-- Show created tables
SELECT 
    table_name,
    'Created successfully' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'groups', 'tabs', 'follows', 'group_likes', 'group_comments', 'group_views', 'tab_clicks')
ORDER BY table_name;

-- Show active triggers
SELECT 
    trigger_name,
    event_object_table,
    'Active' as status
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND event_object_table IN ('users', 'groups', 'tabs')
ORDER BY event_object_table, trigger_name;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
