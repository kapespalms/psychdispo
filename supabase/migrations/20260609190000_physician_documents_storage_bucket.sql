-- Private physician career document storage (CV, resume, pasted exports).
-- Path convention: {user_id}/documents/{timestamp}-{filename}
-- Linked via source_artifacts.storage_path — not confirmed evidence.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'physician-documents',
  'physician-documents',
  false,
  10485760,
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
CREATE POLICY "Users can read own physician documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'physician-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Users can insert own physician documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'physician-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Users can update own physician documents"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'physician-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'physician-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Users can delete own physician documents"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'physician-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
