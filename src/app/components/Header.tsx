'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [userType, setUserType] = useState<string | null>(null);

  const hideIn = ['/login', '/register'];
  const shouldHide = hideIn.includes(pathname);

  useEffect(() => {
    const fetchUserType = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userId = session?.user?.id;

      if (!userId) return;

      const { data, error } = await supabase
        .from('UserMetadata')
        .select('tipo')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error al obtener tipo de usuario:', error.message);
        return;
      }

      setUserType(data?.tipo ?? null);
    };

    fetchUserType();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (shouldHide) return null;

  return (
    <header className="w-full bg-blue-700 text-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">S I M M E R</h1>
      <div className="space-x-4">
        {userType === 'admin' && (
          <button className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md transition">
            Nivel de usuarios
          </button>
        )}
        <button
          onClick={handleLogout}
          className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md transition">        
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Header;
