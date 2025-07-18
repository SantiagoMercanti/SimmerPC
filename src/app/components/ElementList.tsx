'use client';

import React, { useEffect, useState } from 'react';
import SensorActuatorModal from './NewElemetModal';
import ProjectModal from './NewProjectModal';

const ElementList = ({ title }: { title?: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [elementos, setElementos] = useState<{ id: number; nombre: string }[]>([]);
  const [elementoAEditar, setElementoAEditar] = useState<{ id: number; nombre: string } | null>(null);

  const handleAddClick = () => {
    setElementoAEditar(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (elemento: { id: number; nombre: string }) => {
    setElementoAEditar(elemento);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    const confirmar = confirm('¿Seguro que desea eliminar este elemento?');
    if (!confirmar) return;

    try {
      let url = '';
      if (title === 'Sensores') url = `/api/sensores/${id}`;
      else if (title === 'Actuadores') url = `/api/actuadores/${id}`;
      else if (title === 'Proyectos') url = `/api/proyectos/${id}`;
      else return;

      const res = await fetch(url, { method: 'DELETE' });

      if (res.ok) {
        fetchData();
      } else {
        console.error('Error al eliminar el elemento');
      }
    } catch (error) {
      console.error('Error en la eliminación:', error);
    }
  };

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
            <div className="flex space-x-2">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handleEditClick(el)}
              >
                Editar
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDeleteClick(el.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
        >
          +
        </button>
      </div>

      {isModalOpen &&
        (title === 'Proyectos' ? (
          <ProjectModal
            onClose={() => {
              setIsModalOpen(false);
              setElementoAEditar(null);
              fetchData();
            }}
            onSave={fetchData}
            proyectoAEditar={elementoAEditar ?? undefined}
          />
        ) : (
          <SensorActuatorModal
            title={title}
            onClose={() => {
              setIsModalOpen(false);
              setElementoAEditar(null);
              fetchData();
            }}
            onSave={fetchData}
            elementoAEditar={elementoAEditar ?? undefined}
          />
        )
        )}
    </div>
  );
};

export default ElementList;
