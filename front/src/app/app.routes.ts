import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { EtudiantsComponent } from './pages/etudiants/etudiants.component';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'etudiants', component: EtudiantsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
