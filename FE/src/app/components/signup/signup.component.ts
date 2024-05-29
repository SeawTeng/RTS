import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { ServicesService } from '../../services/services.service';
import { NgxLoadingModule } from 'ngx-loading';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxLoadingModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup = new FormGroup({});
  loading: boolean = false;

  constructor(
    private service: ServicesService,
    public router: Router
  ) {}

  ngOnInit() {
    this.signupForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      id: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      type: new FormControl(''), // Backend managed field
      planType: new FormControl(''), // Backend managed field
      planid: new FormControl(''), // Backend managed field
      status: new FormControl(''), // Backend managed field
      lastCreatedTime: new FormControl(''), // Backend managed field
      lastUpdatedTime: new FormControl(''), // Backend managed field
      isDeleted: new FormControl(''), // Backend managed field
      lastCreatedBy: new FormControl(''), // Backend managed field
      lastUpdatedBy: new FormControl(''), // Backend managed field
      image: new FormControl(''),
    });
  }

  onSubmit() {
    // Set backend managed fields before sending to backend
    this.signupForm.patchValue({
      // side not that all fields need to be strings in order to encrypt
      type: 'user',
      planType: 'free',
      planid: '1',
      status: 'active', // example value
      lastCreatedTime: new Date().toISOString(),
      lastUpdatedTime: new Date().toISOString(),
      isDeleted: false,
      lastCreatedBy: 'system', // example value
      lastUpdatedBy: 'system', // example value
    });

    if (this.signupForm.valid) {
      const formValues = this.signupForm.value;
      const encryptedData = this.service.encryption(formValues);
      this.loading = true;

      // Send encryptedData to the API
      this.service
        .httpCall(
          this.service.createUser(),
          { data: encryptedData },
          'post',
          false
        )
        .subscribe(
          (res: any) => {
            this.loading = false;
            this.router.navigate(['/login']);
          },
          error => {
            this.loading = false;
          }
        );
    } else {
    }
  }
}
