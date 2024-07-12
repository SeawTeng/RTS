import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { Router } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'app-discussion-forum',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxLoadingModule],
  templateUrl: './discussion-forum.component.html',
  styleUrl: './discussion-forum.component.scss',
})
export class DiscussionForumComponent implements OnInit {
  loading: boolean = false;
  discussionList: any;

  constructor(
    private service: ServicesService,
    public router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.service
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
    return moment(date).format('LL')
  }
}
