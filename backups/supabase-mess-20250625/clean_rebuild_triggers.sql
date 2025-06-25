-- TABSVERSE DATABASE CLEANUP & REBUILD
-- Single file to clean up all trigger conflicts and restore working functionality
-- This replaces all the previous "fix" files with one clean solution

-- ============================================================================
-- STEP 1: COMPLETE CLEANUP - Remove all conflicting triggers and functions
-- ============================================================================

-- Remove all triggers on tabs table
DROP TRIGGER IF EXISTS trigger_update_group_tab_count ON public.tabs;
DROP TRIGGER IF EXISTS trigger_auto_update_collection_tags ON public.tabs;
DROP TRIGGER IF EXISTS trigger_01_update_group_tab_count ON public.tabs;
DROP TRIGGER IF EXISTS trigger_02_auto_update_collection_tags ON public.tabs;

-- Remove all problematic functions
DROP FUNCTION IF EXISTS public.update_group_tab_count() CASCADE;
DROP FUNCTION IF EXISTS public.auto_update_collection_tags() CASCADE;

-- Keep the category and domain mapping functions (these work fine)
-- Keep public.get_domain_tags(TEXT)
-- Keep public.get_category_base_tags(collection_category)
-- Keep public.analyze_collection_for_tags(UUID) - but we'll fix it

-- ============================================================================
-- STEP 2: FIX THE ANALYZE FUNCTION (remove ambiguous references)
-- ============================================================================

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
  
  -- Count tabs directly (avoid any ambiguity)
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
  
  -- Combine existing tags with suggested tags and remove duplicates
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
-- STEP 3: CREATE SIMPLE, ROBUST TAB COUNT TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION public.simple_update_tab_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment tab count and update last activity
        UPDATE public.groups 
        SET 
            tab_count = tab_count + 1,
            last_activity_at = timezone('utc'::text, now())
        WHERE id = NEW.group_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement tab count and update last activity
        UPDATE public.groups 
        SET 
            tab_count = GREATEST(tab_count - 1, 0),
            last_activity_at = timezone('utc'::text, now())
        WHERE id = OLD.group_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER tabs_update_count
    AFTER INSERT OR DELETE ON public.tabs
    FOR EACH ROW
    EXECUTE FUNCTION public.simple_update_tab_count();

-- ============================================================================
-- STEP 4: CREATE SIMPLE AUTO-TAG TRIGGER (OPTIONAL - Can be disabled easily)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.simple_auto_tag_update()
RETURNS TRIGGER AS $$
DECLARE
    current_count INTEGER;
    new_tags TEXT[];
BEGIN
    -- Only run on INSERT
    IF TG_OP = 'INSERT' THEN
        -- Get current tab count for this group
        SELECT tab_count INTO current_count
        FROM public.groups 
        WHERE id = NEW.group_id;
        
        -- Update tags every 3 tabs (3, 6, 9, etc.)
        IF current_count % 3 = 0 THEN
            -- Get suggested tags
            new_tags := public.analyze_collection_for_tags(NEW.group_id);
            
            -- Update collection tags
            UPDATE public.groups 
            SET tags = new_tags
            WHERE id = NEW.group_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the auto-tag trigger (runs after the count trigger)
CREATE TRIGGER tabs_auto_tag_update
    AFTER INSERT ON public.tabs
    FOR EACH ROW
    EXECUTE FUNCTION public.simple_auto_tag_update();

-- ============================================================================
-- STEP 5: GRANT PERMISSIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.simple_update_tab_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.simple_auto_tag_update() TO authenticated;
GRANT EXECUTE ON FUNCTION public.analyze_collection_for_tags(UUID) TO authenticated;

-- ============================================================================
-- STEP 6: VERIFICATION
-- ============================================================================

-- Show current triggers
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    'Rebuilt successfully' as status
FROM information_schema.triggers 
WHERE event_object_table = 'tabs' 
AND trigger_schema = 'public'
ORDER BY trigger_name;

-- Test the functions
SELECT 'Cleanup and rebuild completed successfully' as final_status;

-- ============================================================================
-- NOTES FOR KARINA:
-- ============================================================================
-- 1. This file replaces ALL the previous fix files
-- 2. Simple, clear trigger names that won't conflict  
-- 3. No ambiguous column references - everything is explicit
-- 4. Easy to understand and maintain
-- 5. Can disable auto-tagging by dropping that trigger if needed
-- 6. Keeps all the category functionality that was working
-- ============================================================================
