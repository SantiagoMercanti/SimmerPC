'use client';

import { useEffect, useState } from 'react';
import mqtt from 'mqtt';

interface MqttShowValueProps {
  topic: string; // fuente_datos
}

export default function MqttShowValue({ topic }: MqttShowValueProps) {
  const [valor, setValor] = useState<string | null>(null);

  useEffect(() => {
    const client = mqtt.connect('wss://2186d1da6b28407e82998361029157f6.s1.eu.hivemq.cloud:8884/mqtt', {
      username: 'simmerhivemq',
      password: 'Newport123',
      clientId: 'web_' + Math.random().toString(16).slice(2, 8),
      connectTimeout: 4000,
      clean: true,
    });

    client.on('connect', () => {
      console.log('✅ Conectado a HiveMQ');
      client.subscribe(topic);
    });

    client.on('message', (t, message) => {
      if (t === topic) {
        setValor(message.toString());
      }
    });

    client.on('error', (err) => {
      console.error('❌ Error MQTT:', err);
    });

    return () => {
      client.end();
    };
  }, [topic]);

  return <span>{valor ?? 'Esperando...'}</span>;
}
