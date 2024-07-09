import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../../services/services.service';
import { NgxLoadingModule } from 'ngx-loading';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { StrongPasswordRegx } from '../../shared/constant';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, NgxLoadingModule],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss',
})
export class ResetComponent implements OnInit {
  resetForm: FormGroup = new FormGroup({
    email: new FormControl({ value: '', disabled: true }),
    new_password: new FormControl('', [
      Validators.required,
      Validators.pattern(StrongPasswordRegx),
    ]),
  });
  loading: boolean = false;
  passwordShow: boolean = false;
  id: any = null;
  data: any = null;

  constructor(
    private service: ServicesService,
    private toastr: ToastrService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.fragment;
    this.loading = true;

    this.service
      .httpCall(this.service.validateResetPassword(this.id), {}, 'get')
      .subscribe(
        (res: any) => {
          this.loading = false;
          this.data = res;

          this.resetForm = new FormGroup({
            email: new FormControl({ value: this.data.email, disabled: true }),
            new_password: new FormControl('', [
              Validators.required,
              Validators.pattern(StrongPasswordRegx),
            ]),
          });
        },
        (error: any) => {
          this.toastr.error(error.error, 'Error', {
            positionClass: 'toast-top-center',
          });
          this.router.navigate(['login']);
          this.loading = false;
        }
      );
  }

  get email() {
    return this.resetForm.get('email');
  }

  get password() {
    return this.resetForm.get('new_password');
  }

  onSubmit() {
    if (this.resetForm.valid) {
      const formValues = {
        userId: this.data.from._path.segments[1],
        code: this.id,
        new_password: this.resetForm.get('new_password')?.value
      }
      const encryptedData = this.service.encryption(formValues);
      this.loading = true;

      this.service
        .httpCall(this.service.updateResetPassword(), { data: encryptedData }, 'post')
        .subscribe(
          (res: any) => {
            this.loading = false;
            this.router.navigate(['login']);
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
