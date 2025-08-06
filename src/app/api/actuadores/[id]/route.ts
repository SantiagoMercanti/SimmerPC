import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

// GET /api/actuadores/[id]
export async function GET(_: NextRequest, { params }: Params) {
  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const actuador = await prisma.actuador.findUnique({
      where: { actuator_id: id },
    })

    if (!actuador) {
      return NextResponse.json({ error: 'Actuador no encontrado' }, { status: 404 })
    }

    return NextResponse.json(actuador)
  } catch (error) {
    console.error('Error al obtener actuador:', error)
    return NextResponse.json({ error: 'Error al obtener actuador' }, { status: 500 })
  }
}

// PUT /api/actuadores/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const { nombre, descripcion, unidad_de_medida, valor_min, valor_max, fuente_datos } = body

    if (!nombre || !descripcion || !unidad_de_medida || valor_min === undefined || valor_max === undefined) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const actuadorActualizado = await prisma.actuador.update({
      where: { actuator_id: id },
      data: {
        nombre,
        descripcion,
        unidad_de_medida,
        valor_min: parseFloat(valor_min),
        valor_max: parseFloat(valor_max),
        fuente_datos: fuente_datos || '',
      },
    })

    return NextResponse.json(actuadorActualizado)
  } catch (error) {
    console.error('Error al actualizar actuador:', error)
    return NextResponse.json({ error: 'Error al actualizar actuador' }, { status: 500 })
  }
}

// DELETE /api/actuadores/[id]
export async function DELETE(_: NextRequest, { params }: Params) {
  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    // Eliminar relaciones en ProyectoActuador
    await prisma.proyectoActuador.deleteMany({
      where: { actuadorId: id },
    })

    // Eliminar actuador
    await prisma.actuador.delete({
      where: { actuator_id: id },
    })

    return NextResponse.json({ message: 'Actuador eliminado correctamente' })
  } catch (error: any) {
    console.error('Error al eliminar actuador:', error)
    return NextResponse.json(
      { error: 'Error al eliminar actuador', detalle: error.message },
      { status: 500 }
    )
  }
}
