'use client';

import { useEffect, useState } from 'react';
import mqtt from 'mqtt';

interface MqttShowValueProps {
  topic: string;
}

export default function MqttShowValue({ topic }: MqttShowValueProps) {
  const [valor, setValor] = useState<string | null>(null);

  useEffect(() => {
    const client = mqtt.connect('ws://192.168.10.101:1884', {
      clientId: 'web_' + Math.random().toString(16).slice(2, 8),
      connectTimeout: 4000,
      reconnectPeriod: 1000,
      clean: true,
    });

    client.on('connect', () => {
      console.log('✅ Conectado a Mosquitto por WebSocket');
      client.subscribe(topic, (err) => {
        if (err) {
          console.error('❌ Error al suscribirse:', err);
        } else {
          console.log('📩 Suscrito al tópico:', topic);
        }
      });
    });

    client.on('message', (t, message) => {
      if (t === topic) {
        setValor(message.toString());
        console.log('📥 Mensaje recibido en', topic, ':', message.toString());
      }
    });

    client.on('error', (err) => {
      console.error('❌ Error MQTT:', err);
    });

    return () => {
      if (client.connected) client.end();
    };
  }, [topic]);

  return <span>{valor ?? ' '}</span>;
}
