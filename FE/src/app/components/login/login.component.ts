import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../../services/services.service';
import { NgxLoadingModule } from 'ngx-loading';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { StrongPasswordRegx } from '../../shared/constant';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, NgxLoadingModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  resetForm: FormGroup = new FormGroup({});
  loading: boolean = false;
  passwordShow: boolean = false;
  newPasswordShow: boolean = false;
  sendEmail: boolean = false;

  constructor(
    private service: ServicesService,
    private toastr: ToastrService,
    public router: Router
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });

    this.resetForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      code: new FormControl('', [Validators.required]),
      new_password: new FormControl('', [
        Validators.required,
        Validators.pattern(StrongPasswordRegx),
      ]),
    });

    // ensure that user that have alr login will not visit this page
    const store = localStorage.getItem('user');
    const user = store ? this.service.decryption(store) : {};
    if (user.email) {
      this.router.navigate(['home']);
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
      // make sure email is valid no matter upper or lower case
      formValues.email = formValues.email.toLowerCase();
      const encryptedData = this.service.encryption(formValues);
      this.loading = true;

      // Send encryptedData to the API
      this.service
        .httpCall(this.service.login(), { data: encryptedData }, 'post')
        .subscribe(
          (res: any) => {
            localStorage.setItem('user', this.service.encryption(res));
            this.service.setToken(res.token);
            this.loading = false;

            this.router.navigate(['home']);
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

  clearForm() {
    this.newPasswordShow = false;
    this.sendEmail = false;
    this.resetForm.get('email')?.enable();
    this.resetForm.reset();
  }

  resetAccount() {
    const formValues = this.resetForm.value;
    // make sure email is valid no matter upper or lower case
    formValues.email = formValues.email.toLowerCase();
    const encryptedData = this.service.encryption(formValues);
    this.loading = true;

    this.service
      .httpCall(this.service.resetPassword(), { data: encryptedData }, 'post')
      .subscribe(
        (res: any) => {
          this.loading = false;
          this.resetForm.get('email')?.disable();
          this.sendEmail = true;
          this.toastr.success(
            'Please check your email address for reset link.',
            'Success',
            {
              positionClass: 'toast-top-center',
            }
          );
        },
        (error: any) => {
          this.resetForm.get('email')?.enable();
          this.sendEmail = false;
          this.toastr.error(error.error, 'Error', {
            positionClass: 'toast-top-center',
          });
          this.loading = false;
        }
      );
  }

  resetPassword() {
    if (this.resetForm.valid) {
      this.loading = true;

      this.service
        .httpCall(
          this.service.validateResetPassword(this.resetForm.get('code')?.value),
          {},
          'get'
        )
        .subscribe(
          (res: any) => {
            this.loading = false;
            if (res.email !== this.resetForm.get('email')?.value) {
              this.toastr.error('Invalid Code', 'Error', {
                positionClass: 'toast-top-center',
              });
              return;
            }

            const data = {
              userId: res.from._path.segments[1],
              code: this.resetForm.get('code')?.value,
              new_password: this.resetForm.get('new_password')?.value,
            };
            const encryptedData = this.service.encryption(data);

            this.service
              .httpCall(
                this.service.updateResetPassword(),
                { data: encryptedData },
                'post'
              )
              .subscribe(
                (res: any) => {
                  this.loading = false;
                  this.clearForm();
                  (document.getElementById('closeReset') as any).click();
                },
                (error: any) => {
                  this.toastr.error(error.error, 'Error', {
                    positionClass: 'toast-top-center',
                  });
                  this.loading = false;
                }
              );
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
