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

export const adminGuard: CanActivateFn = () => {
  const cookie = inject(AppService).getToken();

  if (cookie) {
    const store = localStorage.getItem('user');
    const userInfo = store ? inject(AppService).decryption(store) : {};

    if (userInfo.type == 'admin') {
      return true;
    }
  } else {
    inject(AppService).logout();
  }

  return false;
};
