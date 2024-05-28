import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppService } from './app.service';
import { ServicesService } from './services.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [AppService, ServicesService],
  exports: [],
})
export class ServicesModule {}
