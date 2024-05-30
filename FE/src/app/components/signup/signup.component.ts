import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../../services/services.service';
import { NgxLoadingModule } from 'ngx-loading';
import { Router } from '@angular/router';
import { StrongPasswordRegx } from '../../shared/constant';
import moment from 'moment';

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
  passwordShow: boolean = false;

  today: string = moment().format('YYYY-MM-DD');

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
        Validators.pattern(StrongPasswordRegx),
      ]),
      image: new FormControl('')
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formValues = this.signupForm.value;
      const encryptedData = this.service.encryption(formValues);
      this.loading = true;

      // Send encryptedData to the API
      this.service
        .httpCall(this.service.createUser(), { data: encryptedData }, 'post')
        .subscribe(
          (res: any) => {
            this.loading = false;
            this.router.navigate(['login']);
          },
          error => {
            this.loading = false;
          }
        );
    } else {
      this.loading = false;
    }
  }
}
