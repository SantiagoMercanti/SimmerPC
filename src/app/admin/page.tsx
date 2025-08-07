import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import AdminUserTable from '@/app/components/AdminUserTable';

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies });

  // 1. Obtener metadatos desde Supabase
  const { data: metadata } = await supabase
    .from('UserMetadata')
    .select('id, nombre, apellido, tipo');

  if (!metadata) return <p>Error al obtener usuarios</p>;

  // 2. Obtener los usuarios desde API interna protegida
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users`, {
    cache: 'no-store',
  });

  const authUsers = await res.json();

  // 3. Combinar los datos
  const authMap = Object.fromEntries(
    authUsers.map((u: any) => [u.id, { email: u.email, created_at: u.created_at }])
  );

  const initialUsers = metadata.map((meta) => ({
    id: meta.id,
    nombre: meta.nombre,
    apellido: meta.apellido,
    tipo: meta.tipo as 'operator' | 'labManager' | 'admin',
    email: authMap[meta.id]?.email ?? 'Desconocido',
    created_at: authMap[meta.id]?.created_at ?? '',
  }));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-black-700">Administración de Usuarios</h1>
      <AdminUserTable initialUsers={initialUsers} />
    </div>
  );
}
