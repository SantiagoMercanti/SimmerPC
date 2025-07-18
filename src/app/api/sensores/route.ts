import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Obtener todos los sensores
export async function GET() {
  try {
    const sensores = await prisma.sensor.findMany();
    return NextResponse.json(sensores);
  } catch (error) {
    console.error('Error al obtener sensores:', error);
    return NextResponse.json({ error: 'Error al obtener sensores' }, { status: 500 });
  }
}

// Crear un nuevo sensor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, descripcion, unidad_de_medida, valor_min, valor_max, fuente_datos } = body;

    if (!nombre || !descripcion || !unidad_de_medida || valor_min === undefined || valor_max === undefined) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const nuevoSensor = await prisma.sensor.create({
      data: {
        nombre,
        descripcion,
        unidad_de_medida,
        valor_min: parseFloat(valor_min),
        valor_max: parseFloat(valor_max),
        fuente_datos: fuente_datos || '',
      },
    });

    return NextResponse.json(nuevoSensor, { status: 201 });
  } catch (error) {
    console.error('Error al crear sensor:', error);
    return NextResponse.json({ error: 'Error al crear sensor' }, { status: 500 });
  }
}
