import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener un proyecto por ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

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

// Actualizar un proyecto por ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();

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

// Eliminar un proyecto por ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.proyecto.delete({
      where: { project_id: Number(id) },
    });

    return NextResponse.json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    return NextResponse.json({ error: 'Error al eliminar proyecto' }, { status: 500 });
  }
}
