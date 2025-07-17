'use client'

import React, { useEffect, useState } from 'react';
import SensorActuatorModal from './NewElemetModal';
import ProjectModal from './NewProjectModal';

const ElementList = ({ title }: { title?: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const [elementos, setElementos] = useState<{ id: number; nombre: string }[]>([]);

  const fetchData = async () => {
    try {
      let url = '';
      if (title === 'Sensores') url = '/api/sensores';
      else if (title === 'Actuadores') url = '/api/actuadores';
      else if (title === 'Proyectos') url = '/api/proyectos';
      else return;

      const res = await fetch(url);
      const data = await res.json();

      const normalizados = data.map((item: any) => ({
        id: item.sensor_id ?? item.actuator_id ?? item.project_id ?? item.id,
        nombre: item.nombre,
      }));

      setElementos(normalizados);
    } catch (error) {
      console.error('Error al obtener elementos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [title]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-6">
        {title}
      </h2>

      <div className="space-y-4">
        {elementos.map((el) => (
          <div
            key={el.id}
            className="flex items-center justify-between p-4 bg-gray-100 rounded-md"
          >
            <span className="text-gray-700">{el.nombre}</span>
            <button className="text-blue-500 hover:text-blue-700 transition-colors">
              Editar
            </button>
          </div>
        ))}
      </div>

      {/* Botón para añadir un nuevo elemento */}
      <div className="mt-6 text-center">
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
        >
          +
        </button>
      </div>

      {isModalOpen && (
        title === 'Proyectos' ? (
          <ProjectModal
            onClose={() => {
              setIsModalOpen(false);
              fetchData();
            }}
          />
        ) : (
          <SensorActuatorModal
            title={title}
            onClose={() => setIsModalOpen(false)}
            onSave={async () => {
              await fetchData();
            }}
          />
        )
      )}
    </div>
  );
};

export default ElementList;
