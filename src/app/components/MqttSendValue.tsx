'use client';

import { useState } from 'react';

interface MqttSendValueProps {
  topic: string; // ejemplo: "simmer/actuador/temp1"
}

export default function MqttSendValue({ topic }: MqttSendValueProps) {
  const [valor, setValor] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSend = async () => {
    if (!topic || valor.trim() === '') return;

    setStatus('sending');

    try {
      const response = await fetch(`http://192.168.10.101:1880/${topic}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ valor }), // Se espera que el Function node en Node-RED use msg.payload.valor
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      setStatus('success');
    } catch (error) {
      console.error('Error al enviar valor por HTTP:', error);
      setStatus('error');
    }
  };

  return (
    <div className="mt-4">
      <input
        type="text"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Nuevo valor"
        className="border border-gray-300 rounded px-2 py-1 mr-2"
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Enviar
      </button>
      {status === 'success' && <span className="text-green-600 ml-2">✓ Enviado</span>}
      {status === 'error' && <span className="text-red-600 ml-2">✗ Error</span>}
    </div>
  );
}
