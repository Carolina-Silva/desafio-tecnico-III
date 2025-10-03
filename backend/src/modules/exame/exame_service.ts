import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';


export class IdempotencyError extends Error {
  public data: any;
  constructor(message: string, data: any) {
    super(message);
    this.name = 'IdempotencyError';
    this.data = data;
  }
}

export class ExameService {
  async create(data: Prisma.ExameUncheckedCreateInput) {
    const paciente = await prisma.paciente.findUnique({
      where: { id: data.paciente_id },
    });

    if (!paciente) {
      throw new Error('PACIENTE_NAO_ENCONTRADO');
    }

    try {
      const exame = await prisma.exame.create({ data });
      return exame;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const exameExistente = await prisma.exame.findUnique({
          where: { idempotency_key: data.idempotency_key },
        });
        if (exameExistente) {
          throw new IdempotencyError('Chave de idempotência duplicada', exameExistente);
        }
      }
      throw error;
    }
  }

  async findMany(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [exames, total] = await prisma.$transaction([
      prisma.exame.findMany({ 
        skip, 
        take,
        orderBy: { data_exame: 'desc' },
        include: {
          paciente: {
            select: {
              nome: true,
            },
          },
        },
      }),
      prisma.exame.count(),
    ]);

    return { data: exames, total };
  }

  async delete(id: string) {
    await prisma.exame.delete({
      where: { id },
    });
  }
}