'use client';

import React from 'react';
import MqttShowValue from './MqttShowValue';

interface SensorDetailsModalProps {
  sensor: {
    sensor_id: number;
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

const SensorDetailsModal: React.FC<SensorDetailsModalProps> = ({ sensor, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative text-black">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-blue-600">Detalle del Sensor</h2>

        <p><strong>Nombre:</strong> {sensor.nombre}</p>
        <p><strong>Descripción:</strong> {sensor.descripcion}</p>
        <p><strong>Rango estable:</strong> {sensor.valor_min} {sensor.unidad_de_medida} - {sensor.valor_max} {sensor.unidad_de_medida}</p>
        <p>
          <strong>Valor Actual:</strong>{' '}
          <MqttShowValue topic={sensor.fuente_datos} />
          <span className="text-green-600 font-semibold"> {sensor.unidad_de_medida}</span>        </p>
        <p>
          <strong>Proyectos:</strong>{' '}
          {sensor.proyectos?.length
            ? sensor.proyectos.map((p) => p.nombre).join(', ')
            : 'Ninguno'}
        </p>
      </div>

    </div>
  );
};

export default SensorDetailsModal;
