import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { authGuard } from './auth.guard';
import { QuizFormComponent } from './components/quiz-form/quiz-form.component';

export const routes: Routes = [
  {
    path: 'home',
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
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/quiz/quiz.component').then(m => m.QuizComponent),
        canActivate: [authGuard],
      },
      {
        path: 'form',
        loadComponent: () =>
          import('./components/quiz-form/quiz-form.component').then(
            m => m.QuizFormComponent
          ),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'todo',
    loadComponent: () =>
      import('./components/to-do/to-do.component').then(m => m.ToDoComponent),
    canActivate: [authGuard],
  },
  {
    path: 'update-password',
    loadComponent: () =>
      import('./components/update-password/update-password.component').then(
        m => m.UpdatePasswordComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'account-page',
    loadComponent: () =>
      import('./components/account-page/account-page.component').then(
        m => m.AccountPageComponent
      ),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '**',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/pagenotfound/pagenotfound.component').then(
        m => m.PagenotfoundComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutesModule {}
