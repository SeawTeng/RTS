import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import Chart from 'chart.js/auto';
import { HttpClientModule } from '@angular/common/http';
import { ServicesService } from '../../services/services.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  title = 'ng-chart';
  cTaskchart: any = [];
  TaskStatuschart: any = [];

  eachTaskStackChart: any = [];
  pomoBar: any = [];

  categoryList: any = [];
  taskList: any = [];
  pomoList: any = [];
  loading = false;

  selectedCategoryId: any = null;
  selectedTask: any = null;
  selectedCategory: any = null;
  showCompleted: boolean = true;

  pomoTaskName = "";


  constructor(
    private service: ServicesService,
    private toastr: ToastrService,

  ) { }

  async ngOnInit() {
    await this.getAllCategory();
    await this.getAllPomoSess();

  }

  // _____       ____           ____ _                _       
  // |_   _|__   |  _ \  ___    / ___| |__   __ _ _ __| |_ ___ 
  //   | |/ _ \  | | | |/ _ \  | |   | '_ \ / _` | '__| __/ __|
  //   | | (_) | | |_| | (_) | | |___| | | | (_| | |  | |_\__ \
  //   |_|\___/  |____/ \___/   \____|_| |_|\__,_|_|   \__|___/

  async numOfCompletedTaskBarChart() {
    // allow filter and sat first show week by week then let user decide 
    const completedTasks = this.taskList.filter((task: any) => task.status === 'completed');
    const completedTasksByDate: { [date: string]: number } = {};

    completedTasks.forEach((task: any) => {
      if (task.endDate) {
        const date = new Date(task.endDate).toISOString().split('T')[0];
        if (!completedTasksByDate[date]) {
          completedTasksByDate[date] = 0;
        }
        completedTasksByDate[date]++;
      }
    });


    const labels = Object.keys(completedTasksByDate);
    const data = Object.values(completedTasksByDate);


    this.cTaskchart = new Chart('completedTaskBarChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: '# of Completed Tasks',
            data: data,
            borderWidth: 1,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }


  async taskStatusPieChart() {
    const pendingTasks = this.taskList.filter((task: any) => task.status === 'active').length;
    const completedTasks = this.taskList.filter((task: any) => task.status === 'completed').length;

    // should allow filter by category 
    this.TaskStatuschart = new Chart('taskstatuspiechart', {
      type: 'pie',
      data: {
        labels: ['Pending Tasks', 'Completed Tasks'],
        datasets: [
          {
            label: 'Task Status',
            data: [pendingTasks, completedTasks],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }


  //   _                 _         _            _
  //  | |               | |       | |          | |
  //  | |_ ___ ______ __| | ___   | |_ __ _ ___| | __
  //  | __/ _ \______/ _` |/ _ \  | __/ _` / __| |/ /
  //  | || (_) |    | (_| | (_) | | || (_| \__ \   <
  //   \__\___/      \__,_|\___/   \__\__,_|___/_|\_\


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
              this.taskList = res;
              this.numOfCompletedTaskBarChart();
              this.taskStatusPieChart();
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

  // ____                          ____ _                _       
  // |  _ \ ___  _ __ ___   ___    / ___| |__   __ _ _ __| |_ ___ 
  // | |_) / _ \| '_ ` _ \ / _ \  | |   | '_ \ / _` | '__| __/ __|
  // |  __/ (_) | | | | | | (_) | | |___| | | | (_| | |  | |_\__ \
  // |_|   \___/|_| |_| |_|\___/   \____|_| |_|\__,_|_|   \__|___/


  async eachTaskStackedChart() {
    const completedTasks = this.taskList.filter((task: any) => task.status === 'completed');
  
    const completedTasksByDate: { [date: string]: { [task: string]: number } } = {};
  
    completedTasks.forEach((task: any) => {
      if (task.endDateTime) {
        const date = new Date(task.endDateTime).toISOString().split('T')[0];
        if (!completedTasksByDate[date]) {
          completedTasksByDate[date] = {};
        }
        if (!completedTasksByDate[date][task.task]) {
          completedTasksByDate[date][task.task] = 0;
        }
        completedTasksByDate[date][task.task] += task.minutesTaken;
      }
    });
  
    const labels = Object.keys(completedTasksByDate);
    const taskNames: any[] = [...new Set(completedTasks.map((task: any) => task.task))];
  
    const datasets = taskNames.map((taskName: any) => {
      return {
        label: taskName,
        data: labels.map(date => completedTasksByDate[date][taskName] || 0),
        borderWidth: 1,
        backgroundColor: this.getRandomColor(),
      };
    });
  
    this.eachTaskStackChart = new Chart('timeOnEachTaskStackChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    });
  }
  
  async totalPomoSessBarChart() {

    const pomoSessByDate: { [date: string]: number } = {};

    this.pomoList.forEach((task: any) => {
      if (task.endDateTime) {
        const date = new Date(task.endDateTime).toISOString().split('T')[0];
        if (!pomoSessByDate[date]) {
          pomoSessByDate[date] = 0;
        }
        pomoSessByDate[date]+= task.minutesTaken;
      }
    });


    const labels = Object.keys(pomoSessByDate);
    const data = Object.values(pomoSessByDate);


    this.pomoBar = new Chart('pomoBarChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total Time Spent Each Day ',
            data: data,
            borderWidth: 1,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  
  
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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

  async getAllPomoSess() {
    await this.service
      .httpCall(this.service.getAllPomoSess(), {}, 'get')
      .subscribe(
        async (res: any) => {
          this.pomoList = res;
          console.log(this.pomoList)
          this.eachTaskStackedChart();
          this.totalPomoSessBarChart();
        },
        error => {
          this.toastr.error(error.error, 'Error', {
            positionClass: 'toast-top-center',
          });
        }
      );
  }


}
