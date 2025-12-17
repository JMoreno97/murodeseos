-- Crear bucket de almacenamiento para imágenes de la lista de deseos
INSERT INTO storage.buckets (id, name, public)
VALUES ('wishlist-images', 'wishlist-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política de seguridad para permitir ver imágenes (público)
CREATE POLICY "Imágenes de wishlist son públicas"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'wishlist-images' );

-- Política de seguridad para permitir subir imágenes (usuarios autenticados)
CREATE POLICY "Usuarios autenticados pueden subir imágenes"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'wishlist-images' AND
    auth.role() = 'authenticated'
  );

-- Política de seguridad para permitir actualizar sus propias imágenes
CREATE POLICY "Usuarios pueden actualizar sus propias imágenes"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'wishlist-images' AND
    auth.uid() = owner
  );

-- Política de seguridad para permitir eliminar sus propias imágenes
CREATE POLICY "Usuarios pueden eliminar sus propias imágenes"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'wishlist-images' AND
    auth.uid() = owner
  );
