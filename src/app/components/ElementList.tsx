'use client'

import React from 'react';

const ElementList = ({ title }: { title?: string }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Titulo de la lista */}
      <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-6">
        {title}
      </h2>
      {/* Lista de elementos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-100 rounded-md">
          <span className="text-gray-700">Elemento 1</span>
          <button className="text-blue-500 hover:text-blue-700 transition-colors">
            Editar
          </button>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-100 rounded-md">
          <span className="text-gray-700">Elemento 2</span>
          <button className="text-blue-500 hover:text-blue-700 transition-colors">
            Editar
          </button>
        </div>
        {/* Agrega más elementos según sea necesario */}

      </div>

      {/* Botón para añadir un nuevo elemento */}
      <div className="mt-6 text-center">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ElementList;