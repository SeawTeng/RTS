import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
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

  constructor(
    private service: ServicesService,
    private router: Router
  ) {}

  get userLogin() {
    const store = localStorage.getItem('user');
    this.userInfo = store ? this.service.decryption(store) : {};
    return this.userInfo.email ? true : false;
  }

  logout() {
    this.service.logout();
    this.router.navigate(['login']);
  }
}
