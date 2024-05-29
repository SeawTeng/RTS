import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { CommonModule } from '@angular/common';
import { StrongPasswordRegx } from '../../shared/constant';
import { ServicesService } from '../../services/services.service';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [NgxLoadingModule, CommonModule, ReactiveFormsModule],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss',
})
export class UpdatePasswordComponent implements OnInit {
  passwordForm: FormGroup = new FormGroup({});
  loading: boolean = false;
  oldPasswordShow: boolean = false;
  newPasswordShow: boolean = false;

  constructor(
    private service: ServicesService,
    private toastr: ToastrService,
    public router: Router
  ) {}

  ngOnInit() {
    this.passwordForm = new FormGroup({
      old_password: new FormControl('', [Validators.required]),
      new_password: new FormControl('', [
        Validators.required,
        Validators.pattern(StrongPasswordRegx),
      ]),
    });
  }

  get old_password() {
    return this.passwordForm.get('old_password');
  }

  get new_password() {
    return this.passwordForm.get('new_password');
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const formValues = this.passwordForm.value;
      const encryptedData = this.service.encryption(formValues);
      this.loading = true;

      // Send encryptedData to the API
      this.service
        .httpCall(
          this.service.updateUserPassword(),
          { data: encryptedData },
          'post'
        )
        .subscribe(
          (res: any) => {
            localStorage.removeItem('user');
            this.router.navigate(['/']);
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
