import { Routes } from '@angular/router';

import { PacienteList } from './components/paciente-list/paciente-list';
import { PacienteForm } from './components/paciente-form/paciente-form';
import { ExameList } from './components/exame-list/exame-list';
import { ExameForm } from './components/exame-form/exame-form';

export const routes: Routes = [
    { path: '', redirectTo: '/pacientes', pathMatch: 'full' },
    { path: 'pacientes', component: PacienteList },
    { path: 'pacientes/novo', component: PacienteForm },
    { path: 'pacientes/editar/:id', component: PacienteForm },

    { path: 'exames', component: ExameList },
    { path: 'exames/novo', component: ExameForm },
];