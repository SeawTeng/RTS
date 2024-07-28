import { AfterViewInit, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ServicesService } from '../../services/services.service';
import { ToDoCategoryComponent } from '../to-do/to-do-category-model/to-do-category-model.component';
import { ToDoTaskComponent } from '../to-do/to-do-task-model/to-do-task-model.component';
import { ToDoComponent } from '../to-do/to-do.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import moment from 'moment';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { PomoTaskModalComponent } from '../pomo-task-modal/pomo-task-modal.component';
import { MdbModalRef, MdbModalService, MdbModalModule } from 'mdb-angular-ui-kit/modal';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { faL } from '@fortawesome/free-solid-svg-icons';

interface Quote {
  content: string;
  author: string;
}

@Component({
  selector: 'app-pomodoro',
  standalone: true,
  imports: [CommonModule, RouterModule, ToDoCategoryComponent,
    ToDoTaskComponent, NgxLoadingModule, FormsModule, MdbModalModule],
  templateUrl: './pomodoro.component.html',
  styleUrl: './pomodoro.component.scss',
})
export class PomodoroComponent implements AfterViewInit, OnDestroy, OnInit {
  //pomo-task modal 
  modalRef: MdbModalRef<PomoTaskModalComponent> | null = null;

  //timer
  mins = 25;
  secs = 0;
  isRunning = false;
  isBreak = false;
  initialBreak = 5;
  initialMins = 25;
  breakMins = 5;
  breakSecs = 0
  selectedOption = "";
  pomodoroTime: number = 25;  // default focus time
  shortBreakTime: number = 5; // default break time

  //sound settings
  isChecked = false;

  //filters 
  latest = false;
  earliest = false;
  selectedPeriodforPomo: number | null = null;

  //tasks
  categoryList: any = [];
  taskList: any = [];
  pomoList: any = [];
  filteredPomoList: any = [];
  searchTerm: string = '';
  loading = false;
  type = 'Create';
  selectedCategoryId: any = null;
  selectedTask: any = null;
  selectedCategory: any = null;
  showCompleted: boolean = true;

  //tab 
  activePage = 'timer';
  //timer chart
  doughnutChartTimer: any;
  doughnutBreakChartTimer: any;

  //quote 
  quote: string = '';
  quoteAuthor: string = '';

  private apiUrl = 'https://api.quotable.io/random';

  constructor(
    private service: ServicesService,
    private toastr: ToastrService,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private modalService: MdbModalService,
    private http: HttpClient
  ) { }


  async ngAfterViewInit() {
    setTimeout(() => {
      this.loadDoughnutTimer();
      this.loadBreakDoughnutTimer();
    });
  }

  ngOnDestroy() {
    if (this.doughnutChartTimer) {
      this.doughnutChartTimer.destroy();
    }
    if (this.doughnutBreakChartTimer) {
      this.doughnutBreakChartTimer.destroy();
    }
  }

  ngOnInit() {
    this.getAllPomoSess();
  }

  async tabChange(tab: string) {
    this.activePage = tab;
    this.loading = true;
    this.isRunning = false;

    if (this.activePage == 'timer') {
      setTimeout(() => {
        this.loadDoughnutTimer();
        this.cdr.detectChanges();
      });

      if (this.doughnutBreakChartTimer) {
        this.doughnutBreakChartTimer.destroy();
      }

    } else if (this.activePage == 'break') {
      if (this.doughnutChartTimer) {
        this.doughnutChartTimer.destroy();
      }
      setTimeout(() => {
        this.loadBreakDoughnutTimer();
        this.cdr.detectChanges();
      });


    } else if (this.activePage == 'history') {
      if (this.doughnutChartTimer) {
        this.doughnutChartTimer.destroy();
      }
      if (this.doughnutBreakChartTimer) {
        this.doughnutBreakChartTimer.destroy();
      }

    } else if (this.activePage == 'setting') {
      if (this.doughnutChartTimer) {
        this.doughnutChartTimer.destroy();
      }
      if (this.doughnutBreakChartTimer) {
        this.doughnutBreakChartTimer.destroy();
      }

    }
  }

