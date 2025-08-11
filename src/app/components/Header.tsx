'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { LogOut, Shield } from 'lucide-react';

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
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error al obtener usuario:', userError.message);
        return;
      }

      if (!user) return;

      const { data, error } = await supabase
        .from('UserMetadata')
        .select('tipo')
        .eq('id', user.id)
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
    <header className="w-full bg-blue-800 text-white shadow-md px-6 py-4 flex justify-between items-center">
    <button
      onClick={() => router.push('/dashboard')}
      className="text-2xl tracking-wider text-white hover:text-gray-300 focus:outline-none"
      aria-label="Ir al Dashboard"
      type="button"
    >
      S I M M E R
    </button>
      <div className="flex items-center gap-4">
        {userType === 'admin' && (
          <button
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md transition text-sm font-medium"
            onClick={() => router.push('/admin')}
          >
            <Shield size={18} />
            Admin
          </button>
        )}
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="p-2 rounded-full hover:bg-blue-600 transition"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
