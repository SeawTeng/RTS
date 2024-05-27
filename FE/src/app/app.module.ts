// app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 


import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PomodoroComponent } from './pomodoro/pomodoro.component';
import { QuizComponent } from './quiz/quiz.component';
import { SignupComponent } from './signup/signup.component';
import { ToDoComponent } from './to-do/to-do.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'pomodoro', component: PomodoroComponent },
    { path: 'quiz', component: QuizComponent },
    { path: 'todo', component: ToDoComponent },
    { path: '**', redirectTo: '/home', pathMatch: 'full' }
]

@NgModule({
    declarations: [
        AppComponent, HomeComponent, LoginComponent, SignupComponent
    ],
    imports: [
        BrowserModule, 
        RouterModule.forRoot(routes), 
        ReactiveFormsModule, 
        CommonModule
    ],
    providers: [],
    exports: [

        ReactiveFormsModule,CommonModule
    ],
    bootstrap: [AppComponent]
})


export class AppModule { }
