import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Paciente, PacienteService } from '../../services/paciente';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './paciente-list.html',
  styleUrls: ['./paciente-list.scss']
})
export class PacienteList implements OnInit {
  
  pacientes: Paciente[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPacientes = 0;
  totalPages = 0;
  isLoading = false;
  private toastr = inject(ToastrService); 

  constructor(private pacienteService: PacienteService) { }

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes(): void {
    this.isLoading = true;
    this.pacienteService.getPacientes(this.currentPage, this.pageSize)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.pacientes = response.data;
          this.totalPacientes = response.total;
          this.totalPages = Math.ceil(this.totalPacientes / this.pageSize);
        },
        error: (err) => {
          console.error('Erro ao carregar pacientes', err);
          this.toastr.error('Erro ao carregar pacientes');
        }
      });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPacientes();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPacientes();
    }
  }

  onDelete(id: string): void {
    if (confirm('Tem certeza que deseja deletar este paciente?')) {
      this.pacienteService.deletePaciente(id).subscribe({
        next: () => {
          this.toastr.success('Paciente deletado com sucesso!');
          this.loadPacientes();
        },
        error: (err) => {
          console.error('Erro ao deletar paciente', err);
          this.toastr.error('Não foi possível deletar o paciente.');
        }
      });
    }
  }
}