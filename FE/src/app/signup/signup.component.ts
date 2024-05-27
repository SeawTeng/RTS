import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup = new FormGroup({});

  constructor() {}

  ngOnInit() {
    this.signupForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      id: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      type: new FormControl(''),// Backend managed field
      planType: new FormControl(''),// Backend managed field
      planid: new FormControl(''),// Backend managed field
      status: new FormControl(''), // Backend managed field
      lastCreatedTime: new FormControl(''), // Backend managed field
      lastUpdatedTime: new FormControl(''), // Backend managed field
      isDeleted: new FormControl(''), // Backend managed field
      lastCreatedBy: new FormControl(''), // Backend managed field
      lastUpdatedBy: new FormControl(''), // Backend managed field
      image: new FormControl('')
    });
  }

  encryptData(data: string): string {
    const key = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f'); // 256-bit key
    const iv = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f'); // 128-bit IV
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      keySize: 256 / 32, // 256 bits key size
      iterations: 100 // Number of iterations (default is 1)
    });
    return encrypted.toString();
  }


  onSubmit() {
    // Set backend managed fields before sending to backend
    this.signupForm.patchValue({
      // side not that all fields need to be strings in order to encrypt
      type: 'user',
      planType: 'free',
      planid: "1",
      status: 'active', // example value
      lastCreatedTime: new Date().toISOString(),
      lastUpdatedTime: new Date().toISOString(),
      isDeleted: false,
      lastCreatedBy: 'system', // example value
      lastUpdatedBy: 'system' // example value
    });

    if (this.signupForm.valid) {
      const formValues = this.signupForm.value;
      const encryptedEmail = this.encryptData(formValues.email);
      const encryptedPassword = this.encryptData(formValues.password);
      const encryptedFirstName = this.encryptData(formValues.firstName);
      const encryptedLastName = this.encryptData(formValues.lastName);
      const encryptedDob = this.encryptData(formValues.dob);
      const encryptedId = this.encryptData(formValues.id);
      const encryptedType = this.encryptData(formValues.type);
      const encryptedPlanType = this.encryptData(formValues.planType);
      const encryptedPlanId = this.encryptData(formValues.planid);
      const encryptedStatus = this.encryptData(formValues.status);
      const encryptedLastCreatedTime = this.encryptData(formValues.lastCreatedTime);
      const encryptedLastUpdatedTime = this.encryptData(formValues.lastUpdatedTime);
      const encryptedIsDeleted = this.encryptData(formValues.isDeleted);
      const encryptedLastCreatedBy = this.encryptData(formValues.lastCreatedBy);
      const encryptedLastUpdatedBy = this.encryptData(formValues.lastUpdatedBy);
      const encryptedImage = this.encryptData(formValues.image);


      const encryptedData = {
        firstName: encryptedFirstName,
        lastName: encryptedLastName,
        dob: encryptedDob,
        id: encryptedId,
        email: encryptedEmail,
        password: encryptedPassword,
        type: encryptedType,
        planType: encryptedPlanType,
        planid: encryptedPlanId,
        status: encryptedStatus,
        lastCreatedTime: encryptedLastCreatedTime,
        lastUpdatedTime: encryptedLastUpdatedTime,
        isDeleted: encryptedIsDeleted,
        lastCreatedBy: encryptedLastCreatedBy,
        lastUpdatedBy: encryptedLastUpdatedBy,
        image: encryptedImage
      };
      console.log('Encrypted Data:', encryptedData);
      // Send encryptedData to the API
    } else {
      console.log('Form is invalid');
    }
  }

}