  loadDoughnutTimer() {
    const data = {
      labels: ['Timer', 'White Space'],
      datasets: [{
        label: 'Focus Session',
        data: [0, 12],
        backgroundColor: [
          'rgba(255, 26, 104, 1)',
          'rgba(255, 26, 104, 0.2)',

        ],
        borderColor: [
          'rgba(255, 26, 104, 1)',
          'rgba(255, 26, 104, 0)',
        ],

      }]
    };
    const pomodoroTimer = {
      id: 'minutesInCentre',
    }

    this.doughnutChartTimer = new Chart('doughnutChartTimer', {
      type: 'doughnut',
      data: data,
      options: {
        cutout: '97%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
      },
      plugins: [pomodoroTimer]
    });
  }

  loadBreakDoughnutTimer() {
    const data = {
      labels: ['Timer', 'White Space'],
      datasets: [{
        label: 'Break Session',
        data: [0, 12],
        backgroundColor: [
          'rgba(255, 26, 104, 1)',
          'rgba(255, 26, 104, 0.2)',

        ],
        borderColor: [
          'rgba(255, 26, 104, 1)',
          'rgba(255, 26, 104, 0)',
        ],

      }]
    };
    const pomodoroTimer = {
      id: 'minutesInCentre',
    }

    this.doughnutBreakChartTimer = new Chart('doughnutBreakChartTimer', {
      type: 'doughnut',
      data: data,
      options: {
        cutout: '97%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
      },
      plugins: [pomodoroTimer]
    });
  }

  fetchRandomQuote(): void {
    this.http.get<Quote>(this.apiUrl).subscribe({
      next: (quote) => {
        this.quote = quote.content;
        this.quoteAuthor = quote.author;
      },
      error: (err) => {
        console.error('Error fetching quote', err);
      }
    });
  }

  //   _                 _         _            _
  //  | |               | |       | |          | |
  //  | |_ ___ ______ __| | ___   | |_ __ _ ___| | __
  //  | __/ _ \______/ _` |/ _ \  | __/ _` / __| |/ /
  //  | || (_) |    | (_| | (_) | | || (_| \__ \   <
  //   \__\___/      \__,_|\___/   \__\__,_|___/_|\_\

