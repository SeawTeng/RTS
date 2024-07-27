import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServicesService } from '../../../services/services.service';
import { NgxLoadingModule } from 'ngx-loading';
import { ToastrService } from 'ngx-toastr';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { learnerTypeList } from '../../../shared/constant';
import Swal from 'sweetalert2';

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
  quizType: any;
  answer: any;
  viewType: string = '';
  type: any;
  id: any;
  learnerTypeList: any;

  quizForm = this.fb.group({
    questionList: this.fb.array([]),
    typeList: this.fb.array([]),
  });

  constructor(
    private service: ServicesService,
    public router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  get questions() {
    return this.quizForm.controls['questionList'] as FormArray;
  }

  get types() {
    return this.quizForm.controls['typeList'] as FormArray;
  }

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.fragment;
    this.type = this.activatedRoute.snapshot.url[0].path;
    this.learnerTypeList = learnerTypeList;

    if (this.type == 'edit') {
      this.loading = true;
      await this.service
        .httpCall(this.service.getOneQuizQuestion(this.id), {}, 'get')
        .subscribe(
          async (res: any) => {
            this.quizQuestion = res;

            for (const qns of this.quizQuestion.questionList) {
              const question = this.fb.group({
                title: [qns.title, Validators.required],
                options: this.fb.array([]),
              });

              for (const opt of qns.options) {
                const option = this.fb.group({
                  text: [opt.text, Validators.required],
                  type: [opt.type, Validators.required],
                });

                (question.controls['options'] as FormArray).push(option);
              }

              this.questions.push(question);
            }

            for (const typ of this.quizQuestion.typeList) {
              const type = this.fb.group({
                typeOption: [typ.typeOption, Validators.required],
                typeName: [typ.typeName, Validators.required],
                explanation: [typ.explanation, Validators.required],
              });
              this.types.push(type);
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
  }

  async onSubmit(type: string) {
    if (this.quizForm.valid) {
      const data: any = this.quizForm.value;
      data.isDefault = false;
      data.status = type;

      this.loading = true;

      if (this.type == 'create') {
        await this.service
          .httpCall(this.service.createQuizQuestion(), data, 'post')
          .subscribe(
            async (res: any) => {
              this.loading = false;
              this.router.navigate(['/quiz-list']);
            },
            error => {
              this.loading = false;
              this.toastr.error(error.error, 'Error', {
                positionClass: 'toast-top-center',
              });
            }
          );
      } else {
        await this.service
          .httpCall(this.service.updateQuizQuestion(this.id), data, 'put')
          .subscribe(
            async (res: any) => {
              this.loading = false;
              this.router.navigate(['/quiz-list']);
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
  }

  addType() {
    const i = this.types.length;
    const typeOption = this.learnerTypeList[i];

    const type = this.fb.group({
      typeOption: [typeOption, Validators.required],
      typeName: ['', Validators.required],
      explanation: ['', Validators.required],
    });
    this.types.push(type);

    for (const qns of this.questions.controls) {
      const option = this.fb.group({
        text: ['', Validators.required],
        type: [typeOption, Validators.required],
      });

      (qns.get('options') as FormArray).push(option);
    }
  }

  removeType(index: number) {
    this.types.removeAt(index);

    for (let i = 0; i < this.types.length; i++) {
      this.types.controls
        .at(i)
        ?.get('typeOption')
        ?.setValue(this.learnerTypeList[i]);
    }

    for (const qns of this.questions.controls) {
      (qns.get('options') as FormArray).removeAt(index);

      let optIndex = 0;
      for (const opt of (qns.get('options') as FormArray).controls) {
        opt.get('type')?.setValue(this.learnerTypeList[optIndex]);
        optIndex++;
      }
    }
  }

  addQns() {
    const question = this.fb.group({
      title: ['', Validators.required],
      options: this.fb.array([]),
    });

    for (let i = 0; i < this.types.length; i++) {
      const option = this.fb.group({
        text: ['', Validators.required],
        type: [this.learnerTypeList[i], Validators.required],
      });

      (question.controls['options'] as FormArray).push(option);
    }

    this.questions.push(question);
  }

  removeQns(index: number) {
    this.questions.removeAt(index);
  }

  async deleteQuiz() {
    const { value: confirm } = await Swal.fire({
      title: 'Delete Learning Style Assessment',
      text: 'Are you sure you want to delete this learning style assessment?',
      showCancelButton: true,
    });

    if (confirm) {
      this.loading = true;

      if (this.quizQuestion.isDefault) {
        await Swal.fire({
          title: 'Error',
          text: 'You are not allowed to delete a default learning style assessment',
        });
        this.loading = false;

        return;
      }
      await this.service
        .httpCall(this.service.deleteQuizQuestion(this.id), {}, 'delete')
        .subscribe(
          async (res: any) => {
            this.router.navigate(['/quiz-list']);
          },
          error => {
            this.loading = false;
            this.toastr.error(error.error, 'Error', {
              positionClass: 'toast-top-center',
            });
          }
        );
    } else {
      this.loading = false;
    }
  }

  async setDefault() {
    const { value: confirm } = await Swal.fire({
      title: 'Set Default Learning Style Assessment',
      text: 'Are you sure you want to set this learning style assessment as default?',
      showCancelButton: true,
    });

    if (confirm) {
      this.loading = true;

      await this.service
        .httpCall(this.service.setDefaultQuizQuestion(this.id), {}, 'put')
        .subscribe(
          async (res: any) => {
            this.router.navigate(['/quiz-list']);
          },
          error => {
            this.loading = false;
            this.toastr.error(error.error, 'Error', {
              positionClass: 'toast-top-center',
            });
          }
        );
    } else {
      this.loading = false;
    }
  }
}
