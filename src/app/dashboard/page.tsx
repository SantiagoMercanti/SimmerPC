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
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ElementList title="Proyectos" />
          <ElementList title="Sensores" />
          <ElementList title="Actuadores" />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
