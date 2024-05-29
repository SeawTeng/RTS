import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./components/signup/signup.component').then(
        m => m.SignupComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'pomodoro',
    loadComponent: () =>
      import('./components/pomodoro/pomodoro.component').then(
        m => m.PomodoroComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'quiz',
    loadComponent: () =>
      import('./components/quiz/quiz.component').then(m => m.QuizComponent),
    canActivate: [authGuard],
  },
  {
    path: 'todo',
    loadComponent: () =>
      import('./components/to-do/to-do.component').then(m => m.ToDoComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutesModule {}
