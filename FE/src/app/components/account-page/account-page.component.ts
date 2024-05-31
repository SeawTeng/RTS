import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ServicesService } from '../../services/services.service';
import { Router } from '@angular/router';
import { NgxLoadingModule } from 'ngx-loading';
import { CommonModule } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [NgxLoadingModule, CommonModule, ReactiveFormsModule],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss',
})
export class AccountPageComponent implements OnInit {
  updateForm: FormGroup = new FormGroup({});
  loading: boolean = false;
  userData: any;

  constructor(
    private service: ServicesService,
    public router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.updateForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      dob: new FormControl({ value: '', disabled: true }),
      email: new FormControl({ value: '', disabled: true }),
    });

    const store = localStorage.getItem('user');
    const user = store ? this.service.decryption(store) : {};

    this.service.httpCall(this.service.getUser(user.id), {}, 'get').subscribe(
      (res: any) => {
        this.userData = res;
        this.userData.dob = moment(this.userData.dob).format('YYYY-MM-DD');

        this.updateForm.patchValue(this.userData);
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

  onSubmit() {
    if (this.updateForm.valid) {
      const formValues = this.updateForm.value;
      delete formValues.email;
      delete formValues.dob;
      const encryptedData = this.service.encryption(formValues);
      this.loading = true;

      // Send encryptedData to the API
      this.service
        .httpCall(
          this.service.updateUser(this.userData.id),
          { data: encryptedData },
          'put'
        )
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
