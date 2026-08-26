import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'select-slot2',
    loadComponent: () => import('./pages/select-slot2/select-slot2.page').then( m => m.SelectSlot2Page)
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.page').then( m => m.AuthPage)
  },
  {
    path: 'appointment',
    loadComponent: () => import('./pages/appointment/appointment.page').then( m => m.AppointmentPage)
  },
  {
    path: 'auth',
    loadComponent: () => import('./services/auth/auth.page').then( m => m.AuthPage)
  },
  {
    path: 'appointment',
    loadComponent: () => import('./services/appointment/appointment.page').then( m => m.AppointmentPage)
  },
];
