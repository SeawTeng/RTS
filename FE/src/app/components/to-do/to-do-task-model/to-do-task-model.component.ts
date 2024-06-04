import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ServicesService } from '../../../services/services.service';
import { ToastrService } from 'ngx-toastr';
import { NgxLoadingModule } from 'ngx-loading';
import $ from 'jquery';
import moment from 'moment';

@Component({
  selector: 'app-to-do-task',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, NgxLoadingModule],
  templateUrl: './to-do-task-model.component.html',
  styleUrl: './to-do-task-model.component.scss',
})
export class ToDoTaskComponent implements OnChanges {
  taskForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    categoryId: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
  });

  loading = false;
  @Input() categoryList: any;
  @Input() type: any;
  @Input() selectedTask: any;
  @Output() submitted = new EventEmitter<boolean>();

  today: string = moment().format('YYYY-MM-DD');

  constructor(
    private service: ServicesService,
    private toastr: ToastrService,
    public router: Router
  ) {}

  ngOnChanges(): void {
    if (this.type == 'Edit') {
      this.taskForm.patchValue(this.selectedTask);
    }
  }

  async createTask() {
    const data = this.taskForm.value;
    this.loading = true;

    const api =
      this.type == 'Edit'
        ? this.service.updateTodoTask(this.selectedTask.id)
        : this.service.createTodoTask();
    const type = this.type == 'Edit' ? 'put' : 'post';

    await this.service.httpCall(api, data, type).subscribe(
      async (res: any) => {
        this.loading = false;
        this.submitted.emit(true);
        this.clearForm();
      },
      error => {
        this.loading = false;
        this.toastr.error(error.error, 'Error', {
          positionClass: 'toast-top-center',
        });
      }
    );
  }

  clearForm() {
    this.selectedTask = null;
    this.taskForm.reset();
  }
}
