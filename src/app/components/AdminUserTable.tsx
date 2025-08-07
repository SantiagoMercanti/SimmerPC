'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react'; // Icono de papelera

type Props = {
  initialUsers: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    created_at: string;
    tipo: 'operator' | 'labManager' | 'admin';
  }[];
};

export default function AdminUserTable({ initialUsers }: Props) {
  const supabase = createClientComponentClient();
  const [users, setUsers] = useState(initialUsers ?? []);

  const tipoOptions = [
    { label: 'Operador', value: 'operator' },
    { label: 'Jefe de Laboratorio', value: 'labManager' },
    { label: 'Admin', value: 'admin' },
  ];

  const handleTipoChange = async (userId: string, newTipo: string) => {
    const { error } = await supabase
      .from('UserMetadata')
      .update({ tipo: newTipo })
      .eq('id', userId);

    if (error) {
      toast.error('Error al actualizar tipo: ' + error.message);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, tipo: newTipo as typeof u.tipo } : u))
      );
      toast.success('Tipo de usuario actualizado');
    }
  };

  const handleDelete = async (userId: string) => {
    toast((t) => (
      <span className="flex flex-col gap-2">
        <span>¿Eliminar este usuario?</span>
        <div className="flex justify-end gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);

              const res = await fetch('/api/users', {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
              });

              const data = await res.json();

              if (!res.ok) {
                toast.error(data.error || 'Error al eliminar el usuario');
              } else {
                setUsers((prev) => prev.filter((u) => u.id !== userId));
                toast.success('Usuario eliminado');
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Confirmar
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-600 hover:text-black px-3 py-1 text-sm"
          >
            Cancelar
          </button>
        </div>
      </span>
    ), {
      duration: 10000,
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 text-sm bg-gray-200">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-center">
            <th className="p-3">Nombre</th>
            <th className="p-3">Apellido</th>
            <th className="p-3">Email</th>
            <th className="p-3">Fecha de creación</th>
            <th className="p-3">Tipo de usuario</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b bg-white hover:bg-gray-50 transition text-center">
              <td className="p-3">{user.nombre}</td>
              <td className="p-3">{user.apellido}</td>
              <td className="p-3">{user.email || 'Desconocido'}</td>
              <td className="p-3">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : 'Desconocida'}
              </td>
              <td className="p-3">
                <select
                  value={user.tipo}
                  onChange={(e) => handleTipoChange(user.id, e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1"
                >
                  {tipoOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Eliminar usuario"
                  aria-label="Eliminar usuario"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
