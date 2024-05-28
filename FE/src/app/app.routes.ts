import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PomodoroComponent } from './components/pomodoro/pomodoro.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { SignupComponent } from './components/signup/signup.component';
import { ToDoComponent } from './components/to-do/to-do.component';

export const routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'pomodoro', component: PomodoroComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'todo', component: ToDoComponent },
];
