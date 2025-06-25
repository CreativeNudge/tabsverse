-- Auto-Tag Intelligence System
-- Function to automatically suggest and update collection tags based on added tabs
-- Triggers after 3+ tabs to analyze domains and content for intelligent tag suggestions

-- Step 1: Create domain-to-tag mapping function
CREATE OR REPLACE FUNCTION public.get_domain_tags(domain_name TEXT)
RETURNS TEXT[] AS $$
BEGIN
  -- Map common domains to relevant tags
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
    WHEN 'khan academy.org' THEN RETURN ARRAY['education', 'learning', 'free', 'academy'];
    
    -- Lifestyle domains  
    WHEN 'medium.com' THEN RETURN ARRAY['articles', 'writing', 'blog', 'reading'];
    WHEN 'substack.com' THEN RETURN ARRAY['newsletter', 'writing', 'subscription', 'blog'];
    WHEN 'goodreads.com' THEN RETURN ARRAY['books', 'reading', 'reviews', 'literature'];
    
    -- Entertainment domains
    WHEN 'netflix.com' THEN RETURN ARRAY['movies', 'tv', 'streaming', 'entertainment'];
    WHEN 'spotify.com' THEN RETURN ARRAY['music', 'streaming', 'playlists', 'audio'];
    WHEN 'twitch.tv' THEN RETURN ARRAY['gaming', 'streaming', 'live', 'entertainment'];
    
    -- Shopping domains
    WHEN 'amazon.com' THEN RETURN ARRAY['shopping', 'products', 'ecommerce', 'marketplace'];
    WHEN 'etsy.com' THEN RETURN ARRAY['handmade', 'crafts', 'unique', 'shopping'];
    WHEN 'shopify.com' THEN RETURN ARRAY['ecommerce', 'business', 'online-store', 'selling'];
    
    -- News domains
    WHEN 'nytimes.com' THEN RETURN ARRAY['news', 'journalism', 'current-events', 'articles'];
    WHEN 'techcrunch.com' THEN RETURN ARRAY['tech-news', 'startups', 'technology', 'business'];
    WHEN 'reuters.com' THEN RETURN ARRAY['news', 'global', 'current-events', 'breaking'];
    
    -- Finance domains
    WHEN 'coinbase.com' THEN RETURN ARRAY['cryptocurrency', 'trading', 'finance', 'investing'];
    WHEN 'robinhood.com' THEN RETURN ARRAY['investing', 'stocks', 'trading', 'finance'];
    WHEN 'mint.com' THEN RETURN ARRAY['budgeting', 'finance', 'money', 'tracking'];
    
    -- Travel domains
    WHEN 'airbnb.com' THEN RETURN ARRAY['travel', 'accommodation', 'vacation', 'booking'];
    WHEN 'booking.com' THEN RETURN ARRAY['travel', 'hotels', 'booking', 'vacation'];
    WHEN 'tripadvisor.com' THEN RETURN ARRAY['travel', 'reviews', 'restaurants', 'tourism'];
    
    -- Food domains
    WHEN 'allrecipes.com' THEN RETURN ARRAY['recipes', 'cooking', 'food', 'kitchen'];
    WHEN 'foodnetwork.com' THEN RETURN ARRAY['recipes', 'cooking', 'chefs', 'food'];
    WHEN 'yelp.com' THEN RETURN ARRAY['restaurants', 'reviews', 'food', 'local'];
    
    -- Home domains
    WHEN 'pinterest.com' THEN RETURN ARRAY['inspiration', 'diy', 'home', 'ideas'];
    WHEN 'homedepot.com' THEN RETURN ARRAY['home-improvement', 'diy', 'tools', 'hardware'];
    WHEN 'ikea.com' THEN RETURN ARRAY['furniture', 'home', 'design', 'affordable'];
    
    ELSE RETURN ARRAY[]::TEXT[];
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Step 2: Create category-to-base-tags mapping function
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

-- Step 3: Create intelligent tag analysis function
CREATE OR REPLACE FUNCTION public.analyze_collection_for_tags(collection_id UUID)
RETURNS TEXT[] AS $$
DECLARE
  tab_count INTEGER;
  collection_record RECORD;
  tab_record RECORD;
  suggested_tags TEXT[] := ARRAY[]::TEXT[];
  domain_tags TEXT[];
  category_tags TEXT[];
  existing_tags TEXT[];
  final_tags TEXT[];
