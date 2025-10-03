import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { PacienteForm } from './paciente-form';
import { PacienteService } from '../../services/paciente';
import { Paciente } from '../../services/paciente';

describe('PacienteForm', () => {
  let component: PacienteForm;
  let fixture: ComponentFixture<PacienteForm>;

  let mockPacienteService: jasmine.SpyObj<PacienteService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockPacienteService = jasmine.createSpyObj('PacienteService', ['createPaciente', 'getPacienteById', 'updatePaciente']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PacienteForm, RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: PacienteService, useValue: mockPacienteService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({})
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PacienteForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve ter o formulário inválido quando criado', () => {
    expect(component.pacienteForm.valid).toBeFalsy();
  });

  it('deve ter o formulário válido após preencher todos os campos', () => {
    component.pacienteForm.setValue({
      nome: 'Paciente Teste',
      documento: '12345678900',
      data_nascimento: '2000-01-01'
    });
    expect(component.pacienteForm.valid).toBeTruthy();
  });

  it('NÃO deve chamar o serviço createPaciente se o formulário for inválido', () => {
    component.onSubmit();
    expect(mockPacienteService.createPaciente).not.toHaveBeenCalled();
  });

  it('deve chamar o serviço createPaciente e navegar em caso de sucesso', () => {
    const fakePaciente: Paciente = { id: '1', nome: 'Novo Paciente', documento: '11122233344', data_nascimento: '1999-12-12' };
    mockPacienteService.createPaciente.and.returnValue(of(fakePaciente)); 

    component.pacienteForm.setValue({
      nome: fakePaciente.nome,
      documento: fakePaciente.documento,
      data_nascimento: fakePaciente.data_nascimento
    });

    component.onSubmit();

    expect(mockPacienteService.createPaciente).toHaveBeenCalledTimes(1);
    expect(mockPacienteService.createPaciente).toHaveBeenCalledWith(component.pacienteForm.value);
    expect(mockToastrService.success).toHaveBeenCalledWith('Paciente cadastrado com sucesso!');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/pacientes']);
  });

});