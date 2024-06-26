import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ServicesService } from '../../services/services.service';
import { Router } from '@angular/router';
import { NgxLoadingModule } from 'ngx-loading';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [NgxLoadingModule, CommonModule, ReactiveFormsModule],
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.scss',
})
export class QuizListComponent implements OnInit {
  loading: boolean = false;
  quizList: any;

  constructor(
    private service: ServicesService,
    public router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.service
      .httpCall(this.service.getAllQuizQuestion(), {}, 'get')
      .subscribe(
        (res: any) => {
          this.quizList = res;
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
  }

  selectQuiz(quiz: any) {
    this.router.navigateByUrl(`/quiz-list/edit#${quiz.id}`);
  }

  createQuiz() {
    this.router.navigateByUrl(`/quiz-list/create`);
  }
}
