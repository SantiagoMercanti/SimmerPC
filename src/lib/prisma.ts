import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Reutiliza una única instancia de PrismaClient (solo en desarrollo)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // útil para debugging
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
