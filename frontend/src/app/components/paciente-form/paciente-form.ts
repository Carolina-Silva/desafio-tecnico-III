import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../services/paciente';
import { ActivatedRoute, Router } from '@angular/router'; 

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paciente-form.html',
  styleUrls: ['./paciente-form.scss']
})

export class PacienteForm  implements OnInit {
  pacienteForm: FormGroup;
  isEditMode = false;
  private currentPacienteId: string | null = null;

  private fb = inject(FormBuilder);
  private pacienteService = inject(PacienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.pacienteForm = this.fb.group({
      nome: ['', Validators.required],
      documento: ['', Validators.required],
      data_nascimento: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    this.currentPacienteId = this.route.snapshot.paramMap.get('id');


    if (this.currentPacienteId) {
      this.isEditMode = true;
      this.pacienteService.getPacienteById(this.currentPacienteId).subscribe(paciente => {
        const formattedDate = new Date(paciente.data_nascimento).toISOString().split('T')[0];
        this.pacienteForm.patchValue({
          ...paciente,
          data_nascimento: formattedDate
        });
      });
    }
  }

  onSubmit(): void {
    this.pacienteForm.markAllAsTouched();
    if (this.pacienteForm.invalid) return;

    const formValue = this.pacienteForm.value;

    if (this.isEditMode && this.currentPacienteId) {
      this.pacienteService.updatePaciente(this.currentPacienteId, formValue).subscribe({
        next: () => {
          alert('Paciente atualizado com sucesso!');
          this.router.navigate(['/pacientes']);
        },
        error: (err) => alert(`Erro ao atualizar: ${err.error.message}`)
      });
    } else {
      this.pacienteService.createPaciente(formValue).subscribe({
        next: () => {
          alert('Paciente cadastrado com sucesso!');
          this.router.navigate(['/pacientes']);
        },
        error: (err) => alert(`Erro ao cadastrar: ${err.error.message}`)
      });
    }
  }
}
