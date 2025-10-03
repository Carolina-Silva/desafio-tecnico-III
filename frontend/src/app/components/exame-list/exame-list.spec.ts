import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExameList } from './exame-list';

describe('ExameList', () => {
  let component: ExameList;
  let fixture: ComponentFixture<ExameList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExameList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExameList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
