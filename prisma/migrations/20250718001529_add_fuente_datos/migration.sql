-- AlterTable
ALTER TABLE "Actuador" ADD COLUMN     "fuente_datos" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Sensor" ADD COLUMN     "fuente_datos" TEXT NOT NULL DEFAULT '';
