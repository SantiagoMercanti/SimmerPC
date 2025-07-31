'use client';

import { useState } from 'react';
import mqtt from 'mqtt';

interface MqttSendValueProps {
  topic: string; // fuente_datos
}

export default function MqttSendValue({ topic }: MqttSendValueProps) {
  const [valor, setValor] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSend = () => {
    if (!topic || valor.trim() === '') return;

    const client = mqtt.connect('wss://2186d1da6b28407e82998361029157f6.s1.eu.hivemq.cloud:8884/mqtt', {
      username: 'simmerhivemq',
      password: 'Newport123',
      clientId: 'web_' + Math.random().toString(16).slice(2, 8),
      connectTimeout: 4000,
      clean: true,
    });
    setStatus('sending');

    client.on('connect', () => {
      console.log('Conectado a HiveMQ MQTT. Publicando:', valor, 'en', topic);
      client.publish(topic, valor, {}, (err) => {
        if (err) {
          console.error('Error al publicar:', err);
          setStatus('error');
        } else {
          setStatus('success');
        }
        client.end();
      });
    });

    client.on('error', (err) => {
      console.error('Error de conexión MQTT:', err);
      setStatus('error');
      client.end();
    });
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
