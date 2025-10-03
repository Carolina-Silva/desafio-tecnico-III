import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
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

  constructor(
    private exameService: ExameService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadExames();
  }

  loadExames(): void {
    this.isLoading = true;
    this.exameService.getExames(this.currentPage, this.pageSize)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.exames = response.data;
          this.totalExames = response.total;
          this.totalPages = Math.ceil(this.totalExames / this.pageSize);
        },
        error: (err) => {
          this.toastr.error('Erro ao carregar exames.');
          console.error('Erro ao carregar exames', err);
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

}