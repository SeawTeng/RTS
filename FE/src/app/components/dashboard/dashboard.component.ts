import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import Chart from 'chart.js/auto';
import { HttpClientModule } from '@angular/common/http';
import { ServicesService } from '../../services/services.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { start } from 'repl';
import { NgxLoadingModule } from 'ngx-loading';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxLoadingModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {


  //charts 
  title = 'ng-chart';
  cTaskchart: any = [];
  TaskStatuschart: any = null;
  eachTaskStackChart: any = [];
  pomoBar: any = [];


  //get methods of to do and pomo 
  categoryList: any = [];
  taskList: any = [];
  pomoList: any = [];
  loading = false;
  selectedCategoryId: any = null;
  selectedTask: any = null;
  showCompleted: boolean = true;

  // upper dashboard 
  dueToday = 0;
  completedToday = 0;
  overdueTasks = 0;
  productiveTime = 0;

  //filter 
  selectedPeriod = 7;
  selectedCategory: any = null;


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

  async numOfCompletedTaskBarChart(labels: any, data: any) {
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


  getFilteredData(period: number) {
    const today = new Date();
    let startDate: Date;

    switch (period) {
      case 7:
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        break;
      case 31:
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 31);
        break;
      case 93:
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 93);
        break;
      default:
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        break;
    }


    const filteredTasks = this.taskList.filter((task: any) => {
      const taskDate = new Date(task.endDate);

      const isCompleted = task.status === 'completed';
      const isInRange = taskDate >= startDate && taskDate <= today;
      // console.log('Is Completed:', isCompleted); 
      // console.log('Is In Range:', isInRange); 
      return isInRange && isCompleted;
    });



    const filteredTasksByDate: { [date: string]: number } = {};

    filteredTasks.forEach((task: any) => {
      const date = new Date(task.endDate).toISOString().split('T')[0];
      if (!filteredTasksByDate[date]) {
        filteredTasksByDate[date] = 0;
      }
      filteredTasksByDate[date]++;
    });

    const sortedEntries = Object.entries(filteredTasksByDate).sort((a, b) => {
      return new Date(a[0]).getTime() - new Date(b[0]).getTime();
    });



    const labels = sortedEntries.map(entry => entry[0]);
    const data = sortedEntries.map(entry => entry[1]);


    return { labels, data };
  }

  async updateTaskChart() {

    const filteredData = this.getFilteredData(this.selectedPeriod);


    if (this.cTaskchart) {
      this.cTaskchart.destroy();
    }
    this.numOfCompletedTaskBarChart(filteredData.labels, filteredData.data);
  }

  async updateCategory(selectedCategories: string) {
    this.taskStatusPieChart(selectedCategories);
  }

  async taskStatusPieChart(selectedCategories?: string) {
    const filteredTasks = this.taskList.filter((task: any) => {
      const categoryId = task.categoryId._path.segments[1];
      // console.log(`Task ID: ${task.id}, Category ID: ${categoryId}`);
      return selectedCategories ? categoryId === selectedCategories : true;
    });

    const pendingTasks = filteredTasks.filter((task: any) => task.status === 'active').length;
    const completedTasks = filteredTasks.filter((task: any) => task.status === 'completed').length;

    // console.log(pendingTasks);
    // console.log(completedTasks);

    if (this.TaskStatuschart) {
      this.TaskStatuschart.data.datasets[0].data = [pendingTasks, completedTasks];
      this.TaskStatuschart.update();
    } else {
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

              const filteredData = this.getFilteredData(this.selectedPeriod);
              this.numOfCompletedTaskBarChart(filteredData.labels, filteredData.data);
              this.taskStatusPieChart();
              this.findOverdueTask();
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

  async findOverdueTask() {
    const today = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
    const todayDate = today
      .toISOString()
      .split('T')[0];
    const pendingTasks = this.taskList.filter((task: any) => task.status === 'active');
    this.dueToday = 0;
    this.overdueTasks = 0;

    pendingTasks.forEach((task: any) => {

      const taskEndDate = new Date(task.endDate);
      const taskEndDateString = taskEndDate.toISOString().split('T')[0];

      if (taskEndDateString == todayDate) {
        this.dueToday += 1;
      } else if (taskEndDate < today) {
        this.overdueTasks += 1;
      }
    });
  }


  // ____                          ____ _                _       
  // |  _ \ ___  _ __ ___   ___    / ___| |__   __ _ _ __| |_ ___ 
  // | |_) / _ \| '_ ` _ \ / _ \  | |   | '_ \ / _` | '__| __/ __|
  // |  __/ (_) | | | | | | (_) | | |___| | | | (_| | |  | |_\__ \
  // |_|   \___/|_| |_| |_|\___/   \____|_| |_|\__,_|_|   \__|___/



  async totalPomoSessBarChart() {

    const pomoSessByDate: { [date: string]: number } = {};
    const todayDate = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    this.pomoList.forEach((task: any) => {
      const dateStr = task.endDateTime;
      const dateParts = dateStr.split(' ');
      const date = dateParts[0].split('-');
      const time = dateParts[1].split(':');

      const parsedDate = new Date(
        Date.UTC(
          parseInt(date[2], 10),
          parseInt(date[1], 10) - 1,
          parseInt(date[0], 10),
          parseInt(time[0], 10),
          parseInt(time[1], 10),
          parseInt(time[2], 10)
        )
      );

      const formattedDate = parsedDate.toISOString().split('T')[0];

      if (todayDate == formattedDate) {
        this.productiveTime += task.minutesTaken;
      }

      if (task.endDateTime) {
        if (!pomoSessByDate[formattedDate]) {
          pomoSessByDate[formattedDate] = 0;
        }
        pomoSessByDate[formattedDate] += task.minutesTaken;
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
