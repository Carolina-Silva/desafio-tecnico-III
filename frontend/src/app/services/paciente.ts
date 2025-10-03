import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Paciente {
  id: string;
  nome: string;
  documento: string;
  data_nascimento: string;
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
export class PacienteService {
  private apiUrl = '/api/pacientes';

  constructor(private http: HttpClient) { }

  getPacientes(): Observable<PaginatedResponse<Paciente>> {
    return this.http.get<PaginatedResponse<Paciente>>(this.apiUrl);
  }

  createPaciente(paciente: Omit<Paciente, 'id'>): Observable<Paciente> {
    return this.http.post<Paciente>(this.apiUrl, paciente);
  }

  getPacienteById(id: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
  }

  updatePaciente(id: string, paciente: Partial<Paciente>): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/${id}`, paciente);
  }
  

  deletePaciente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}