import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ExamePayload {
  paciente_id: string;
  modalidade: string;
  data_exame: string;
  idempotency_key: string;
}

export interface Exame {
  id: string;
  paciente_id: string;
  modalidade: string;
  data_exame: string;
  paciente: {
    nome: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExameService {
  private apiUrl = '/api/exames';

  constructor(private http: HttpClient) { }
  getExames(page: number, pageSize: number): Observable<PaginatedResponse<Exame>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResponse<Exame>>(this.apiUrl, { params });
  }


  createExame(exameData: Omit<ExamePayload, 'idempotency_key' | 'id'>): Observable<Exame> {
    const payload: ExamePayload = {
      ...exameData,
      idempotency_key: crypto.randomUUID(),
    };
    return this.http.post<Exame>(this.apiUrl, payload);
  }

  deleteExame(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}