import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Obtener proyecto por ID
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const id = Number(context.params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const proyecto = await prisma.proyecto.findUnique({
      where: { project_id: id },
      include: {
        sensores: {
          include: { sensor: true },
        },
        actuadores: {
          include: { actuador: true },
        },
      },
    })

    if (!proyecto) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    return NextResponse.json(proyecto)
  } catch (error: any) {
    console.error('Error al obtener proyecto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', detalle: error.message },
      { status: 500 }
    )
  }
}

// PUT: Actualizar proyecto
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const id = Number(context.params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const { nombre, descripcion } = body

    if (!nombre || !descripcion) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const proyectoExistente = await prisma.proyecto.findUnique({
      where: { project_id: id },
    })

    if (!proyectoExistente) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    const proyectoActualizado = await prisma.proyecto.update({
      where: { project_id: id },
      data: { nombre, descripcion },
    })

    return NextResponse.json(proyectoActualizado)
  } catch (error: any) {
    console.error('Error al actualizar proyecto:', error)
    return NextResponse.json(
      { error: 'Error al actualizar proyecto', detalle: error.message },
      { status: 500 }
    )
  }
}

// DELETE: Eliminar proyecto
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const id = Number(context.params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const proyectoExistente = await prisma.proyecto.findUnique({
      where: { project_id: id },
    })

    if (!proyectoExistente) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    await prisma.proyectoSensor.deleteMany({ where: { proyectoId: id } })
    await prisma.proyectoActuador.deleteMany({ where: { proyectoId: id } })
    await prisma.proyecto.delete({ where: { project_id: id } })

    return NextResponse.json({ message: 'Proyecto eliminado correctamente' })
  } catch (error: any) {
    console.error('Error al eliminar proyecto:', error)
    return NextResponse.json(
      { error: 'Error al eliminar proyecto', detalle: error.message },
      { status: 500 }
    )
  }
}
