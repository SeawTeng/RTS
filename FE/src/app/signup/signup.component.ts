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
  signupForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      id: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      type: [''],// Backend managed field
      planType: [''],// Backend managed field
      planid: [''],// Backend managed field
      status: [''], // Backend managed field
      lastCreatedTime: [''], // Backend managed field
      lastUpdatedTime: [''], // Backend managed field
      isDeleted: [''], // Backend managed field
      lastCreatedBy: [''], // Backend managed field
      lastUpdatedBy: [''], // Backend managed field
      image: ['']
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
