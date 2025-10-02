import { FastifyInstance } from 'fastify';
import { PacienteController } from './paciente_controller';
import { PacienteService } from './paciente_service';

const pacienteService = new PacienteService();
const pacienteController = new PacienteController(pacienteService);

export async function pacienteRoutes(app: FastifyInstance) {
  app.post('/', pacienteController.create.bind(pacienteController));
  app.get('/', pacienteController.findMany.bind(pacienteController));
  app.get('/:id', pacienteController.findOne.bind(pacienteController));
  app.put('/:id', pacienteController.update.bind(pacienteController));
  app.delete('/:id', pacienteController.delete.bind(pacienteController));
}