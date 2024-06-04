import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ServicesService } from '../../services/services.service';
import { ToastrService } from 'ngx-toastr';
import { NgxLoadingModule } from 'ngx-loading';
import { ToDoCategoryComponent } from './to-do-category-model/to-do-category-model.component';
import { ToDoTaskComponent } from './to-do-task-model/to-do-task-model.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-to-do',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    NgxLoadingModule,
    ToDoCategoryComponent,
    ToDoTaskComponent,
  ],
  templateUrl: './to-do.component.html',
  styleUrl: './to-do.component.scss',
})
export class ToDoComponent implements OnInit {
  categoryList: any = [];
  taskList: any = [];
  loading = false;
  type = 'Create';
  selectedCategoryId: any = null;
  selectedTask: any = null;
  selectedCategory: any = null;

  constructor(
    private service: ServicesService,
    private toastr: ToastrService,
    public router: Router
  ) {}

  async ngOnInit() {
    this.loading = true;
    await this.getAllCategory();
  }

  async getAllCategory() {
    await this.service
      .httpCall(this.service.getAllTodoCategory(), {}, 'get')
      .subscribe(
        async (res: any) => {
          this.categoryList = res;
          await this.service
            .httpCall(this.service.getAllTodoTask(), {}, 'get')
            .subscribe((res: any) => {
              this.loading = false;
              this.taskList = res;
            });
        },
        error => {
          this.loading = false;
          this.toastr.error(error.error, 'Error', {
            positionClass: 'toast-top-center',
          });
        }
      );
  }

  async deleteTask(task: any) {
    const { value: confirm } = await Swal.fire({
      title: 'Delete Task',
      text: 'Do you sure you want to delete this task?',
      showCancelButton: true,
    });

    if (confirm) {
      this.loading = true;
      await this.service
        .httpCall(this.service.deleteTodoTask(task.id), {}, 'delete')
        .subscribe(
          async (res: any) => {
            await this.getAllCategory();
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

  editTask(task: any) {
    this.type = 'Edit';
    this.selectedTask = JSON.parse(JSON.stringify(task));
    this.selectedTask.categoryId = task.categoryId._path.segments[1];
  }

  editCategory() {
    this.type = 'Edit';
    this.selectedCategory = JSON.parse(JSON.stringify(this.selectedCategoryId));
  }

  async markTaskAsComplete(task: any) {
    const data = {
      status: 'completed',
    };

    const { value: confirm } = await Swal.fire({
      title: 'Complete Task',
      text: 'Do you sure you want to mark this task as completed?',
      showCancelButton: true,
    });

    if (confirm) {
      this.loading = true;
      await this.service
        .httpCall(this.service.updateTodoTask(task.id), data, 'put')
        .subscribe(
          async (res: any) => {
            await this.getAllCategory();
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

  async selectCategory(category: any) {
    if (
      this.selectedCategoryId == null ||
      this.selectedCategoryId.id != category.id
    ) {
      this.selectedCategoryId = JSON.parse(JSON.stringify(category));
      this.loading = true;

      await this.service
        .httpCall(this.service.getAllTodoTaskByCategory(category.id), {}, 'get')
        .subscribe(
          async (res: any) => {
            this.taskList = res;
            this.loading = false;
          },
          error => {
            this.loading = false;
            this.toastr.error(error.error, 'Error', {
              positionClass: 'toast-top-center',
            });
          }
        );
    } else {
      this.selectedCategoryId = null;
      this.loading = true;

      await this.service
        .httpCall(this.service.getAllTodoTask(), {}, 'get')
        .subscribe(
          async (res: any) => {
            this.taskList = res;
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
}
