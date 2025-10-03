import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, EMPTY, finalize } from 'rxjs';
import { Exame, ExameService } from '../../services/exame';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exame-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './exame-list.html',
  styleUrls: ['./exame-list.scss']
})
export class ExameList implements OnInit {
  exames: Exame[] = [];
  currentPage = 1;
  pageSize = 10;
  totalExames = 0;
  totalPages = 0;
  isLoading = false;
  error: string | null = null;

  constructor(
    private exameService: ExameService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadExames();
  }

  loadExames(): void {
    this.isLoading = true;
    this.error = null; 

    this.exameService.getExames(this.currentPage, this.pageSize)
      .pipe(
        finalize(() => this.isLoading = false),
        catchError((err) => { 
          this.error = 'Ops! Não foi possível carregar os exames.';
          return EMPTY;
        })
      )
      .subscribe({
        next: (response) => {
          this.exames = response.data;
          this.totalExames = response.total;
          this.totalPages = Math.ceil(this.totalExames / this.pageSize);
        }
      });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadExames();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadExames();
    }
  }

   onDelete(id: string): void {
    if (confirm('Tem certeza que deseja deletar este exame?')) {
      this.exameService.deleteExame(id).subscribe({
        next: () => {
          this.toastr.success('Exame deletado com sucesso!');
          this.loadExames();
        },
        error: (err) => {
          this.toastr.error('Não foi possível deletar o exame.');
          console.error('Erro ao deletar exame', err);
        }
      });
    }
  }

}