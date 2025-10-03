import { Component, OnInit  } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Paciente, PaginatedResponse, PacienteService } from '../../services/paciente';


@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './paciente-list.html',
  styleUrls: ['./paciente-list.scss']
})
export class PacienteList implements OnInit {
  pacientesResponse$!: Observable<PaginatedResponse<Paciente>>;

  constructor(private pacienteService: PacienteService) { }


  ngOnInit(): void {

    this.pacientesResponse$ = this.pacienteService.getPacientes();
  }
}
