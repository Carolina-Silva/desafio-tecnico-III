import { Routes } from '@angular/router';

import { PacienteList } from './components/paciente-list/paciente-list';
import { PacienteForm } from './components/paciente-form/paciente-form';

export const routes: Routes = [
    { path: '', redirectTo: '/pacientes', pathMatch: 'full' },
    { path: 'pacientes', component: PacienteList },
    { path: 'pacientes/novo', component: PacienteForm }
];