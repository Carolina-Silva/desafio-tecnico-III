import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, map } from 'rxjs';

import { ExameService } from '../../services/exame';
import { Paciente, PacienteService } from '../../services/paciente';

@Component({
  selector: 'app-exame-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exame-form.html',
  styleUrls: ['./exame-form.scss']
})
export class ExameForm implements OnInit {
  exameForm: FormGroup;
  pacientes$!: Observable<Paciente[]>;
  modalidades: string[] = ['CR', 'CT', 'DX', 'MG', 'MR', 'NM', 'OT', 'PT', 'RF', 'US', 'XA'];

  private fb = inject(FormBuilder);
  private exameService = inject(ExameService);
  private pacienteService = inject(PacienteService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  constructor() {
    this.exameForm = this.fb.group({
      paciente_id: ['', Validators.required],
      modalidade: ['', Validators.required],
      data_exame: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.pacientes$ = this.pacienteService.getPacientes(1, 1000).pipe(
      map(response => response.data)
    );
  }

  onSubmit(): void {
    this.exameForm.markAllAsTouched();
    if (this.exameForm.invalid) return;

    this.exameService.createExame(this.exameForm.value).subscribe({
      next: () => {
        this.toastr.success('Exame cadastrado com sucesso!');
        this.router.navigate(['/exames']);
      },
      error: (err) => {
        this.toastr.error(`Erro ao cadastrar exame: ${err.error.message}`);
      }
    });
  }
}