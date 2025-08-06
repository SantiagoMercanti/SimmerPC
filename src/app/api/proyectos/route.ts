import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/proyectos
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, descripcion, sensoresSeleccionados, actuadoresSeleccionados } = body

    // Validación básica
    if (
      !nombre ||
      !descripcion ||
      !Array.isArray(sensoresSeleccionados) ||
      !Array.isArray(actuadoresSeleccionados)
    ) {
      return NextResponse.json({ error: 'Datos incompletos o inválidos' }, { status: 400 })
    }

    const nuevoProyecto = await prisma.proyecto.create({
      data: {
        nombre,
        descripcion,
        sensores: {
          create: sensoresSeleccionados.map((sensorId: string) => {
            const id = Number(sensorId)
            if (isNaN(id)) throw new Error(`ID de sensor inválido: ${sensorId}`)
            return { sensor: { connect: { sensor_id: id } } }
          }),
        },
        actuadores: {
          create: actuadoresSeleccionados.map((actuadorId: string) => {
            const id = Number(actuadorId)
            if (isNaN(id)) throw new Error(`ID de actuador inválido: ${actuadorId}`)
            return { actuador: { connect: { actuator_id: id } } }
          }),
        },
      },
    })

    return NextResponse.json(nuevoProyecto, { status: 201 })
  } catch (error: any) {
    console.error('Error al crear proyecto:', error)
    return NextResponse.json(
      { error: 'Error al crear proyecto', detalle: error.message },
      { status: 500 }
    )
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
    })

    return NextResponse.json(proyectos)
  } catch (error: any) {
    console.error('Error al obtener proyectos:', error)
    return NextResponse.json(
      { error: 'Error al obtener proyectos', detalle: error.message },
      { status: 500 }
    )
  }
}
