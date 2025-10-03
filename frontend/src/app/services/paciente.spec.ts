import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PacienteService, PaginatedResponse, Paciente } from './paciente';

describe('PacienteService', () => {
  let service: PacienteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PacienteService]
    });
    service = TestBed.inject(PacienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar pacientes com sucesso (getPacientes)', () => {
    const mockResponse: PaginatedResponse<Paciente> = {
      data: [
        { id: '1', nome: 'Paciente Teste 1', documento: '111', data_nascimento: '1990-01-01' }
      ],
      total: 1,
      page: 1,
      pageSize: 10,
    };

    service.getPacientes(1, 10).subscribe(response => {
      expect(response.data.length).toBe(1);
      expect(response.data[0].nome).toBe('Paciente Teste 1');
    });

    const req = httpMock.expectOne(`${service['apiUrl']}?page=1&pageSize=10`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });
});