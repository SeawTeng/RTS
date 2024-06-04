import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AppService } from './services/app.service';

export const authGuard: CanActivateFn = () => {
  const cookie = inject(AppService).getToken();

  if (!cookie) {
    inject(AppService).logout();
    return false;
  }

  return true;
};
