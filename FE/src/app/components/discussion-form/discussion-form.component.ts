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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-discussion-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, NgxLoadingModule],
  templateUrl: './discussion-form.component.html',
  styleUrl: './discussion-form.component.scss',
})
export class DiscussionFormComponent implements OnInit {
  loading: boolean = false;
  discussion: any;
  id: any;
  commentList: any;

  commentForm: FormGroup = new FormGroup({
    comment: new FormControl('', [Validators.required]),
  });

  constructor(
    private service: ServicesService,
    private toastr: ToastrService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.fragment;
    this.getOnePost();
  }

  async getOnePost() {
    this.loading = true;
    await this.service
      .httpCall(this.service.getOneDiscussion(this.id), {}, 'get')
      .subscribe(
        async (res: any) => {
          this.discussion = res;
          await this.getAllComment();
        },
        error => {
          this.loading = false;
        }
      );
  }

  async getAllComment() {
    this.loading = true;
    await this.service
      .httpCall(
        this.service.getAllDiscussionComment(this.discussion?.id),
        {},
        'get'
      )
      .subscribe(
        (res: any) => {
          this.commentList = res;
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

  async createComment() {
    if (this.commentForm.valid) {
      this.loading = true;
      const data = this.commentForm.value;
      data.discussionId = this.discussion.id;

      await this.service
        .httpCall(this.service.createDiscussionComment(), data, 'post')
        .subscribe(
          async (res: any) => {
            this.loading = false;
            this.clearForm();
            this.getOnePost();
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
    this.commentForm.reset();
  }
}
