-- Primero, elimina la política recursiva si la creaste
DROP POLICY IF EXISTS "Los miembros pueden ver otros miembros de sus grupos" ON group_members;

-- Crear una función que devuelva los IDs de grupos del usuario actual
-- Esta función se ejecuta con SECURITY DEFINER para evitar la recursión de RLS
CREATE OR REPLACE FUNCTION get_user_group_ids(user_uuid UUID)
RETURNS TABLE(group_id TEXT) 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT group_id 
  FROM group_members 
  WHERE user_id = user_uuid;
$$;

-- Ahora crear la política usando la función
CREATE POLICY "Los miembros pueden ver otros miembros de sus grupos"
  ON group_members FOR SELECT
  USING (
    group_id IN (
      SELECT get_user_group_ids(auth.uid())
    )
  );
