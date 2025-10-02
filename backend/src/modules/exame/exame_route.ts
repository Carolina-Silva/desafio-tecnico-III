// src/modules/exames/exame.route.ts
import { FastifyInstance } from 'fastify';
import { ExameController } from './exame_controller';
import { ExameService } from './exame_service';

const exameService = new ExameService();
const exameController = new ExameController(exameService);

export async function exameRoutes(app: FastifyInstance) {
  app.post('/', exameController.create.bind(exameController));
  app.get('/', exameController.findMany.bind(exameController));
}