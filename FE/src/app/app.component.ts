import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ServicesService } from './services/services.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'RTS_FE';
  userInfo: any;
  login = false;

  constructor(
    private service: ServicesService
  ) {}

  get userLogin() {
    const store = localStorage.getItem('user');
    this.userInfo = store ? this.service.decryption(store) : {};
    this.login = this.userInfo.email ? true : false;
    return this.login;
  }
  
  logout() {
    this.service.logout();
    this.userInfo = {};
    this.login = false;
  }
}
