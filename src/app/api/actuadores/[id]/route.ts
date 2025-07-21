import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Obtener un actuador por ID
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const actuador = await prisma.actuador.findUnique({
      where: { actuator_id: Number(id) },
    });

    if (!actuador) {
      return NextResponse.json({ error: 'Actuador no encontrado' }, { status: 404 });
    }

    return NextResponse.json(actuador);
  } catch (error) {
    console.error('Error al obtener actuador:', error);
    return NextResponse.json({ error: 'Error al obtener actuador' }, { status: 500 });
  }
}

// Actualizar un actuador por ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();

  try {
    const actuadorActualizado = await prisma.actuador.update({
      where: { actuator_id: Number(id) },
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion,
        unidad_de_medida: body.unidad_de_medida,
        valor_min: parseFloat(body.valor_min),
        valor_max: parseFloat(body.valor_max),
        fuente_datos: body.fuente_datos || '',
      },
    });

    return NextResponse.json(actuadorActualizado);
  } catch (error) {
    console.error('Error al actualizar actuador:', error);
    return NextResponse.json({ error: 'Error al actualizar actuador' }, { status: 500 });
  }
}

// Eliminar un actuador por ID
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const actuadorId = Number(id);

  try {
    // 1. Eliminar relaciones en ProyectoActuador
    await prisma.proyectoActuador.deleteMany({
      where: { actuadorId: actuadorId },
    });

    // 2. Eliminar el actuador
    await prisma.actuador.delete({
      where: { actuator_id: actuadorId },
    });

    return NextResponse.json({ message: 'Actuador eliminado correctamente' });
  } catch (error: any) {
    console.error('Error al eliminar actuador:', error);
    return NextResponse.json({ error: 'Error al eliminar actuador', detalle: error.message }, { status: 500 });
  }
}
