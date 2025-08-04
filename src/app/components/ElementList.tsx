'use client';

import React, { useEffect, useState, useCallback } from 'react';
import SensorActuatorModal from './NewElementModal';
import ProjectModal from './NewProjectModal';
import SensorDetailsModal from './SensorDetailsModal';

type Elemento = {
  id: number;
  nombre: string;
};

const ElementList = ({ title }: { title?: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [elementos, setElementos] = useState<Elemento[]>([]);
  const [elementoAEditar, setElementoAEditar] = useState<Elemento | null>(null);
  const [sensorSeleccionado, setSensorSeleccionado] = useState<any>(null);

  const handleAddClick = () => {
    setElementoAEditar(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (elemento: Elemento) => {
    setElementoAEditar(elemento);
    setIsModalOpen(true);
  };

  const handleDeleteClick = useCallback(async (id: number) => {
    const confirmar = confirm('¿Seguro que desea eliminar este elemento?');
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/sensores/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar el sensor');
      fetchSensores();
    } catch (error) {
      console.error('Error al eliminar sensor:', error);
    }
  }, []);

  const handleNombreClick = async (id: number) => {
    try {
      const res = await fetch(`/api/sensores/${id}`);
      if (!res.ok) throw new Error('Error al obtener detalle del sensor');
      const data = await res.json();
      data.proyectos = data.proyectos?.map((ps: any) => ps.proyecto) ?? [];
      setSensorSeleccionado(data);
    } catch (error) {
      console.error('Error al obtener detalle del sensor:', error);
    }
  };

  const fetchSensores = useCallback(async () => {
    try {
      const res = await fetch('/api/sensores');
      if (!res.ok) throw new Error('Error al obtener sensores');
      const data = await res.json();
      const sensores = data.map((sensor: any) => ({
        id: sensor.sensor_id,
        nombre: sensor.nombre,
      }));
      setElementos(sensores);
    } catch (error) {
      console.error('Error al obtener sensores:', error);
    }
  }, []);

  useEffect(() => {
    if (title === 'Sensores') {
      fetchSensores();
    }
  }, [title, fetchSensores]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-6">
        {title}
      </h2>

      {elementos.length === 0 && (
        <p className="text-gray-500">No hay elementos disponibles.</p>
      )}

      <ul className="divide-y divide-gray-200">
        {elementos.map((elemento) => (
          <li key={elemento.id} className="py-4 flex justify-between items-center">
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => handleNombreClick(elemento.id)}
            >
              {elemento.nombre}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditClick(elemento)}
                className="text-yellow-600 hover:text-yellow-800"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteClick(elemento.id)}
                className="text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={handleAddClick}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Agregar {title?.slice(0, -1)}
      </button>

      {title === 'Sensores' && isModalOpen && (
        <SensorActuatorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={elementoAEditar}
          onSave={fetchSensores}
        />
      )}

      {title === 'Proyectos' && isModalOpen && (
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={elementoAEditar}
        />
      )}

      {title === 'Sensores' && sensorSeleccionado && (
        <SensorDetailsModal
          sensor={sensorSeleccionado}
          onClose={() => setSensorSeleccionado(null)}
        />
      )}
    </div>
  );
};

export default ElementList;
