import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
  
        const exameExistente = await prisma.exame.findUnique({
          where: { idempotency_key: data.idempotency_key },
        });

        throw new IdempotencyError('Chave de idempotência duplicada', exameExistente);
      }

      throw error;
    }
  }

  async findMany() {
    // definir
  }
}