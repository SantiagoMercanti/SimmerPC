import React from 'react';
import ElementList from '@/app/components/ElementList';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const DashboardPage = async () => {
  const supabase = createServerComponentClient({
    cookies: () => cookies(),
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login');
  }

  // Obtener tipo de usuario
  const { data: metadata, error } = await supabase
    .from('UserMetadata')
    .select('tipo')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error obteniendo tipo de usuario:', error.message);
  }

  const tipoUsuario = metadata?.tipo || 'operator';

  // Solo pueden editar/eliminar labManager o admin
  const canEdit = tipoUsuario === 'labManager' || tipoUsuario === 'admin';

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ElementList title="Proyectos" canEdit={canEdit} />
          <ElementList title="Sensores" canEdit={canEdit} />
          <ElementList title="Actuadores" canEdit={canEdit} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
