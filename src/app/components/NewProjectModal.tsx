'use client';

import React, { useEffect, useState } from 'react';

interface Elemento {
  id: string;
  nombre: string;
}

interface ProyectoAEditar {
  id: number;
  nombre: string;
}

const ProjectModal = ({
  onClose,
  onSave,
  proyectoAEditar,
}: {
  onClose: () => void;
  onSave?: () => void;
  proyectoAEditar?: ProyectoAEditar;
}) => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    sensoresSeleccionados: [] as string[],
    actuadoresSeleccionados: [] as string[],
  });

  const [sensores, setSensores] = useState<Elemento[]>([]);
  const [actuadores, setActuadores] = useState<Elemento[]>([]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const resSensores = await fetch('/api/sensores');
        const sensoresData = await resSensores.json();
        setSensores(sensoresData.map((s: any) => ({ id: s.sensor_id.toString(), nombre: s.nombre })));

        const resActuadores = await fetch('/api/actuadores');
        const actuadoresData = await resActuadores.json();
        setActuadores(actuadoresData.map((a: any) => ({ id: a.actuator_id.toString(), nombre: a.nombre })));
      } catch (err) {
        console.error('Error al obtener sensores o actuadores:', err);
      }
    };

    fetchDatos();
  }, []);

  // Cargar datos del proyecto a editar
  useEffect(() => {
    if (proyectoAEditar) {
      const fetchProyecto = async () => {
        try {
          const res = await fetch(`/api/proyectos/${proyectoAEditar.id}`);
          const data = await res.json();

          setForm({
            nombre: data.nombre,
            descripcion: data.descripcion,
            sensoresSeleccionados: data.sensores.map((s: any) => s.sensor_id.toString()),
            actuadoresSeleccionados: data.actuadores.map((a: any) => a.actuator_id.toString()),
          });
        } catch (err) {
          console.error('Error al cargar proyecto:', err);
        }
      };

      fetchProyecto();
    }
  }, [proyectoAEditar]);

  const toggleSeleccion = (id: string, tipo: 'sensor' | 'actuador') => {
    setForm(prev => {
      const lista = tipo === 'sensor' ? prev.sensoresSeleccionados : prev.actuadoresSeleccionados;
      const nuevaLista = lista.includes(id)
        ? lista.filter(item => item !== id)
        : [...lista, id];
      return {
        ...prev,
        [tipo === 'sensor' ? 'sensoresSeleccionados' : 'actuadoresSeleccionados']: nuevaLista,
      };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = `/api/proyectos${proyectoAEditar ? `/${proyectoAEditar.id}` : ''}`;
      const method = proyectoAEditar ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          descripcion: form.descripcion,
          sensoresSeleccionados: form.sensoresSeleccionados.map(Number),
          actuadoresSeleccionados: form.actuadoresSeleccionados.map(Number),
        }),
      });

      if (!res.ok) {
        throw new Error('Error al guardar el proyecto');
      }

      const data = await res.json();
      console.log(`Proyecto ${proyectoAEditar ? 'editado' : 'creado'} con éxito:`, data);

      onSave?.(); // trigger para que recargue la lista
      onClose();
    } catch (err) {
      console.error('Error al enviar proyecto:', err);
      alert('Ocurrió un error al guardar el proyecto.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {proyectoAEditar ? 'Editar Proyecto' : 'Agregar Proyecto'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className="w-full border border-black rounded px-3 py-2 placeholder-gray-700 text-black"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            className="w-full border border-black rounded px-3 py-2 placeholder-gray-700 text-black"
            value={form.descripcion}
            onChange={handleChange}
            required
          />

          {/* Lista de sensores */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Seleccionar Sensores</h4>
            <div className="space-y-1">
              {sensores.map(sensor => (
                <label key={sensor.id} className="flex items-center space-x-2 text-sm text-gray-800">
                  <input
                    type="checkbox"
                    checked={form.sensoresSeleccionados.includes(sensor.id)}
                    onChange={() => toggleSeleccion(sensor.id, 'sensor')}
                  />
                  <span>{sensor.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Lista de actuadores */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Seleccionar Actuadores</h4>
            <div className="space-y-1">
              {actuadores.map(act => (
                <label key={act.id} className="flex items-center space-x-2 text-sm text-gray-800">
                  <input
                    type="checkbox"
                    checked={form.actuadoresSeleccionados.includes(act.id)}
                    onChange={() => toggleSeleccion(act.id, 'actuador')}
                  />
                  <span>{act.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-400 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
