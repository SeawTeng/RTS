import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PomoTaskModalComponent } from './pomo-task-modal.component';

describe('PomoTaskModalComponent', () => {
  let component: PomoTaskModalComponent;
  let fixture: ComponentFixture<PomoTaskModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PomoTaskModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PomoTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
