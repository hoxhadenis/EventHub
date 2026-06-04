import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUserValue) {
    return true; // Utente loggato, permesso accordato
  }

  // Non loggato, reindirizziamo al login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
