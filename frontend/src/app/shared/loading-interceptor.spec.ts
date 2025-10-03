import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { loadingInterceptor } from './loading-interceptor';
import { LoadingService } from './loading';

describe('loadingInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    mockLoadingService = jasmine.createSpyObj('LoadingService', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting(),
        { provide: LoadingService, useValue: mockLoadingService }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve chamar show() no início e hide() no final de uma chamada bem-sucedida', () => {
    httpClient.get('/api/test').subscribe();

    expect(mockLoadingService.show).toHaveBeenCalledTimes(1);
    expect(mockLoadingService.hide).not.toHaveBeenCalled();

    const req = httpMock.expectOne('/api/test');
    req.flush({});

    expect(mockLoadingService.hide).toHaveBeenCalledTimes(1);
  });

  it('deve chamar show() no início e hide() no final mesmo em uma chamada com erro', () => {
    httpClient.get('/api/test').subscribe({
      error: () => {}
    });

    expect(mockLoadingService.show).toHaveBeenCalledTimes(1);
    expect(mockLoadingService.hide).not.toHaveBeenCalled();

    const req = httpMock.expectOne('/api/test');
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(mockLoadingService.hide).toHaveBeenCalledTimes(1);
  });
});