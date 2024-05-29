import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../../services/services.service';
import { NgxLoadingModule } from 'ngx-loading';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, NgxLoadingModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  loading: boolean = false;

  constructor(
    private service: ServicesService,
    private toastr: ToastrService,
    public router: Router
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    // ensure that user that have alr login will not visit this page
    const store = localStorage.getItem('user');
    const user = store ? this.service.decryption(store) : {};
    if (user.email) {
      this.router.navigate(['/home']);
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;
      const encryptedData = this.service.encryption(formValues);
      this.loading = true;

      // Send encryptedData to the API
      this.service
        .httpCall(this.service.login(), { data: encryptedData }, 'post', false)
        .subscribe(
          (res: any) => {
            localStorage.setItem('user', encryptedData);
            this.router.navigate(['/home']);
            window.location.reload();
            this.loading = false;

            this.toastr.success('Successfully Login', '', {
              timeOut: 3000,
              positionClass: 'toast-top-center',
            });
          },
          (error: any) => {
            this.toastr.error(error.error, 'Error', {
              positionClass: 'toast-top-center',
            });
            this.loading = false;
          }
        );
    } else {
      this.loading = false;
    }
  }
}
