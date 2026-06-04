import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.currentUserValue;
  // Estrarre i ruoli permessi dalla configurazione della rotta
  const expectedRoles = route.data['roles'] as Array<string>;

  if (user && (expectedRoles.includes(user.role) || user.role === 'admin')) {
    return true; // Ha il ruolo richiesto
  }

  // Ruolo non autorizzato, rimandiamo alla home
  router.navigate(['/']);
  return false;
};
