import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener proyecto por ID
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const proyecto = await prisma.proyecto.findUnique({
      where: { project_id: Number(id) },
    });

    if (!proyecto) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    return NextResponse.json(proyecto);
  } catch (error) {
    console.error('Error al obtener proyecto:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT: Actualizar proyecto
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const body = await req.json();

  if (!body.nombre || !body.descripcion) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
  }

  try {
    const proyectoActualizado = await prisma.proyecto.update({
      where: { project_id: Number(id) },
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion,
      },
    });

    return NextResponse.json(proyectoActualizado);
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    return NextResponse.json({ error: 'Error al actualizar proyecto' }, { status: 500 });
  }
}

// DELETE: Eliminar proyecto
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const proyectoId = Number(id);

  try {
    // 1. Eliminar relaciones en ProyectoSensor
    await prisma.proyectoSensor.deleteMany({
      where: { proyectoId },
    });

    // 2. Eliminar relaciones en ProyectoActuador
    await prisma.proyectoActuador.deleteMany({
      where: { proyectoId },
    });

    // 3. Eliminar el Proyecto
    await prisma.proyecto.delete({
      where: { project_id: proyectoId },
    });

    return NextResponse.json({ message: 'Proyecto eliminado correctamente' });
  } catch (error: any) {
    console.error('Error al eliminar proyecto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar proyecto', detalle: error.message },
      { status: 500 }
    );
  }
}
