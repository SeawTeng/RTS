import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ServicesService } from '../../services/services.service';
import { ToDoCategoryComponent } from '../to-do/to-do-category-model/to-do-category-model.component';
import { ToDoTaskComponent } from '../to-do/to-do-task-model/to-do-task-model.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pomodoro',
  standalone: true,
  imports: [CommonModule, RouterModule, ToDoCategoryComponent,
    ToDoTaskComponent,],
  templateUrl: './pomodoro.component.html',
  styleUrl: './pomodoro.component.scss',
})
export class PomodoroComponent implements OnInit {
  initialMins = 25;
  mins = 25;
  secs = 0;
  isRunning = false;
  isBreak = false;
  initialBreak = 5;
  breakMins = 5;
  breakSecs = 0

  isPomoPage = true;
  isBreakPage = false;


  categoryList: any = [];
  taskList: any = [];
  pomoList: any = [];
  loading = false;
  type = 'Create';
  selectedCategoryId: any = null;
  selectedTask: any = null;
  selectedCategory: any = null;
  showCompleted: boolean = true;


  constructor(
    private service: ServicesService,
    private toastr: ToastrService,
    public router: Router
  ) { }

  //   _                 _         _            _
  //  | |               | |       | |          | |
  //  | |_ ___ ______ __| | ___   | |_ __ _ ___| | __
  //  | __/ _ \______/ _` |/ _ \  | __/ _` / __| |/ /
  //  | || (_) |    | (_| | (_) | | || (_| \__ \   <
  //   \__\___/      \__,_|\___/   \__\__,_|___/_|\_\

  async ngOnInit() {
    await this.getAllCategory();
    await this.getAllPomoSess();
  }

  chooseTask(task: any) {
    this.selectedTask = task;
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

  // ____                           _                 
  // |  _ \ ___  _ __ ___   ___   __| | ___  _ __ ___  
  // | |_) / _ \| '_ ` _ \ / _ \ / _` |/ _ \| '__/ _ \ 
  // |  __/ (_) | | | | | | (_) | (_| | (_) | | | (_) |
  // |_|___\___/|_| |_| |_|\___/ \__,_|\___/|_|  \___/ 
  // |_   _(_)_ __ ___   ___ _ __                      
  //   | | | | '_ ` _ \ / _ \ '__|                     
  //   | | | | | | | | |  __/ |                        
  //   |_| |_|_| |_| |_|\___|_|            


  async createPomoSess() {
    const endDateTime = new Date();
    const data = {
      breakSession: false,
      minutesTaken: this.initialMins,
      secondsTaken: 0,
      pomodoroSession: true,
      taskName: this.selectedTask.title,
      endDateTime: endDateTime,
      startDateTime: new Date(endDateTime.getTime() - this.initialMins * 60 * 1000)
    }

    const api = this.service.createPomoSess();
    const type = 'post';

    await this.service.httpCall(api, data, type).subscribe(
      () => { },
      error => {
        this.loading = false;
        this.toastr.error(error.error, 'Error', {
          positionClass: 'toast-top-center',
        });
      }
    );
  }


  async getAllPomoSess() {
    await this.service
      .httpCall(this.service.getAllPomoSess(), {}, 'get')
      .subscribe(
        async (res: any) => {
          this.pomoList = res;
        },
        error => {
          this.toastr.error(error.error, 'Error', {
            positionClass: 'toast-top-center',
          });
        }
      );
  }

  pomoPage() {
    this.isPomoPage = true;
    this.isBreakPage = false;
  }

  breakPage() {
    this.isPomoPage = false;
    this.isBreakPage = true;
  }

  run() {
    if (this.selectedTask != null) {
      this.isRunning = true;
      this.counter();
      this.isBreak = false;
    }
    else {
      this.toastr.error("Select a task you want to work on", 'Error', {
        positionClass: 'toast-top-center',
      });
    }


  }

  reset() {
    this.mins = 25;
    this.secs = 0;
    this.isRunning = false;
  }

  pause() {
    this.isRunning = false;
  }
  increase() {
    if (!this.isRunning) {
      this.mins += 1;
      this.initialMins += 1;

    }

  }
  decrease() {
    if (!this.isRunning && this.mins > 0) {
      this.mins -= 1;
      this.initialMins -= 1;
    }

  }
  increaseBreak() {
    if (!this.isRunning)
      this.breakMins += 1;
  }
  decreaseBreak() {
    if (!this.isRunning && this.breakMins > 0)
      this.breakMins -= 1;
  }
  breakTime() {
    this.counterBreak();
  }

  playAudio() {
    const audio = new Audio();
    audio.src = "../assets/bedside-clock-alarm-95792.mp3";
    audio.load();
    audio.play();

  }

  counter() {
    setTimeout(() => {
      if ((this.mins || this.secs) && this.isRunning) {
        if (this.secs === 0) {
          this.secs = 59;
          this.mins -= 1;

        } else {
          this.secs -= 1;

        }
        this.counter();
      }
      if (this.mins == 0 && this.secs == 0) {
        //play sound && add to db 
        this.playAudio();
        this.breakPage();
        this.breakTime();
        this.isRunning = false;
        this.isBreak = true;

        this.createPomoSess();
        this.markTaskAsComplete(this.selectedTask);
        this.reset();
      }

    }, 1000);
  }
  counterBreak() {
    setTimeout(() => {
      if ((this.breakMins || this.breakSecs) && this.isBreak) {
        if (this.breakSecs === 0) {
          this.breakSecs = 59;
          this.breakMins -= 1;

        } else {
          this.breakSecs -= 1;

        }
        this.counterBreak();
      }
      if (this.breakMins == 0 && this.breakSecs == 0) {
        this.counter();
        this.isRunning = true;
        this.isBreak = false;
        this.pomoPage();
        this.reset();
      }

    }, 1000);
  }




}