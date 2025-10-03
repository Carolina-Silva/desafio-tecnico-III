import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { ExameForm } from './exame-form';
import { ExameService } from '../../services/exame';
import { PacienteService } from '../../services/paciente';

describe('ExameForm', () => {
  let component: ExameForm;
  let fixture: ComponentFixture<ExameForm>;

  let mockExameService: jasmine.SpyObj<ExameService>;
  let mockPacienteService: jasmine.SpyObj<PacienteService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockExameService = jasmine.createSpyObj('ExameService', ['createExame']);
    mockPacienteService = jasmine.createSpyObj('PacienteService', ['getPacientes']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockPacienteService.getPacientes.and.returnValue(of({
      data: [], total: 0, page: 1, pageSize: 10, totalPages: 0
    }));

    await TestBed.configureTestingModule({
      imports: [ExameForm, RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: ExameService, useValue: mockExameService },
        { provide: PacienteService, useValue: mockPacienteService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({}) } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExameForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve buscar a lista de pacientes ao ser inicializado', () => {

    expect(mockPacienteService.getPacientes).toHaveBeenCalledTimes(1);
  });

  it('deve chamar createExame e navegar ao submeter um formulário válido', () => {
    const fakeExame = { id: 'exame-1', modalidade: 'CT', data_exame: '2025-10-10T10:00', paciente_id: 'paciente-1', paciente: { nome: 'Teste' } };
    mockExameService.createExame.and.returnValue(of(fakeExame));

    component.exameForm.setValue({
      paciente_id: 'paciente-1',
      modalidade: 'CT',
      data_exame: '2025-10-10T10:00'
    });
    
    component.onSubmit();

    expect(mockExameService.createExame).toHaveBeenCalledTimes(1);
    expect(mockToastrService.success).toHaveBeenCalledWith('Exame cadastrado com sucesso!');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/exames']);
  });

});