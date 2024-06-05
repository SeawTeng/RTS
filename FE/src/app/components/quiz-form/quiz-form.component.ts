import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ServicesService } from '../../services/services.service';
import { NgxLoadingModule } from 'ngx-loading';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-quiz-form',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxLoadingModule],
  templateUrl: './quiz-form.component.html',
  styleUrl: './quiz-form.component.scss',
})
export class QuizFormComponent implements OnInit {
  loading = false;
  quizQuestion: any;

  constructor(
    private service: ServicesService,
    public router: Router,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    this.loading = true;
    await this.service
      .httpCall(this.service.getActiveQuizQuestion(), {}, 'get')
      .subscribe(
        async (res: any) => {
          this.quizQuestion = res;
          console.log(this.quizQuestion);
          this.loading = false;
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
