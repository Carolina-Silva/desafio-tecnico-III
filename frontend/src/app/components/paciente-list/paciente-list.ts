import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, EMPTY, finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Paciente, PacienteService } from '../../services/paciente';
import Swal from 'sweetalert2';

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
  error: string | null = null;
  private toastr = inject(ToastrService); 

  constructor(private pacienteService: PacienteService) { }

  ngOnInit(): void {
    this.loadPacientes();
  }

loadPacientes(): void {
  this.isLoading = true;
  this.error = null;

  this.pacienteService.getPacientes(this.currentPage, this.pageSize)
    .pipe(
      finalize(() => this.isLoading = false),
      catchError((err) => {
        console.error('Erro ao carregar pacientes', err);
        this.error = 'Ops! Não foi possível carregar os dados.';
        return EMPTY;
      })
    )
    .subscribe({
      next: (response) => {
        this.pacientes = response.data;
        this.totalPacientes = response.total;
        this.totalPages = Math.ceil(this.totalPacientes / this.pageSize);
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
    Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter esta ação!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pacienteService.deletePaciente(id).subscribe({
          next: () => {
            this.toastr.success('Paciente deletado com sucesso!');
            this.loadPacientes();
          },
          error: (err) => {
            this.toastr.error('Não foi possível deletar o paciente.');
            console.error('Erro ao deletar paciente', err);
          }
        });
      }
    });
  }
}