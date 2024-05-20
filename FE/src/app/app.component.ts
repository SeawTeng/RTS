import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from './../environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'RTS_FE';

  constructor(private http: HttpClient) {
    console.log(environment.production);
  }

  ngOnInit(): void {
      this.fetchDetails();
  }

  public fetchDetails() {
    this.http.get(environment.apiUrl+"/users").subscribe(
      (res: any) => {
        console.log(res);
      }
    )
  }
}
