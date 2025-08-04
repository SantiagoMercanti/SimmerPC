'use client';

import React, { useEffect, useState } from 'react';
import SensorActuatorModal from './NewElementModal';
import ProjectModal from './NewProjectModal';
import SensorDetailsModal from './SensorDetailsModal';

const ElementList = ({ title }: { title?: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [elementos, setElementos] = useState<{ id: number; nombre: string }[]>([]);
  const [elementoAEditar, setElementoAEditar] = useState<{ id: number; nombre: string } | null>(null);
  const [sensorSeleccionado, setSensorSeleccionado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setLoading(true);
      let endpoint = '';
      if (title === 'Sensores') endpoint = 'sensores';
      else if (title === 'Actuadores') endpoint = 'actuadores';
      else if (title === 'Proyectos') endpoint = 'proyectos';
      else return;

      const res = await fetch(`/api/${endpoint}/${id}`, { 
        method: 'DELETE' 
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      await fetchData();
    } catch (error) {
      console.error('Error en la eliminación:', error);
      setError(`Error al eliminar el elemento: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNombreClick = async (id: number) => {
    if (title !== 'Sensores') return;

    try {
      setLoading(true);
      const res = await fetch(`/api/sensores/${id}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // Adaptación para Supabase (la estructura puede variar)
      const sensorData = {
        ...data,
        proyectos: data.proyectos || [],
        id: data.id || data.sensor_id // Asegurar compatibilidad
      };

      setSensorSeleccionado(sensorData);
    } catch (error) {
      console.error('Error al obtener detalle del sensor:', error);
      setError(`Error al cargar detalles: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let endpoint = '';
      if (title === 'Sensores') endpoint = 'sensores';
      else if (title === 'Actuadores') endpoint = 'actuadores';
      else if (title === 'Proyectos') endpoint = 'proyectos';
      else return;

      const res = await fetch(`/api/${endpoint}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // Normalización de datos para Supabase
      const normalizados = data.map((item: any) => ({
        id: item.id || item.sensor_id || item.actuator_id || item.project_id,
        nombre: item.nombre || item.name || 'Sin nombre'
      }));

      setElementos(normalizados);
    } catch (error) {
      console.error('Error al obtener elementos:', error);
      setError(`Error al cargar datos: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
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

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p>Cargando...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="space-y-4">
            {elementos.map((el) => (
              <div
                key={el.id}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                <button
                  className="text-left text-gray-800 font-medium hover:text-blue-600 transition-colors flex-1"
                  onClick={() => handleNombreClick(el.id)}
                >
                  {el.nombre}
                </button>
                <div className="flex space-x-2">
                  <button
                    className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                    onClick={() => handleEditClick(el)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
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
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
              disabled={loading}
            >
              {loading ? 'Cargando...' : '+'}
            </button>
          </div>
        </>
      )}

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
        ))}
      
      {sensorSeleccionado && title === 'Sensores' && (
        <SensorDetailsModal
          sensor={sensorSeleccionado}
          onClose={() => setSensorSeleccionado(null)}
        />
      )}
    </div>
  );
};

export default ElementList;