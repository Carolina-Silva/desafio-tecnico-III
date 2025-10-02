// src/modules/pacientes/paciente.service.ts
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class PacienteService {
  async create(data: Prisma.PacienteCreateInput) {
    const paciente = await prisma.paciente.create({ data });
    return paciente;
  }

  async findMany(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [pacientes, total] = await prisma.$transaction([
      prisma.paciente.findMany({ skip, take }),
      prisma.paciente.count(),
    ]);

    return { data: pacientes, total };
  }

  async findOne(id: string) {
    const paciente = await prisma.paciente.findUnique({ where: { id } });
    return paciente;
  }

  async update(id: string, data: Prisma.PacienteUpdateInput) {
    const paciente = await prisma.paciente.update({
      where: { id },
      data,
    });
    return paciente;
  }

  async delete(id: string) {
    await prisma.paciente.delete({ where: { id } });
  }
}