'use client';

import React, { useEffect, useState } from 'react';
import SensorActuatorModal from './NewElementModal';
import ProjectModal from './NewProjectModal';
import SensorDetailsModal from './SensorDetailsModal';
import ActuatorDetailsModal from './ActuatorDetailsModal';
import { supabase } from '@/lib/supabase';

const ElementList = ({ title, canEdit = false }: { title?: string; canEdit?: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [elementos, setElementos] = useState<{ id: number; nombre: string }[]>([]);
  const [elementoAEditar, setElementoAEditar] = useState<{ id: number; nombre: string } | null>(null);
  const [sensorSeleccionado, setSensorSeleccionado] = useState<any>(null);
  const [actuadorSeleccionado, setActuadorSeleccionado] = useState<any>(null);

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
      let table = '';
      let key = '';
      if (title === 'Sensores') {
        table = 'Sensor';
        key = 'sensor_id';
      } else if (title === 'Actuadores') {
        table = 'Actuador';
        key = 'actuator_id';
      } else if (title === 'Proyectos') {
        table = 'Proyecto';
        key = 'project_id';
      } else return;

      const { error } = await supabase.from(table).delete().eq(key, id);
      if (error) throw error;

      fetchData();
    } catch (error) {
      console.error('Error en la eliminación con Supabase:', error);
    }
  };

  const handleNombreClick = async (id: number) => {
    try {
      if (title === 'Sensores') {
        const { data, error } = await supabase
          .from('Sensor')
          .select('*, proyectos:ProyectoSensor(proyecto:Proyecto(*))')
          .eq('sensor_id', id)
          .single();

        if (error) throw error;

        data.proyectos = data.proyectos?.map((ps: any) => ps.proyecto) ?? [];
        setSensorSeleccionado(data);
      } else if (title === 'Actuadores') {
        const { data, error } = await supabase
          .from('Actuador')
          .select('*, proyectos:ProyectoActuador(proyecto:Proyecto(*))')
          .eq('actuator_id', id)
          .single();

        if (error) throw error;

        data.proyectos = data.proyectos?.map((pa: any) => pa.proyecto) ?? [];
        setActuadorSeleccionado(data);
      }
    } catch (error) {
      console.error('Error al obtener detalle desde Supabase:', error);
    }
  };

  const fetchData = async () => {
    try {
      let table = '';
      if (title === 'Sensores') table = 'Sensor';
      else if (title === 'Actuadores') table = 'Actuador';
      else if (title === 'Proyectos') table = 'Proyecto';
      else return;

      const { data, error } = await supabase.from(table).select('*');

      if (error) throw error;

      const normalizados = data.map((item: any) => ({
        id: item.sensor_id ?? item.actuator_id ?? item.project_id ?? item.id,
        nombre: item.nombre,
      }));

      setElementos(normalizados);
    } catch (error) {
      console.error('Error al obtener elementos desde Supabase:', error);
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
            <button
              className="text-left text-gray-800 font-bold hover:text-gray-500"
              onClick={() => handleNombreClick(el.id)}
            >
              {el.nombre}
            </button>
            {canEdit && (
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
            )}
          </div>
        ))}
      </div>

      {canEdit && (
        <div className="mt-6 text-center">
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
          >
            +
          </button>
        </div>
      )}

      {/* Modales */}
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
      {actuadorSeleccionado && title === 'Actuadores' && (
        <ActuatorDetailsModal
          actuador={actuadorSeleccionado}
          onClose={() => setActuadorSeleccionado(null)}
        />
      )}

    </div>
  );
};

export default ElementList;
