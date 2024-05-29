// app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ServicesModule } from './services/services.module';
import { CookieService } from 'ngx-cookie-service';
import { NgxLoadingModule } from 'ngx-loading';
import { ToastNoAnimationModule, ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [AppComponent, HomeComponent, LoginComponent, SignupComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    CommonModule,
    ServicesModule,
    NgxLoadingModule.forRoot({}),
    ToastrModule.forRoot(),
    ToastNoAnimationModule.forRoot(),
  ],
  providers: [CookieService],
  exports: [ReactiveFormsModule, CommonModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
