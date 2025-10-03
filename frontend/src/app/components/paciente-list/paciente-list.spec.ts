import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';

import { PacienteList } from './paciente-list';
import { Paciente, PacienteService } from '../../services/paciente';

describe('PacienteList', () => {
  let component: PacienteList;
  let fixture: ComponentFixture<PacienteList>;
  let mockPacienteService: jasmine.SpyObj<PacienteService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;


  beforeEach(async () => {
    mockPacienteService = jasmine.createSpyObj('PacienteService', ['getPacientes', 'deletePaciente']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [PacienteList, RouterTestingModule],
      providers: [
        { provide: PacienteService, useValue: mockPacienteService },
        { provide: ToastrService, useValue: mockToastrService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PacienteList);
    component = fixture.componentInstance;
  });

  // --- Testes ---

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar getPacientes ao ser inicializado', () => {
    mockPacienteService.getPacientes.and.returnValue(of({
      data: [] as Paciente[],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0
    }));

    fixture.detectChanges();
    expect(mockPacienteService.getPacientes).toHaveBeenCalled();
    expect(mockPacienteService.getPacientes).toHaveBeenCalledTimes(1);
    expect(mockPacienteService.getPacientes).toHaveBeenCalledWith(1, 10);
  });
});