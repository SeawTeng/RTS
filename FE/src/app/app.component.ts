import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { ServicesService } from './services/services.service';
import { ToastrService } from 'ngx-toastr';

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
  login = false;

  constructor(
    private service: ServicesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const store = localStorage.getItem('user');
    this.userInfo = store ? this.service.decryption(store) : {};
    this.login = this.userInfo.email ? true : false;
  }

  logout() {
    this.service.httpCall(this.service.logout(), {}, 'post', false).subscribe(
      (res: any) => {
        localStorage.removeItem('user');
        window.location.reload();

        this.toastr.success('Successfully Logout', '', {
          timeOut: 3000,
          positionClass: 'toast-top-center',
        });
      },
      (error: any) => {
        this.toastr.error(error.error, 'Error', {
          positionClass: 'toast-top-center',
        });
      }
    );
  }
}
