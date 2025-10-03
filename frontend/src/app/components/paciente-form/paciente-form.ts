import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../services/paciente';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paciente-form.html',
  styleUrls: ['./paciente-form.scss']
})
export class PacienteForm {
  pacienteForm: FormGroup;

  private fb = inject(FormBuilder);
  private pacienteService = inject(PacienteService);
  private router = inject(Router);

  constructor() {
    this.pacienteForm = this.fb.group({
      nome: ['', Validators.required],
      documento: ['', Validators.required],
      data_nascimento: ['', Validators.required],
    });
  }


  onSubmit(): void {
    this.pacienteForm.markAllAsTouched();

    if (this.pacienteForm.invalid) {
      return;
    }

    this.pacienteService.createPaciente(this.pacienteForm.value).subscribe({
      next: (pacienteCriado) => {
        console.log('Paciente criado com sucesso!', pacienteCriado);
        alert('Paciente cadastrado com sucesso!');
        this.router.navigate(['/pacientes']);
      },
      error: (err) => {
        console.error('Erro ao criar paciente', err);
        alert(`Erro ao cadastrar paciente: ${err.error.message || 'Verifique os dados e tente novamente.'}`);
      }
    });
  }
}
