import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ServicesService } from '../../../services/services.service';
import { ToastrService } from 'ngx-toastr';
import { NgxLoadingModule } from 'ngx-loading';
import { categoryIcon } from '../../../shared/constant';
import $ from 'jquery';

@Component({
  selector: 'app-to-do-category',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, NgxLoadingModule],
  templateUrl: './to-do-category-model.component.html',
  styleUrl: './to-do-category-model.component.scss',
})
export class ToDoCategoryComponent implements OnChanges {
  categoryForm: FormGroup = new FormGroup({
    categoryName: new FormControl('', [Validators.required]),
    icon: new FormControl('', [Validators.required]),
  });

  categoryIcon = categoryIcon;
  loading = false;
  @Output() submitted = new EventEmitter<boolean>();
  @Input() selectedCategory: any;
  @Input() type: any;

  constructor(
    private service: ServicesService,
    private toastr: ToastrService,
    public router: Router
  ) {}

  ngOnChanges(): void {
    if (this.type == 'Edit') {
      this.categoryForm.patchValue(this.selectedCategory);
    }
  }

  async createCategory() {
    const data = this.categoryForm.value;
    this.loading = true;

    await this.service
      .httpCall(this.service.createTodoCategory(), data, 'post')
      .subscribe(
        async (res: any) => {
          this.loading = false;
          this.submitted.emit(true);
          this.clearForm();
        },
        error => {
          this.loading = false;
          this.toastr.error(error.error, 'Error', {
            positionClass: 'toast-top-center',
          });
        }
      );
  }

  clearForm() {
    this.categoryForm.reset();
  }
}