BEGIN
  -- Get collection info
  SELECT tab_count, primary_category, secondary_category, tags 
  INTO collection_record
  FROM public.groups 
  WHERE id = collection_id;
  
  -- Only proceed if we have 3+ tabs
  IF collection_record.tab_count < 3 THEN
    RETURN ARRAY[]::TEXT[];
  END IF;
  
  -- Get existing tags
  existing_tags := collection_record.tags;
  
  -- Start with category base tags
  category_tags := public.get_category_base_tags(collection_record.primary_category);
  suggested_tags := suggested_tags || category_tags;
  
  -- Add secondary category tags if exists
  IF collection_record.secondary_category IS NOT NULL THEN
    category_tags := public.get_category_base_tags(collection_record.secondary_category);
    suggested_tags := suggested_tags || category_tags;
  END IF;
  
  -- Analyze tabs for domain-based tags
  FOR tab_record IN 
    SELECT domain FROM public.tabs 
    WHERE group_id = collection_id 
    AND domain IS NOT NULL
  LOOP
    domain_tags := public.get_domain_tags(tab_record.domain);
    suggested_tags := suggested_tags || domain_tags;
  END LOOP;
  
  -- Remove duplicates and combine with existing tags
  final_tags := existing_tags;
  
  -- Add new tags that aren't already present
  SELECT array_agg(DISTINCT unnest)
  INTO final_tags
  FROM (
    SELECT unnest(final_tags || suggested_tags)
  ) t;
  
  -- Limit to reasonable number of tags (max 15)
  final_tags := final_tags[1:15];
  
  RETURN final_tags;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create trigger function to auto-update tags after tab additions
CREATE OR REPLACE FUNCTION public.auto_update_collection_tags()
RETURNS TRIGGER AS $$
DECLARE
  new_tags TEXT[];
BEGIN
  -- Only update tags when we reach exactly 3 tabs or every 3 tabs after that
  IF TG_OP = 'INSERT' THEN
    -- Get the updated tab count (after the trigger that updates tab_count has run)
    PERFORM pg_sleep(0.1); -- Small delay to ensure tab_count trigger has completed
    
    -- Check if we should update tags (3, 6, 9, 12, etc. tabs)
    IF (SELECT tab_count FROM public.groups WHERE id = NEW.group_id) % 3 = 0 THEN
      -- Analyze collection and get suggested tags
      new_tags := public.analyze_collection_for_tags(NEW.group_id);
      
      -- Update the collection with new tags
      UPDATE public.groups 
      SET tags = new_tags,
          last_activity_at = timezone('utc'::text, now())
      WHERE id = NEW.group_id;
      
      -- Log the tag update (optional, for debugging)
      RAISE LOG 'Auto-updated tags for collection %: %', NEW.group_id, array_to_string(new_tags, ', ');
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create trigger for auto tag updates
-- This runs AFTER the tab_count update trigger
CREATE TRIGGER trigger_auto_update_collection_tags
  AFTER INSERT ON public.tabs
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_update_collection_tags();

-- Step 6: Grant permissions
GRANT EXECUTE ON FUNCTION public.get_domain_tags(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_category_base_tags(collection_category) TO authenticated;
GRANT EXECUTE ON FUNCTION public.analyze_collection_for_tags(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.auto_update_collection_tags() TO authenticated;

-- Verification: Test the functions
SELECT 'Auto-tag intelligence system installed successfully' as status;

-- Test domain mapping
SELECT 'github.com tags:' as test, public.get_domain_tags('github.com') as tags
UNION ALL
SELECT 'dribbble.com tags:', public.get_domain_tags('dribbble.com')
UNION ALL
SELECT 'youtube.com tags:', public.get_domain_tags('youtube.com');

-- Test category mapping  
SELECT 'technology category tags:' as test, public.get_category_base_tags('technology') as tags
UNION ALL
SELECT 'design category tags:', public.get_category_base_tags('design')
UNION ALL
SELECT 'business category tags:', public.get_category_base_tags('business');
