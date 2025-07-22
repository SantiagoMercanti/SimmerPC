'use client';

import React from 'react';

const Header = () => {
  return (
    <header className="w-full bg-blue-700 text-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">S I M M E R</h1>
      <div className="space-x-4">
        <button className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md transition">Nivel de usuarios</button>
        <button className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md transition">Configuración</button>
        <button className="bg-red-400 hover:bg-red-700 px-4 py-2 rounded-md transition">Cerrar sesión</button>
      </div>
    </header>
  );
};

export default Header;
