'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function RegisterPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== repeatPassword) {
      setErrorMsg('Las contraseñas no coinciden');
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      setErrorMsg('Error al registrar el usuario: ' + authError?.message);
      return;
    }

    const userId = authData.user.id;

    const { error: metaError } = await supabase.from('UserMetadata').insert([
      {
        id: userId,
        nombre,
        apellido,
        tipo: 'operator',
      },
    ]);

    if (metaError) {
      setErrorMsg('Usuario creado, pero error al guardar metadata: ' + metaError.message);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-blue-600 text-center mb-2 tracking-wide">
          SIMMER
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Sistema Informático de Monitoreo Mercanti
        </p>
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Registro de usuario</h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1 text-gray-800">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Carlos"
              required
              className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-800">Apellido</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              placeholder="García"
              required
              className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-800">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
              className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-800">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-800">Repetir contraseña</label>
            <input
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              placeholder="********"
              required
              className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
          >
            Registrarse
          </button>

          {errorMsg && <p className="text-sm text-red-600 text-center">{errorMsg}</p>}
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-blue-600 hover:underline font-medium"
            >
              Inicia sesión
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
