import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { SECRET, SERVER_URL, TOKEN_SECRET } from '../shared/constant';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(
    public http: HttpClient,
    private toastr: ToastrService,
    private cookie: CookieService
  ) {}

  setToken(token: string) {
    if (token) {
      this.cookie.set(TOKEN_SECRET, token);
    }
  }

  getToken() {
    return this.cookie.get(TOKEN_SECRET);
  }

  removeToken() {
    this.cookie.delete(TOKEN_SECRET);
  }

  logout() {
    localStorage.removeItem('user');
    this.removeToken();
  }

  encryption(response: any) {
    try {
      const data = JSON.stringify(response);
      const encryptedData = CryptoJS.AES.encrypt(data, SECRET).toString();
      return encryptedData;
    } catch {
      this.toastr.success('Encryption error, please try again later.', '', {
        timeOut: 3000,
        positionClass: 'toast-top-center',
      });

      return '';
    }
  }

  decryption(response: any) {
    try {
      const bytes = CryptoJS.AES.decrypt(response, SECRET);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } catch {
      this.toastr.success('Decryption error, please try again later.', '', {
        timeOut: 3000,
        positionClass: 'toast-top-center',
      });

      return '';
    }
  }

  httpCall(api: string, data: any, type: 'post' | 'get' | 'delete' | 'put') {
    return this.http.request(type, SERVER_URL + api, {
      body: data,
      headers: {
        'Content-Type': 'application/json',
        authorization: this.getToken(),
      },
    });
  }
}
