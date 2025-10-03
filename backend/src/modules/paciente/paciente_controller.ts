import { FastifyRequest, FastifyReply } from 'fastify';
import { PacienteService } from './paciente_service';
import { Prisma } from '@prisma/client';

export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { nome, documento, data_nascimento } = request.body as any;

    if (!nome || !documento || !data_nascimento) {
      return reply.status(400).send({
        message: 'Campos obrigatórios ausentes: nome, documento e data_nascimento.',
      });
    }

    try {
      const dadosFormatados = {
        nome,
        documento,
        data_nascimento: new Date(data_nascimento), // <-- CORREÇÃO
      };

      const novoPaciente = await this.pacienteService.create(dadosFormatados);
      return reply.status(201).send(novoPaciente);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return reply.status(409).send({ message: 'Documento já cadastrado.' });
      }
      return reply.status(500).send({ message: 'Erro interno no servidor.' });
    }
  }

  async findMany(request: FastifyRequest<{ Querystring: { page?: string, pageSize?: string } }>, reply: FastifyReply) {
    try {
      const page = parseInt(request.query.page || '1', 10);
      const pageSize = parseInt(request.query.pageSize || '10', 10);

      const result = await this.pacienteService.findMany(page, pageSize);
      
      return reply.send({
        ...result,
        page,
        totalPages: Math.ceil(result.total / pageSize),
      });
    } catch (error) {
      return reply.status(500).send({ message: 'Erro interno no servidor.' });
    }
  }

  async findOne(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    try {
      const paciente = await this.pacienteService.findOne(id);
      if (!paciente) {
        return reply.status(404).send({ message: 'Paciente não encontrado.' });
      }
      return reply.send(paciente);
    } catch (error) {
      return reply.status(500).send({ message: 'Erro interno no servidor.' });
    }
  }

  async update(request: FastifyRequest<{ Params: { id: string }, Body: Prisma.PacienteUpdateInput }>, reply: FastifyReply) {
    const { id } = request.params;
    const body = request.body as any;

    const dadosFormatados = {
      ...body,
    };

    if (body.data_nascimento) {
      dadosFormatados.data_nascimento = new Date(body.data_nascimento);
    }
    try {
      const paciente = await this.pacienteService.update(id, dadosFormatados);
      return reply.send(paciente);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return reply.status(404).send({ message: 'Paciente não encontrado.' });
      }
      return reply.status(500).send({ message: 'Erro interno no servidor.' });
    }
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    try {
      await this.pacienteService.delete(id);
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return reply.status(404).send({ message: 'Paciente não encontrado.' });
      }
      return reply.status(500).send({ message: 'Erro interno no servidor.' });
    }
  }
}