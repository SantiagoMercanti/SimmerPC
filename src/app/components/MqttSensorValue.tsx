'use client';

import { useEffect, useState } from 'react';
import mqtt from 'mqtt';

interface MqttSensorValueProps {
  topic: string; // fuente_datos
}

export default function MqttSensorValue({ topic }: MqttSensorValueProps) {
  const [valor, setValor] = useState<string | null>(null);

  useEffect(() => {
    if (!topic) return;

    const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt');

    client.on('connect', () => {
      console.log('Conectado a EMQX MQTT, suscribiendo a:', topic);
      client.subscribe(topic);
    });

    client.on('message', (receivedTopic, message) => {
      if (receivedTopic === topic) {
        setValor(message.toString());
      }
    });

    return () => {
      client.end();
    };
  }, [topic]);

  return (
    <span className="text-green-600 font-semibold">
      {valor ?? 'Esperando...'}
    </span>
  );
}
