import { FastifyRequest, FastifyReply } from 'fastify';
import { ExameService, IdempotencyError } from './exame_service';
import { Prisma } from '@prisma/client';

export class ExameController {
  constructor(private readonly exameService: ExameService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { paciente_id, modalidade, data_exame, idempotency_key } = request.body as any;
    try {
      const dadosFormatados = {
        paciente_id,
        modalidade,
        data_exame: new Date(data_exame),
        idempotency_key
      };
      const novoExame = await this.exameService.create(dadosFormatados);
      return reply.status(201).send(novoExame);
    } catch (error: any) {
      if (error instanceof IdempotencyError) {
        return reply.status(200).send(error.data);
      }
      if (error.message === 'PACIENTE_NAO_ENCONTRADO') {
        return reply.status(400).send({ message: 'Paciente não encontrado.' });
      }
      return reply.status(500).send({ message: 'Erro interno no servidor.' });
    }
  }

  async findMany(request: FastifyRequest<{ Querystring: { page?: string, pageSize?: string } }>, reply: FastifyReply) {
    try {

      const page = parseInt(request.query.page || '1', 10);
      const pageSize = parseInt(request.query.pageSize || '10', 10);

      const result = await this.exameService.findMany(page, pageSize);
      
      return reply.send({
        ...result,
        page,
        totalPages: Math.ceil(result.total / pageSize),
      });
    } catch (error) {
      return reply.status(500).send({ message: 'Erro interno no servidor.' });
    }
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    try {
      await this.exameService.delete(id);
      return reply.status(204).send();
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return reply.status(404).send({ message: 'Exame não encontrado.' });
      }
      return reply.status(500).send({ message: 'Erro interno no servidor.' });
    }
  }
}