import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { adminGuard, authGuard } from './auth.guard';

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
    path: 'quiz-list',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/quiz-list/quiz-list.component').then(
            m => m.QuizListComponent
          ),
        canActivate: [adminGuard],
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./components/quiz-list/quiz-form/quiz-form.component').then(
            m => m.QuizFormComponent
          ),
        canActivate: [adminGuard],
      },
      {
        path: 'edit',
        loadComponent: () =>
          import('./components/quiz-list/quiz-form/quiz-form.component').then(
            m => m.QuizFormComponent
          ),
        canActivate: [adminGuard],
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
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        m => m.DashboardComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'discussion',
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './components/discussion-forum/discussion-forum.component'
          ).then(m => m.DiscussionForumComponent),
        canActivate: [authGuard],
      },
      {
        path: 'view',
        loadComponent: () =>
          import('./components/discussion-form/discussion-form.component').then(
            m => m.DiscussionFormComponent
          ),
        canActivate: [authGuard],
      },
    ],
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
