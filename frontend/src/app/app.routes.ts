import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Rotte Pubbliche (Caricate subito)
  {
    path: '',
    loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'event/:id',
    loadComponent: () => import('./features/public/event-detail/event-detail.component').then(m => m.EventDetailComponent)
  },

  // Area Utente Autenticato (Lazy Loading + Auth Guard)
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/user/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'my-tickets',
    canActivate: [authGuard],
    loadComponent: () => import('./features/user/my-tickets/my-tickets.component').then(m => m.MyTicketsComponent)
  },

  // Area Organizzatore (Lazy Loading + Role Guard)
  {
    path: 'organizer/dashboard',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['organizer'] },
    loadComponent: () => import('./features/organizer/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'organizer/event/new',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['organizer'] },
    loadComponent: () => import('./features/organizer/event-form/event-form.component').then(m => m.EventFormComponent)
  },

  // Area Admin (Lazy Loading + Role Guard)
  {
    path: 'admin/users',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
  },

  // Rotta di fallback (Pagina non trovata)
  { path: '**', redirectTo: '' }
];
