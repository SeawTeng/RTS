import { Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  title = 'RTS_FE';
  userInfo: any;

  constructor(
    private service: ServicesService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.service
      .httpCall(this.service.checkToken(), {}, 'get')
      .subscribe((res: any) => {
        if (res == "unauthorized access!") {
          this.service.logout();
        }
      })
  }

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
