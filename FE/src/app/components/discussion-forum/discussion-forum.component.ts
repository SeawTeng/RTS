import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { Router, RouterModule } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-discussion-forum',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, NgxLoadingModule],
  templateUrl: './discussion-forum.component.html',
  styleUrl: './discussion-forum.component.scss',
})
export class DiscussionForumComponent implements OnInit {
  loading: boolean = false;
  discussionList: any;

  postForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
  });

  constructor(
    private service: ServicesService,
    private toastr: ToastrService,
    public router: Router
  ) {}

  ngOnInit() {
    this.getAllPost();
  }

  async getAllPost() {
    this.loading = true;
    await this.service
      .httpCall(this.service.getAllDiscussion(), {}, 'get')
      .subscribe(
        (res: any) => {
          this.discussionList = res;
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
  }

  convertDate(date: string) {
    return moment(date).format('LL');
  }

  async createDicussion() {
    if (this.postForm.valid) {
      this.loading = true;
      const data = this.postForm.value;

      await this.service
        .httpCall(this.service.createDiscussion(), data, 'post')
        .subscribe(
          async (res: any) => {
            this.loading = false;
            this.clearForm();
            this.getAllPost();
          },
          error => {
            this.loading = false;
            this.toastr.error(error.error, 'Error', {
              positionClass: 'toast-top-center',
            });
          }
        );
    }
  }

  clearForm() {
    this.postForm.reset();
  }

  redirectDetail(dis: any) {
    this.router.navigateByUrl(`/discussion/view#${dis.id}`);
  }
}
