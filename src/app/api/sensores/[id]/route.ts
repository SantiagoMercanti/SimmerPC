import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET: Obtener sensor por ID
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const sensor = await prisma.sensor.findUnique({
      where: { sensor_id: id },
      include: {
        proyectos: {
          include: {
            proyecto: true,
          },
        },
      },
    })

    if (!sensor) {
      return NextResponse.json({ error: 'Sensor no encontrado' }, { status: 404 })
    }

    return NextResponse.json(sensor)
  } catch (error) {
    console.error('Error al obtener sensor:', error)
    return NextResponse.json({ error: 'Error al obtener sensor' }, { status: 500 })
  }
}

// PUT: Actualizar sensor por ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const {
      nombre,
      descripcion,
      unidad_de_medida,
      valor_min,
      valor_max,
      fuente_datos,
    } = body

    const sensorActualizado = await prisma.sensor.update({
      where: { sensor_id: id },
      data: {
        nombre,
        descripcion,
        unidad_de_medida,
        valor_min: parseFloat(valor_min),
        valor_max: parseFloat(valor_max),
        fuente_datos: fuente_datos || '',
      },
    })

    return NextResponse.json(sensorActualizado)
  } catch (error) {
    console.error('Error al actualizar sensor:', error)
    return NextResponse.json({ error: 'Error al actualizar sensor' }, { status: 500 })
  }
}

// DELETE: Eliminar sensor por ID
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    // 1. Eliminar relaciones
    await prisma.proyectoSensor.deleteMany({
      where: { sensorId: id },
    })

    // 2. Eliminar el sensor
    await prisma.sensor.delete({
      where: { sensor_id: id },
    })

    return NextResponse.json({ message: 'Sensor eliminado correctamente' })
  } catch (error: any) {
    console.error('Error al eliminar sensor:', error)
    return NextResponse.json(
      { error: 'Error al eliminar sensor', detalle: error.message },
      { status: 500 }
    )
  }
}
