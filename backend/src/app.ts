import Fastify from 'fastify';
import { pacienteRoutes } from './modules/paciente/paciente_route';
import { exameRoutes } from './modules/exame/exame_route';

export function buildServer() {
  const app = Fastify({
    logger: true,
  });

  app.register(pacienteRoutes, { prefix: '/pacientes' });

  app.register(exameRoutes, { prefix: '/exames' });

  return app;
}