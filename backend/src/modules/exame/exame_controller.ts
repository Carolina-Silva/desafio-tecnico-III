import { FastifyRequest, FastifyReply } from 'fastify';
import { ExameService, IdempotencyError } from './exame_service';

export class ExameController {
  constructor(private readonly exameService: ExameService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const novoExame = await this.exameService.create(request.body as any);
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

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    // definir o find many
  }
}