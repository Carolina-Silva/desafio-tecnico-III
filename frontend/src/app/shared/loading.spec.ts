import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve emitir `false` inicialmente', (done: DoneFn) => {
    service.loading$.subscribe(isLoading => {
      expect(isLoading).toBeFalse();
      done();
    });
  });

  it('deve emitir `true` após chamar show()', (done: DoneFn) => {
    service.show();
    service.loading$.subscribe(isLoading => {
      expect(isLoading).toBeTrue();
      done();
    });
  });

  it('deve emitir `false` após chamar hide()', (done: DoneFn) => {
    service.show();
    service.hide();
    service.loading$.subscribe(isLoading => {
      expect(isLoading).toBeFalse();
      done();
    });
  });
});