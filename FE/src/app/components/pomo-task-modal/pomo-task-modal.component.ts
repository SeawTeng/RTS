import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { ToastrService } from 'ngx-toastr';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pomo-task-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pomo-task-modal.component.html',
  styleUrl: './pomo-task-modal.component.scss'
})
export class PomoTaskModalComponent implements OnInit {

  taskList: any = [];
  categoryList: any = [];
  selectedCategoryId: any = null;
  selectedTask: any = null;
  loading = false; 

  doughnutChartTimer: any;

  constructor(
    private service: ServicesService,
    private toastr: ToastrService,
    public modalRef: MdbModalRef<PomoTaskModalComponent>
  ) { }

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

              },
              'post'
            )
            .subscribe((res: any) => {

              this.taskList = res;
              this.loading = false; 

            });
        },
        error => {
          this.toastr.error(error.error, 'Error', {
            positionClass: 'toast-top-center',
          });
        }
      );
  }

  chooseTask(task: any) {
    this.selectedTask = task;
  }

  saveTask(): void {
    this.modalRef.close(this.selectedTask);
  }

}
