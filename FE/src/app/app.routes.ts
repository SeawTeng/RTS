import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PomodoroComponent } from './pomodoro/pomodoro.component';
import { QuizComponent } from './quiz/quiz.component';
import { SignupComponent } from './signup/signup.component';
import { ToDoComponent } from './to-do/to-do.component';

export const routes = [{ path: 'home', component: HomeComponent },
{ path: 'login', component: LoginComponent },
{ path: 'signup', component: SignupComponent },
{ path: 'pomodoro', component: PomodoroComponent },
{ path: 'quiz', component: QuizComponent },
{ path: 'todo', component: ToDoComponent }];