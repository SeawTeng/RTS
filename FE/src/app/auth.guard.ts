import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AppService } from './services/app.service';

export const authGuard: CanActivateFn = () => {
  const store = localStorage.getItem('user');
  const user = store ? inject(AppService).decryption(store) : {};

  if (!user.email) {
    return false;
  }

  return true;
};
