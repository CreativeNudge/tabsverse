-- ULTRA SIMPLE: Just basic authentication for storage
-- Privacy will be handled at the application level

-- Create storage bucket for curation images (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'curation-images',
  'curation-images',
  true,  -- Make it public for simplicity
  5242880,  -- 5MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- Drop all existing complex policies
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

-- SIMPLE: Only authenticated users can upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'curation-images');

-- SIMPLE: Anyone can view (privacy handled at app level)
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'curation-images');

-- SIMPLE: Authenticated users can update
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'curation-images');

-- SIMPLE: Authenticated users can delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'curation-images');

SELECT 'Storage policies ultra-simplified' as status;
