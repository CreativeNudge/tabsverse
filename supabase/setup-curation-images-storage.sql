-- Supabase Storage Setup for Tabsverse Curation Images
-- Run this script in your Supabase SQL Editor to set up image storage

-- Create storage bucket for curation images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'curation-images',
  'curation-images',
  true,  -- Public bucket for CDN access
  5242880,  -- 5MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for curation images bucket

-- Policy: Authenticated users can upload images
CREATE POLICY "Authenticated users can upload curation images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'curation-images');

-- Policy: Anyone can view public images (for CDN access)
CREATE POLICY "Anyone can view curation images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'curation-images');

-- Policy: Users can update their own curation images
CREATE POLICY "Users can update curation images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'curation-images');

-- Policy: Users can delete curation images (for cleanup)
CREATE POLICY "Users can delete curation images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'curation-images');

-- Verify bucket creation
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  'Created successfully' as status
FROM storage.buckets 
WHERE id = 'curation-images';

-- Show storage policies
SELECT 
  policyname,
  cmd,
  qual,
  'Policy active' as status
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%curation%'
ORDER BY policyname;
