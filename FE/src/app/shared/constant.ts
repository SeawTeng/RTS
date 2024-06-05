import { environment } from '../../environments/environment';

export const SERVER_URL = environment.apiUrl;
export const SECRET = 'rts-2024';
export const TOKEN_SECRET = 'rts-token';

export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

export const categoryIcon: any = [
  {
    text: 'book',
    icon: 'fa fa-book',
  },
  {
    text: 'user',
    icon: 'fa fa-user',
  },
  {
    text: 'star',
    icon: 'fa fa-star',
  },
  {
    text: 'heart',
    icon: 'fa fa-heart',
  },
  {
    text: 'code',
    icon: 'fa fa-code',
  },
  {
    text: 'clock',
    icon: 'fa fa-clock-o',
  },
  {
    text: 'news',
    icon: 'fa fa-newspaper-o',
  },
  {
    text: 'building',
    icon: 'fa fa-building',
  },
  {
    text: 'file',
    icon: 'fa fa-file',
  },
  {
    text: 'laptop',
    icon: 'fa fa-laptop',
  },
  {
    text: 'calendar',
    icon: 'fa fa-calendar',
  },
  {
    text: 'calculator',
    icon: 'fa fa-calculator',
  },
  {
    text: 'bar chart',
    icon: 'fa fa-bar-chart',
  },
  {
    text: 'trash',
    icon: 'fa fa-trash',
  },
  {
    text: 'briefcase',
    icon: 'fa fa-briefcase',
  },
  {
    text: 'home',
    icon: 'fa fa-home',
  },
  {
    text: 'suitcase',
    icon: 'fa fa-suitcase',
  },
  {
    text: 'car',
    icon: 'fa fa-car',
  },
];
