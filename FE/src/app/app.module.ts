// app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PomodoroComponent } from './components/pomodoro/pomodoro.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { SignupComponent } from './components/signup/signup.component';
import { ToDoComponent } from './components/to-do/to-do.component';
import { ServicesModule } from './services/services.module';
import { CookieService } from 'ngx-cookie-service';
import { NgxLoadingModule } from 'ngx-loading';
import { ToastNoAnimationModule, ToastrModule } from 'ngx-toastr';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'pomodoro', component: PomodoroComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'todo', component: ToDoComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  declarations: [AppComponent, HomeComponent, LoginComponent, SignupComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    CommonModule,
    ServicesModule,
    NgxLoadingModule.forRoot({}),
    ToastrModule.forRoot(),
    ToastNoAnimationModule.forRoot(),
  ],
  providers: [CookieService],
  exports: [ReactiveFormsModule, CommonModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
