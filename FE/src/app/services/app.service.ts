import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { SECRET, SERVER_URL } from '../shared/constant';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(
    public http: HttpClient,
    private toastr: ToastrService
  ) {}

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

  httpCall(
    api: string,
    data: any,
    type: 'post' | 'get' | 'delete' | 'put',
    withCredentials: boolean = true
  ) {
    return this.http.request(type, SERVER_URL + api, {
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      withCredentials: withCredentials,
    });
  }
}
