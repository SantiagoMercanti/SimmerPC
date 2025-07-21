import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Obtener sensor por ID
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const sensor = await prisma.sensor.findUnique({
      where: { sensor_id: Number(id) },
      include: {
        proyectos: {
          include: {
            proyecto: true,
          },
        },
      },
    });

    if (!sensor) {
      return NextResponse.json({ error: 'Sensor no encontrado' }, { status: 404 });
    }

    return NextResponse.json(sensor);
  } catch (error) {
    console.error('Error al obtener sensor:', error);
    return NextResponse.json({ error: 'Error al obtener sensor' }, { status: 500 });
  }
}

// Actualizar sensor por ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();

  try {
    const sensorActualizado = await prisma.sensor.update({
      where: { sensor_id: Number(id) },
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion,
        unidad_de_medida: body.unidad_de_medida,
        valor_min: parseFloat(body.valor_min),
        valor_max: parseFloat(body.valor_max),
        fuente_datos: body.fuente_datos || '',
      },
    });

    return NextResponse.json(sensorActualizado);
  } catch (error) {
    console.error('Error al actualizar sensor:', error);
    return NextResponse.json({ error: 'Error al actualizar sensor' }, { status: 500 });
  }
}

// Eliminar sensor por ID
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const sensorId = Number(id);

  try {
    // 1. Eliminar relaciones en ProyectoSensor
    await prisma.proyectoSensor.deleteMany({
      where: { sensorId: sensorId },
    });

    // 2. Eliminar el sensor
    await prisma.sensor.delete({
      where: { sensor_id: sensorId },
    });

    return NextResponse.json({ message: 'Sensor eliminado correctamente' });
  } catch (error: any) {
    console.error('Error al eliminar sensor:', error);
    return NextResponse.json({ error: 'Error al eliminar sensor', detalle: error.message }, { status: 500 });
  }
}
