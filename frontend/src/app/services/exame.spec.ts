import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ExameService, Exame, ExamePayload } from './exame';
import { PaginatedResponse } from './paciente';

describe('ExameService', () => {
  let service: ExameService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExameService]
    });
    service = TestBed.inject(ExameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar exames com sucesso (getExames)', () => {
    const mockResponse: PaginatedResponse<Exame> = {
      data: [{
        id: 'exame-1',
        paciente_id: 'paciente-1',
        modalidade: 'CT',
        data_exame: '2025-10-10T10:00:00.000Z',
        paciente: { nome: 'Paciente Teste' }
      }],
      total: 1, page: 1, pageSize: 10,
    };

    service.getExames(1, 10).subscribe(response => {
      expect(response.data.length).toBe(1);
      expect(response.data[0].modalidade).toBe('CT');
    });

    const req = httpMock.expectOne(`${service['apiUrl']}?page=1&pageSize=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('deve criar um exame com sucesso (createExame)', () => {
    const exameData: Omit<ExamePayload, 'idempotency_key' | 'id'> = {
      paciente_id: 'paciente-1',
      modalidade: 'MR',
      data_exame: '2025-11-11T11:00:00.000Z'
    };
    const mockResponse: Exame = {
      id: 'exame-novo-1',
      ...exameData,
      paciente: { nome: 'Paciente Novo' }
    };

    service.createExame(exameData).subscribe(response => {

      expect(response.id).toBe('exame-novo-1');
      expect(response.modalidade).toBe('MR');
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');

    expect(req.request.body.idempotency_key).toBeDefined();
    expect(req.request.body.modalidade).toBe('MR');
    req.flush(mockResponse);
  });
});