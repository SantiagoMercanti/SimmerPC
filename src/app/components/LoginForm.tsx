'use client';

import { useState } from 'react';
import { client } from '@/supabase/client'; 

export default function LoginForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await client.auth.signInWithOtp({ email });
      console.log('📨 Email enviado:', result);
    } catch (error) {
      console.error('Error inesperado:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-10 p-6 bg-white shadow-md rounded-xl space-y-4"
    >
      <h2 className="text-xl font-semibold text-center text-black">Iniciar sesión</h2>

      <input
        type="email"
        placeholder="youremail@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Enviar
      </button>
    </form>
  );
}
