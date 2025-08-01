'use client';

import { useEffect, useState } from 'react';

interface MqttShowValueProps {
  topic: string; // ejemplo: "valor-temp1"
}

export default function MqttShowValue({ topic }: MqttShowValueProps) {
  const [valor, setValor] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!topic) return;

    fetch(`http://192.168.10.101:1880/${topic}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error en la respuesta del servidor');
        return res.json();
      })
      .then((data) => {
        if (data.valor !== undefined) {
          setValor(data.valor.toString());
          setError(false);
        } else {
          throw new Error('No se encontró el valor en la respuesta');
        }
      })
      .catch((err) => {
        console.error('Error al obtener el valor:', err, topic);
        setError(true);
      });
  }, [topic]);

  return (
    <span className={`font-semibold ${error ? 'text-red-600' : 'text-green-600'}`}>
      {error ? 'Error al obtener valor' : valor ?? 'Esperando...'}
    </span>
  );
}
