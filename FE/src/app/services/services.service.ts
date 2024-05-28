import { Injectable } from '@angular/core';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class ServicesService extends AppService {
  //  #    #  ####  ###### #####
  //  #    # #      #      #    #
  //  #    #  ####  #####  #    #
  //  #    #      # #      #####
  //  #    # #    # #      #   #
  //   ####   ####  ###### #    #

  login() {
    return `/users/login`;
  }

  logout() {
    return `/users/logout`;
  }

  createUser() {
    return `/users/create`;
  }

  getUser(id: string) {
    return `/users/${id}`;
  }

  deleteUser(id: string) {
    return `/users/${id}`;
  }

  updateUser(id: string) {
    return `/users/${id}`;
  }

  updateUserPassword() {
    return `/users/updatePassword`;
  }
}
