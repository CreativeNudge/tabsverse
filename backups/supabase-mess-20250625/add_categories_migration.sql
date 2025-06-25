-- Add Categories to Tabsverse Database
-- Migration to add primary + optional secondary categories to groups table
-- Run this in Supabase SQL Editor after the main schema is in place

-- Step 1: Create the category enum type
CREATE TYPE public.collection_category AS ENUM (
  'technology',    -- Technology & Tools - Software, apps, dev resources, productivity tools
  'design',        -- Design & Creative - Inspiration, tutorials, design resources, portfolios
  'business',      -- Business & Career - Professional development, industry resources, networking
  'education',     -- Learning & Education - Courses, tutorials, research, academic resources
  'lifestyle',     -- Lifestyle & Health - Fitness, wellness, self-improvement, hobbies
  'travel',        -- Travel & Places - Destinations, guides, planning resources
  'food',          -- Food & Cooking - Recipes, restaurants, culinary inspiration
  'entertainment', -- Entertainment & Media - Movies, music, books, games, podcasts
  'news',          -- News & Current Events - Articles, analysis, staying informed
  'shopping',      -- Shopping & Products - Product research, wishlists, recommendations
  'home',          -- Home & DIY - Decoration, projects, organization, gardening
  'finance'        -- Finance & Investing - Financial planning, investment research, money management
);

-- Step 2: Add category columns to groups table
ALTER TABLE public.groups 
ADD COLUMN primary_category collection_category NOT NULL DEFAULT 'technology';

ALTER TABLE public.groups 
ADD COLUMN secondary_category collection_category NULL;

-- Step 3: Add constraint to ensure primary and secondary are different
ALTER TABLE public.groups 
ADD CONSTRAINT different_categories CHECK (
  secondary_category IS NULL OR primary_category != secondary_category
);

-- Step 4: Add index for category-based queries (important for discovery performance)
CREATE INDEX idx_groups_primary_category ON public.groups(primary_category);
CREATE INDEX idx_groups_secondary_category ON public.groups(secondary_category) WHERE secondary_category IS NOT NULL;

-- Step 5: Add compound indexes for category + visibility queries (for public discovery)
CREATE INDEX idx_groups_primary_category_visibility ON public.groups(primary_category, visibility);
CREATE INDEX idx_groups_secondary_category_visibility ON public.groups(secondary_category, visibility) WHERE secondary_category IS NOT NULL;

-- Step 6: Add comments for documentation
COMMENT ON COLUMN public.groups.primary_category IS 'Primary category for organization and discovery - full weight in algorithms';
COMMENT ON COLUMN public.groups.secondary_category IS 'Optional secondary category for crossover collections - reduced weight in algorithms';
COMMENT ON TYPE public.collection_category IS 'Exhaustive and exclusive categories for collection organization and discovery';

-- Step 7: Update the groups table settings to include category-based defaults
-- This will be used by the application to set smart defaults based on category
UPDATE public.groups 
SET settings = settings || jsonb_build_object(
  'category_defaults_applied', true,
  'auto_tags_from_category', true
)
WHERE settings IS NOT NULL;

-- Step 8: Remove the default after migration (forces explicit category selection going forward)
-- Note: Keep default for now since we're in development, can remove later
-- ALTER TABLE public.groups ALTER COLUMN primary_category DROP DEFAULT;

-- Verification queries
SELECT 
  'Categories migration completed successfully' as status,
  count(*) as total_groups,
  primary_category,
  count(*) as groups_in_category
FROM public.groups 
GROUP BY primary_category
ORDER BY groups_in_category DESC;

-- Show the new enum values
SELECT enumlabel as available_categories 
FROM pg_enum 
WHERE enumtypid = 'public.collection_category'::regtype
ORDER BY enumlabel;

-- Show the new constraints
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.groups'::regclass 
AND conname = 'different_categories';