  openModal() {
    if (this.selectedTask == null) {
      this.modalRef = this.modalService.open(PomoTaskModalComponent);
      this.modalRef.onClose.subscribe((task: any) => {
        this.selectedTask = task;

        if (this.selectedTask != null) {
          this.start();
        }
        else {
          this.toastr.error("Select a task you want to work on", 'Error', {
            positionClass: 'toast-top-center',
          });
        }
      });
    }
    else {
      this.isRunning = true;
      this.counter();
    }
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

  // after reset, will need 
  start() {
    this.isRunning = true;
    this.counter();
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

        if (this.secs < 0) {
          if (this.initialMins > 0) {
            this.initialMins--;
            this.secs = 59;
          }
        }

        const minsLeft = this.initialMins - this.mins;
        const secLeft = minsLeft * 60 - this.secs;


        this.doughnutChartTimer.config.data.datasets[0].data[0] = secLeft;
        this.doughnutChartTimer.config.data.datasets[0].data[1] = this.secs + this.mins * 60;
        this.doughnutChartTimer.update();


      };
      if (this.mins == 0 && this.secs == 0) {
        //play sound && add to db 
        this.playAudio();
        // this.breakTime();
        this.isRunning = false;
        this.isBreak = true;

        this.createPomoSess();
        this.markTaskAsComplete(this.selectedTask);
        this.reset();
      };

    }, 1000);
  }

  startBreak() {
    this.isRunning = true;
    this.breakcounter();
  }

  breakcounter() {
    setTimeout(() => {
      if ((this.breakMins || this.breakSecs) && this.isRunning) {
        if (this.breakSecs === 0) {
          this.breakSecs = 59;
          this.breakMins -= 1;

        } else {
          this.breakSecs -= 1;

        }
        this.breakcounter();

        const timeLeft = this.initialBreak - this.breakMins;
        //update chart 
        this.doughnutBreakChartTimer.config.data.datasets[0].data[0] = timeLeft;
        this.doughnutBreakChartTimer.config.data.datasets[0].data[1] = this.breakMins;
        this.doughnutBreakChartTimer.update();
      };
      if (this.breakMins == 0 && this.breakSecs == 0) {
        //play sound && add to db 
        this.playAudio();

        this.isRunning = false;



        this.breakReset();
      };

    }, 1000);
  }

  breakReset() {
    this.breakMins = this.initialBreak;
    this.breakSecs = 0;
    this.isRunning = false;

    this.doughnutBreakChartTimer.config.data.datasets[0].data[0] = 0;
    this.doughnutBreakChartTimer.config.data.datasets[0].data[1] = 12;
    this.doughnutBreakChartTimer.update();
  }


  reset() {
    this.mins = this.initialMins;
    this.secs = 0;
    this.isRunning = false;

    this.doughnutChartTimer.config.data.datasets[0].data[0] = 0;
    this.doughnutChartTimer.config.data.datasets[0].data[1] = 12;
    this.doughnutChartTimer.update();
  }


  pause() {
    this.isRunning = false;
  }

  updateTime(option: string) {
    this.selectedOption = option;
    if (option === 'babyStep') {
      this.mins = 10;
      this.initialMins = 10;
      this.breakMins = 5;
      this.initialBreak = 5;
    } else if (option === 'popular') {
      this.mins = 25;
      this.initialMins = 25;
      this.breakMins = 5;
      this.initialBreak = 5;
    } else if (option === 'custom') {
      if (this.pomodoroTime > 0 && this.shortBreakTime > 0) {
        this.mins = this.pomodoroTime;
        this.initialMins = this.pomodoroTime;
        this.breakMins = this.shortBreakTime;
        this.initialBreak = this.shortBreakTime;
      }
    }
  }


  async createPomoSess() {
    const endDateTime = new Date();
    const endDate = moment(endDateTime).format("DD-MM-YYYY HH:mm:ss")
    const startDate = new Date(endDateTime.getTime() - this.initialMins * 60 * 1000)
    const data = {
      breakSession: false,
      minutesTaken: this.initialMins,
      secondsTaken: 0,
      pomodoroSession: true,
      taskName: this.selectedTask.title,
      endDateTime: endDate,
      startDateTime: moment(startDate).format("DD-MM-YYYY HH:mm:ss")
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
          this.filteredPomoList = res;
        },
        error => {
          this.toastr.error(error.error, 'Error', {
            positionClass: 'toast-top-center',
          });
        }
      );
  }


  convertToISO(dateString: string): string {
    const [day, month, yearAndTime] = dateString.split("-");
    const [year, time] = yearAndTime.split(" ");
    return `${year}-${month}-${day}T${time}`;
  }

  async searchPomoSess() {

    let filteredList = this.pomoList;

    if (this.searchTerm) {
      filteredList = filteredList.filter((session: { taskName: string; endDateTime: string; }) =>
        session &&
        ((session.taskName && session.taskName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
          (session.endDateTime && session.endDateTime.toLowerCase().includes(this.searchTerm.toLowerCase())))
      );
    }


    if (this.latest === true) {
      this.filteredPomoList.sort((a: { endDateTime: string }, b: { endDateTime: string }) =>
        new Date(this.convertToISO(b.endDateTime)).getTime() - new Date(this.convertToISO(a.endDateTime)).getTime()
      );
      this.earliest = false;
      console.log("latest");
      console.log(this.filteredPomoList);
    } else if (this.earliest === true) {
      this.latest = false;
      this.filteredPomoList.sort((a: { endDateTime: string }, b: { endDateTime: string }) =>
        new Date(this.convertToISO(a.endDateTime)).getTime() - new Date(this.convertToISO(b.endDateTime)).getTime()
      );
      console.log("earliest");
      console.log(this.filteredPomoList);
    }


    this.filteredPomoList = filteredList;
  }




  async changeSort(checkbox: string) {
    if (checkbox === 'latest') {
      this.latest = true;
      this.earliest = false;
    } else if (checkbox === 'earliest') {
      this.earliest = true;
      this.latest = false;
    }

    this.searchPomoSess();
  }


  playAudio() {
    if (this.isChecked == true) {
      let audio = new Audio();
      audio.src = "../assets/bedside-clock-alarm-95792.mp3";
      audio.load();
      audio.play();

      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 5000);


    }

  }







}