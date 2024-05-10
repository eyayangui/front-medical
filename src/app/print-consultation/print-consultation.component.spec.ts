import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintConsultationComponent } from './print-consultation.component';

describe('PrintConsultationComponent', () => {
  let component: PrintConsultationComponent;
  let fixture: ComponentFixture<PrintConsultationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintConsultationComponent]
    });
    fixture = TestBed.createComponent(PrintConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
