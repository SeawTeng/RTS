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
import { FormsModule } from '@angular/forms';
import * as ics from 'ics';

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
    FormsModule,
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
  showCompleted: boolean = true;
  componentLoaded: boolean = false;

  constructor(
    private service: ServicesService,
    private toastr: ToastrService,
    public router: Router
  ) {}

  async ngOnInit() {
    await this.getAllCategory();
  }

  async getAllCategory() {
    this.loading = true;
    const api = this.selectedCategoryId
      ? this.service.getAllTodoTaskByCategory(this.selectedCategoryId.id)
      : this.service.getAllTodoTask();

    await this.service
      .httpCall(this.service.getAllTodoCategory(), {}, 'get')
      .subscribe(
        async (res: any) => {
          this.categoryList = res;
          await this.service
            .httpCall(
              api,
              {
                showCompleted: this.showCompleted,
              },
              'post'
            )
            .subscribe((res: any) => {
              this.loading = false;
              this.componentLoaded = true;
              this.taskList = res;
            });
        },
        error => {
          this.loading = false;
          this.componentLoaded = true;
          this.toastr.error(error.error, 'Error', {
            positionClass: 'toast-top-center',
          });
        }
      );
  }

  //   _            _
  //  | |          | |
  //  | |_ __ _ ___| | __
  //  | __/ _` / __| |/ /
  //  | || (_| \__ \   <
  //   \__\__,_|___/_|\_\

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

  createTask() {
    this.type = 'Create';
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

  toggleShowCompleted() {
    this.getAllCategory();
  }

  //             _
  //            | |
  //    ___ __ _| |_ ___  __ _  ___  _ __ _   _
  //   / __/ _` | __/ _ \/ _` |/ _ \| '__| | | |
  //  | (_| (_| | ||  __/ (_| | (_) | |  | |_| |
  //   \___\__,_|\__\___|\__, |\___/|_|   \__, |
  //                      __/ |            __/ |
  //                     |___/            |___/
  editCategory() {
    this.type = 'Edit';
    this.selectedCategory = JSON.parse(JSON.stringify(this.selectedCategoryId));
  }

  async selectCategory(category: any) {
    if (
      this.selectedCategoryId == null ||
      this.selectedCategoryId.id != category.id
    ) {
      this.selectedCategoryId = JSON.parse(JSON.stringify(category));
      this.loading = true;

      await this.service
        .httpCall(
          this.service.getAllTodoTaskByCategory(category.id),
          { showCompleted: this.showCompleted },
          'post'
        )
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
        .httpCall(
          this.service.getAllTodoTask(),
          { showCompleted: this.showCompleted },
          'post'
        )
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

  categorySubmit(res: any) {
    if (res.data) {
      this.selectedCategory = this.selectedCategoryId = JSON.parse(
        JSON.stringify(res.data)
      );
    }

    this.getAllCategory();
  }

  async deleteCategory() {
    const { value: confirm } = await Swal.fire({
      title: 'Delete Category',
      text: 'Do you sure you want to delete this category? This action will also delete all the related tasks.',
      showCancelButton: true,
    });

    if (confirm) {
      this.loading = true;
      await this.service
        .httpCall(
          this.service.deleteTodoCategory(this.selectedCategoryId.id),
          {},
          'delete'
        )
        .subscribe(
          async (res: any) => {
            this.selectedCategory = this.selectedCategoryId = null;
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

  async downloadTask() {
    this.loading = true;
    await this.service
      .httpCall(this.service.downloadActiveTodoTask(), {}, 'get')
      .subscribe(
        async (res: any) => {
          const events = res;

          const filename = 'activeTask.ics';
          const file = await new Promise((resolve, reject) => {
            ics.createEvents(events, (error, value) => {
              if (error) {
                reject(error);
              }

              resolve(new File([value], filename, { type: 'text/calendar' }));
            });
          });
          const url = URL.createObjectURL(file as any);

          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = filename;

          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);

          URL.revokeObjectURL(url);

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
