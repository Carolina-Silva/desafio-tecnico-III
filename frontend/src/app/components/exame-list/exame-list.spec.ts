import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';

import { ExameList } from './exame-list';
import { ExameService } from '../../services/exame';

describe('ExameList', () => {
  let component: ExameList;
  let fixture: ComponentFixture<ExameList>;
  let mockExameService: jasmine.SpyObj<ExameService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockExameService = jasmine.createSpyObj('ExameService', ['getExames', 'deleteExame']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ExameList, RouterTestingModule],
      providers: [
        { provide: ExameService, useValue: mockExameService },
        { provide: ToastrService, useValue: mockToastrService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExameList);
    component = fixture.componentInstance;
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar getExames ao ser inicializado (ngOnInit)', () => {
    mockExameService.getExames.and.returnValue(of({
      data: [], total: 0, page: 1, pageSize: 10, totalPages: 0
    }));
    fixture.detectChanges();

    expect(mockExameService.getExames).toHaveBeenCalledTimes(1);
    expect(mockExameService.getExames).toHaveBeenCalledWith(1, 10);
  });
});