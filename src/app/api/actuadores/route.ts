import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const actuadores = await prisma.actuador.findMany();
    return NextResponse.json(actuadores);
  } catch (error) {
    console.error('Error al obtener actuadores:', error);
    return NextResponse.json({ error: 'Error al obtener actuadores' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { nombre, descripcion, unidad_de_medida, valor_min, valor_max } = body;

    // Validación mínima
    if (!nombre || !descripcion || !unidad_de_medida || valor_min === undefined || valor_max === undefined) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const nuevoActuador = await prisma.actuador.create({
      data: {
        nombre,
        descripcion,
        unidad_de_medida,
        valor_min: parseFloat(valor_min),
        valor_max: parseFloat(valor_max),
      },
    });

    return NextResponse.json(nuevoActuador, { status: 201 });
  } catch (error) {
    console.error('Error al crear actuador:', error);
    return NextResponse.json({ error: 'Error al crear actuador' }, { status: 500 });
  }
}
