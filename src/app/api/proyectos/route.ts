import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// POST /api/proyectos
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nombre,
      descripcion,
      sensoresSeleccionados,
      actuadoresSeleccionados,
    } = body;

    const nuevoProyecto = await prisma.proyecto.create({
      data: {
        nombre,
        descripcion,
        sensores: {
          create: sensoresSeleccionados.map((sensorId: string) => ({
            sensor: { connect: { sensor_id: parseInt(sensorId) } },
          })),
        },
        actuadores: {
          create: actuadoresSeleccionados.map((actuadorId: string) => ({
            actuador: { connect: { actuator_id: parseInt(actuadorId) } },
          })),
        },
      },
    });

    return NextResponse.json(nuevoProyecto, { status: 201 });
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    return NextResponse.json({ error: 'Error al crear proyecto' }, { status: 500 });
  }
}

// GET /api/proyectos
export async function GET() {
  try {
    const proyectos = await prisma.proyecto.findMany({
      include: {
        sensores: {
          include: {
            sensor: true,
          },
        },
        actuadores: {
          include: {
            actuador: true,
          },
        },
      },
    });

    return NextResponse.json(proyectos);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    return NextResponse.json({ error: 'Error al obtener proyectos' }, { status: 500 });
  }
}
