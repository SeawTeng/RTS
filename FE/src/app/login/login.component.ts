import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import * as CryptoJS from 'crypto-js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  encryptData(data: string): string {
    const key = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f'); // 256-bit key
    const iv = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f'); // 128-bit IV
    const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;
      const encryptedEmail = this.encryptData(formValues.email);
      const encryptedPassword = this.encryptData(formValues.password);
      const encryptedData = {
        email: encryptedEmail,
        password: encryptedPassword
      };
      console.log('Encrypted Data:', encryptedData);
      // Send encryptedData to the API
      this.http.post(environment.apiUrl+"/users/login", encryptedData).subscribe(
        (res: any) => {
          console.log(res);
        }
      )
    } else {
      console.log('Form is invalid');
    }
  }
}