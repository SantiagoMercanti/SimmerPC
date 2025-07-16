'use client'

import React, { useState } from 'react';

const SensorActuatorModal = ({
  title,
  onClose,
  onSave,
}: {
  title?: string;
  onClose: () => void;
  onSave: () => void; // o async () => Promise<void> para usar `await`
}) => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    valorMax: '',
    valorMin: '',
    unidad: '',
    fuente: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const payload = {
    nombre: form.nombre,
    descripcion: form.descripcion,
    valor_max: parseFloat(form.valorMax),
    valor_min: parseFloat(form.valorMin),
    unidad_de_medida: form.unidad,
    fuente_datos: form.fuente,
  };

  const endpoint = title === 'Sensores' ? '/api/sensores' : '/api/actuadores';

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      await onSave(); 
      onClose();
    } else {
      console.error('Error al guardar el elemento');
    }
  } catch (err) {
    console.error('Error al enviar el formulario:', err);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Agregar {title?.slice(0, -2)}</h3>
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
          <input
            type="number"
            name="valorMax"
            placeholder="Valor Máximo"
            className="w-full border border-black rounded px-3 py-2 placeholder-gray-700 text-black"
            value={form.valorMax}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="valorMin"
            placeholder="Valor Mínimo"
            className="w-full border border-black rounded px-3 py-2 placeholder-gray-700 text-black"
            value={form.valorMin}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="unidad"
            placeholder="Unidad de Medida"
            className="w-full border border-black rounded px-3 py-2 placeholder-gray-700 text-black"
            value={form.unidad}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="fuente"
            placeholder="Fuente de datos (API)"
            className="w-full border border-black rounded px-3 py-2 placeholder-gray-700 text-black"
            value={form.fuente}
            onChange={handleChange}
            required
          />
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

export default SensorActuatorModal;
