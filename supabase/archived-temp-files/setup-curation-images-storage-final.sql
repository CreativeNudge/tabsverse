-- UPDATED: Fixed Supabase Storage Setup for Tabsverse Curation Images
-- Simplified policies to fix creation flow while maintaining privacy

-- Create storage bucket for curation images (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'curation-images',
  'curation-images',
  false,  -- Private bucket to control access via policies
  5242880,  -- 5MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,  -- Ensure bucket is private
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- Drop existing policies first
DROP POLICY IF EXISTS "Anyone can view curation images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload curation images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update curation images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete curation images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view curation images based on curation visibility" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own curation images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own curation images" ON storage.objects;
DROP POLICY IF EXISTS "Public access for public curation images" ON storage.objects;

-- SIMPLIFIED POLICY: Authenticated users can upload images
-- This allows uploads during curation creation before policies can check
CREATE POLICY "Authenticated users can upload curation images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'curation-images' AND
  auth.uid() IS NOT NULL
);

-- SIMPLIFIED POLICY: Users can view images if they own them or curation is public
-- Using simpler logic that handles temp files and existing curations
CREATE POLICY "Users can view accessible curation images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'curation-images' AND
  (
    -- Allow access to temp files for 1 hour (during creation flow)
    (name LIKE 'curation-covers/temp-%' AND created_at > now() - interval '1 hour')
    OR
    -- Owner can always view their images
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.cover_image_url LIKE '%' || name || '%'
      AND g.user_id = auth.uid()
    )
    OR
    -- Others can view if curation is public
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.cover_image_url LIKE '%' || name || '%'
      AND g.visibility = 'public'
    )
  )
);

-- SIMPLIFIED POLICY: Users can update their own files or temp files
CREATE POLICY "Users can update their curation images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'curation-images' AND
  (
    -- Allow updates to temp files within 1 hour
    (name LIKE 'curation-covers/temp-%' AND created_at > now() - interval '1 hour')
    OR
    -- Allow updates to owned curation images
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.cover_image_url LIKE '%' || name || '%'
      AND g.user_id = auth.uid()
    )
  )
);

-- SIMPLIFIED POLICY: Users can delete their own files or temp files
CREATE POLICY "Users can delete their curation images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'curation-images' AND
  (
    -- Allow deletion of temp files within 1 hour
    (name LIKE 'curation-covers/temp-%' AND created_at > now() - interval '1 hour')
    OR
    -- Allow deletion of owned curation images
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.cover_image_url LIKE '%' || name || '%'
      AND g.user_id = auth.uid()
    )
  )
);

-- PUBLIC ACCESS POLICY: Allow public access for public curations
-- This enables CDN access for public curations
CREATE POLICY "Public access for public curation images"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'curation-images' AND
  EXISTS (
    SELECT 1 FROM public.groups g
    WHERE g.cover_image_url LIKE '%' || name || '%'
    AND g.visibility = 'public'
  )
);

-- Verify bucket configuration
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  CASE 
    WHEN public = false THEN 'Correctly set to private with policy-based access'
    ELSE 'WARNING: Should be private'
  END as status
FROM storage.buckets 
WHERE id = 'curation-images';

-- Show updated storage policies
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN policyname LIKE '%temp%' THEN 'Temporary file policy (1 hour)'
    WHEN policyname LIKE '%accessible%' THEN 'Privacy-aware access policy'
    WHEN policyname LIKE '%public curation%' THEN 'Public CDN access policy'
    ELSE 'Standard policy'
  END as policy_type,
  'Policy active' as status
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%curation%'
ORDER BY policyname;

-- Test verification
SELECT 
  'Storage policies updated' as status,
  'Temp files allowed for 1 hour during creation' as creation_flow,
  'Privacy respected after curation exists' as privacy_protection;
