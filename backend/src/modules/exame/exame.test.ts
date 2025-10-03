import { FastifyInstance } from 'fastify';
import { buildServer } from '../../app';
import { PrismaClient, Paciente } from '@prisma/client';
import request from 'supertest';

process.env.DATABASE_URL = "mysql://root:root@localhost:3306/desafio_test";
const prisma = new PrismaClient();

describe('Exames Routes', () => {
  let app: FastifyInstance;
  let pacienteTeste: Paciente;

  beforeAll(async () => {
    app = buildServer();
    await app.ready();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.exame.deleteMany({});
    await prisma.paciente.deleteMany({});
    
    pacienteTeste = await prisma.paciente.create({
      data: {
        nome: 'Paciente Padrão para Testes',
        documento: '99988877766',
        data_nascimento: new Date('1990-01-01'),
      },
    });
  });

  it('deve criar um novo exame com sucesso para um paciente existente', async () => {
    const payload = {
      paciente_id: pacienteTeste.id,
      idempotency_key: 'teste-criacao-sucesso-001',
      modalidade: 'CT',
      data_exame: '2025-10-20T10:00:00.000Z', // Data como string
    };

    const response = await request(app.server)
      .post('/exames')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('deve retornar 400 ao tentar criar um exame para um paciente inexistente', async () => {
    const payload = {
      paciente_id: 'id-falso-que-nao-existe',
      idempotency_key: 'teste-paciente-invalido-002',
      modalidade: 'MR',
      data_exame: '2025-11-11T11:00:00.000Z', // Data como string
    };

    const response = await request(app.server)
      .post('/exames')
      .send(payload);

    expect(response.status).toBe(400);
  });

  it('deve garantir a idempotência: retornar 200 OK ao reenviar a mesma requisição', async () => {
    const payload = {
      paciente_id: pacienteTeste.id,
      idempotency_key: 'chave-idempotencia-unica-003',
      modalidade: 'US',
      data_exame: '2025-12-12T12:00:00.000Z', // Data como string
    };

    const firstResponse = await request(app.server).post('/exames').send(payload);
    expect(firstResponse.status).toBe(201);

    const secondResponse = await request(app.server).post('/exames').send(payload);
    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body.id).toBe(firstResponse.body.id);
  });
  
  it('deve listar os exames com paginação', async () => {
    for (let i = 1; i <= 15; i++) {
      await prisma.exame.create({
        data: {
          paciente_id: pacienteTeste.id,
          idempotency_key: `exame-pagina-${i}`,
          modalidade: 'XA',
          data_exame: new Date(), // Prisma aceita Date object aqui, mas a API não
        },
      });
    }

    const response = await request(app.server).get('/exames?page=2&pageSize=5');

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(5);
    expect(response.body.total).toBe(15);
    expect(response.body.page).toBe(2);
  });

  it('deve deletar um exame com sucesso', async () => {
    const exame = await prisma.exame.create({
      data: {
        paciente_id: pacienteTeste.id,
        idempotency_key: 'exame-para-deletar-004',
        modalidade: 'PT',
        data_exame: new Date().toISOString(), // Data como string
      },
    });

    const deleteResponse = await request(app.server).delete(`/exames/${exame.id}`);
    expect(deleteResponse.status).toBe(204);
  });
});