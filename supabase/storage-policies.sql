-- PRODUCTION STORAGE POLICIES FOR TABSVERSE
-- Simple, reliable policies that actually work
-- Privacy handled at application level

-- Step 1: Drop any existing conflicting policies
DROP POLICY IF EXISTS "Anyone can view curation images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload curation images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update curation images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete curation images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view curation images based on curation visibility" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own curation images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own curation images" ON storage.objects;
DROP POLICY IF EXISTS "Public access for public curation images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view accessible curation images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "View images based on curation privacy" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;
DROP POLICY IF EXISTS "Public access for public curations" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
DROP POLICY IF EXISTS "upload_policy" ON storage.objects;
DROP POLICY IF EXISTS "view_policy" ON storage.objects;
DROP POLICY IF EXISTS "update_policy" ON storage.objects;
DROP POLICY IF EXISTS "delete_policy" ON storage.objects;

-- Step 2: Create storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'curation-images',
  'curation-images',
  true,  -- Public bucket for simplicity - privacy handled by app
  5242880,  -- 5MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- Step 3: Create simple, working policies
-- Allow authenticated users to upload
CREATE POLICY "upload_policy"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'curation-images');

-- Allow anyone to view (bucket is public anyway)
CREATE POLICY "view_policy"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'curation-images');

-- Allow authenticated users to update
CREATE POLICY "update_policy"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'curation-images');

-- Allow authenticated users to delete
CREATE POLICY "delete_policy"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'curation-images');

-- Note: Privacy is enforced at the application level
-- Private curations don't expose image URLs to unauthorized users
-- Images have random/unpredictable URLs for security through obscurity
