import { FastifyInstance } from 'fastify';
import { buildServer } from '../../app';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';

process.env.DATABASE_URL = "mysql://root:root@localhost:3306/desafio_test";
const prisma = new PrismaClient();

describe('Pacientes Routes', () => {
  let app: FastifyInstance;


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
  });

  // --- casos de teste ---

  it('deve criar um novo paciente com sucesso', async () => {
    const payload = {
      nome: 'Paciente de Teste',
      documento: '12345678900',
      data_nascimento: '1990-01-01T00:00:00.000Z',
    };

    const response = await request(app.server)
      .post('/pacientes')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.nome).toBe(payload.nome);

    const pacienteNoDb = await prisma.paciente.findUnique({ where: { id: response.body.id } });
    expect(pacienteNoDb).not.toBeNull();
  });


  it('deve retornar 409 ao tentar criar um paciente com documento duplicado', async () => {
    await prisma.paciente.create({
      data: {
        nome: 'Paciente Existente',
        documento: '00011122233',
        data_nascimento: new Date('1985-05-05'),
      },
    });

    const payload = {
      nome: 'Paciente Duplicado',
      documento: '00011122233',
      data_nascimento: '1992-02-02T00:00:00.000Z',
    };

    const response = await request(app.server)
      .post('/pacientes')
      .send(payload);

    expect(response.status).toBe(409);
    expect(response.body.message).toContain('Documento já cadastrado');
  });

    it('deve listar todos os pacientes', async () => {
  
    await prisma.paciente.create({
      data: {
        nome: 'Paciente para Listagem',
        documento: '44455566677',
        data_nascimento: new Date('1999-09-09'),
      },
    });


    const response = await request(app.server).get('/pacientes');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data[0].nome).toBe('Paciente para Listagem');
  });

    it('deve buscar um único paciente pelo ID', async () => {
    const paciente = await prisma.paciente.create({
      data: {
        nome: 'Paciente para Busca',
        documento: '88899900011',
        data_nascimento: new Date('2000-01-01'),
      },
    });

    const response = await request(app.server).get(`/pacientes/${paciente.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(paciente.id);
    expect(response.body.nome).toBe('Paciente para Busca');
  });

  it('deve retornar 404 ao buscar um paciente com ID inválido', async () => {
    const response = await request(app.server).get('/pacientes/id-invalido-123');
    expect(response.status).toBe(404);
  });

  it('deve atualizar um paciente com sucesso', async () => {
    const paciente = await prisma.paciente.create({
      data: {
        nome: 'Paciente Original',
        documento: '11122233344',
        data_nascimento: new Date('1980-01-01'),
      },
    });

    const response = await request(app.server)
      .put(`/pacientes/${paciente.id}`)
      .send({ nome: 'Paciente Atualizado' });

    expect(response.status).toBe(200);
    expect(response.body.nome).toBe('Paciente Atualizado');
  });

  it('deve deletar um paciente com sucesso', async () => {
    const paciente = await prisma.paciente.create({
      data: {
        nome: 'Paciente a ser Deletado',
        documento: '55566677788',
        data_nascimento: new Date('1970-01-01'),
      },
    });

    const deleteResponse = await request(app.server).delete(`/pacientes/${paciente.id}`);
    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app.server).get(`/pacientes/${paciente.id}`);
    expect(getResponse.status).toBe(404);
  });

});