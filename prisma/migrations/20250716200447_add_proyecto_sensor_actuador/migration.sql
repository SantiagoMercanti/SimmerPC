-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'operator',

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "sensor_id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "unidad_de_medida" TEXT NOT NULL,
    "valor_max" DOUBLE PRECISION NOT NULL,
    "valor_min" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("sensor_id")
);

-- CreateTable
CREATE TABLE "Actuador" (
    "actuator_id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "unidad_de_medida" TEXT NOT NULL,
    "valor_max" DOUBLE PRECISION NOT NULL,
    "valor_min" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Actuador_pkey" PRIMARY KEY ("actuator_id")
);

-- CreateTable
CREATE TABLE "Proyecto" (
    "project_id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Proyecto_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "ProyectoSensor" (
    "proyectoId" INTEGER NOT NULL,
    "sensorId" INTEGER NOT NULL,

    CONSTRAINT "ProyectoSensor_pkey" PRIMARY KEY ("proyectoId","sensorId")
);

-- CreateTable
CREATE TABLE "ProyectoActuador" (
    "proyectoId" INTEGER NOT NULL,
    "actuadorId" INTEGER NOT NULL,

    CONSTRAINT "ProyectoActuador_pkey" PRIMARY KEY ("proyectoId","actuadorId")
);

-- AddForeignKey
ALTER TABLE "ProyectoSensor" ADD CONSTRAINT "ProyectoSensor_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProyectoSensor" ADD CONSTRAINT "ProyectoSensor_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("sensor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProyectoActuador" ADD CONSTRAINT "ProyectoActuador_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProyectoActuador" ADD CONSTRAINT "ProyectoActuador_actuadorId_fkey" FOREIGN KEY ("actuadorId") REFERENCES "Actuador"("actuator_id") ON DELETE RESTRICT ON UPDATE CASCADE;
