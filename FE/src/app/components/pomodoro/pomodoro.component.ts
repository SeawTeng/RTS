import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ServicesService } from '../../services/services.service';

@Component({
  selector: 'app-pomodoro',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pomodoro.component.html',
  styleUrl: './pomodoro.component.scss',
})
export class PomodoroComponent {
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

  pomoPage() {
    this.isPomoPage = true;
    this.isBreakPage = false;
  }

  breakPage() {
    this.isPomoPage = false;
    this.isBreakPage = true;
  }

  run() {
    this.isRunning = true;
    this.counter();
    this.isBreak = false;

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
    if (!this.isRunning)
      this.mins += 1;
  }
  decrease() {
    if (!this.isRunning && this.mins > 0)
      this.mins -= 1;
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
    let audio = new Audio();
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
      };
      if (this.mins == 0 && this.secs == 0) {
        //play sound && add to db 
        this.playAudio();
        this.breakPage();
        this.breakTime();
        this.isRunning = false;
        this.isBreak = true;
        this.reset();
      };

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
      };
      if (this.breakMins == 0 && this.breakSecs == 0) {
        this.counter();
        this.isRunning = true;
        this.isBreak = false;
        this.reset();
      };

    }, 1000);
  }




}