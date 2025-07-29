'use client';

import React from 'react';
import MqttSendValue from './MqttSendValue';

interface ActuatorDetailsModalProps {
  actuador: {
    actuator_id: number;
    nombre: string;
    descripcion: string;
    unidad_de_medida: string;
    valor_min: number;
    valor_max: number;
    fuente_datos: string;
    proyectos?: { nombre: string }[];
  };
  onClose: () => void;
}

const ActuatorDetailsModal: React.FC<ActuatorDetailsModalProps> = ({ actuador, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative text-black">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-purple-600">Detalle del Actuador</h2>

        <p><strong>Nombre:</strong> {actuador.nombre}</p>
        <p><strong>Descripción:</strong> {actuador.descripcion}</p>
        <p><strong>Rango estable:</strong> {actuador.valor_min} {actuador.unidad_de_medida} - {actuador.valor_max} {actuador.unidad_de_medida}</p>

        <p>
          <strong>Proyectos:</strong>{' '}
          {actuador.proyectos?.length
            ? actuador.proyectos.map((p) => p.nombre).join(', ')
            : 'Ninguno'}
        </p>

        <div className="mt-4">
          <label className="block font-semibold text-gray-700 mb-1">
            Nuevo Valor para enviar:
          </label>
          <MqttSendValue topic={actuador.fuente_datos} />
        </div>
      </div>
    </div>
  );
};

export default ActuatorDetailsModal;
