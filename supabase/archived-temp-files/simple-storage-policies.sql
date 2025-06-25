-- SIMPLIFIED: Supabase Storage Setup for Tabsverse Curation Images
-- Focus on privacy: private curations = owner only, public curations = everyone

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
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- Drop all existing policies first
DROP POLICY IF EXISTS "Anyone can view curation images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload curation images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update curation images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete curation images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view curation images based on curation visibility" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own curation images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own curation images" ON storage.objects;
DROP POLICY IF EXISTS "Public access for public curation images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view accessible curation images" ON storage.objects;

-- SIMPLE POLICY 1: Authenticated users can upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'curation-images'
);

-- SIMPLE POLICY 2: Users can view images based on curation privacy
CREATE POLICY "View images based on curation privacy"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'curation-images' AND
  (
    -- If curation is public, anyone can view the image
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.cover_image_url = (storage.objects.bucket_id || '/object/public/' || bucket_id || '/' || name)
      AND g.visibility = 'public'
    )
    OR
    -- If curation is private, only the owner can view
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.cover_image_url = (storage.objects.bucket_id || '/object/public/' || bucket_id || '/' || name)
      AND g.visibility = 'private'
      AND g.user_id = auth.uid()
    )
  )
);

-- SIMPLE POLICY 3: Users can update their own curation images
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'curation-images' AND
  EXISTS (
    SELECT 1 FROM public.groups g
    WHERE g.cover_image_url = (storage.objects.bucket_id || '/object/public/' || bucket_id || '/' || name)
    AND g.user_id = auth.uid()
  )
);

-- SIMPLE POLICY 4: Users can delete their own curation images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'curation-images' AND
  EXISTS (
    SELECT 1 FROM public.groups g
    WHERE g.cover_image_url = (storage.objects.bucket_id || '/object/public/' || bucket_id || '/' || name)
    AND g.user_id = auth.uid()
  )
);

-- PUBLIC ACCESS: Allow public users to view public curation images
CREATE POLICY "Public access for public curations"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'curation-images' AND
  EXISTS (
    SELECT 1 FROM public.groups g
    WHERE g.cover_image_url = (storage.objects.bucket_id || '/object/public/' || bucket_id || '/' || name)
    AND g.visibility = 'public'
  )
);

-- Verify setup
SELECT 
  'Storage policies simplified' as status,
  'Private curations = owner only access' as private_policy,
  'Public curations = everyone can access' as public_policy;
