import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ServicesService } from '../../services/services.service';
import { NgxLoadingModule } from 'ngx-loading';
import { ToastrService } from 'ngx-toastr';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-quiz-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgxLoadingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './quiz-form.component.html',
  styleUrl: './quiz-form.component.scss',
})
export class QuizFormComponent implements OnInit {
  loading = false;
  quizQuestion: any;
  submitted = false;
  answer: any;
  viewType: string = '';

  quizForm = this.fb.group({
    questionAnswer: this.fb.array([]),
  });

  constructor(
    private service: ServicesService,
    public router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  get questions() {
    return this.quizForm.controls['questionAnswer'] as FormArray;
  }

  async ngOnInit() {
    this.loading = true;
    await this.service
      .httpCall(this.service.getActiveQuizQuestion(), {}, 'get')
      .subscribe(
        async (res: any) => {
          this.quizQuestion = res;

          for (const qns of this.quizQuestion.questionList) {
            const question = this.fb.group({
              title: [qns.title, Validators.required],
              type: ['', Validators.required],
            });
            this.questions.push(question);
          }

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

  async onSubmit() {
    if (this.quizForm.valid) {
      const data: any = this.quizForm.value;
      data.questionId = this.quizQuestion.id;
      data.typeList = this.quizQuestion.typeList;

      this.loading = true;
      await this.service
        .httpCall(this.service.createQuizAnswer(), data, 'post')
        .subscribe(
          async (res: any) => {
            this.answer = res;
            this.submitted = true;
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

  getTypeDescription() {
    if (!this.quizQuestion) {
      return 'Not Found';
    }

    for (const type of this.quizQuestion.typeList) {
      if (type.typeName == this.viewType) {
        return type.explanation;
      }
    }

    return 'Not Found';
  }
}
