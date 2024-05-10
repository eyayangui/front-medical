import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterExamenComponent } from './ajouter-examen.component';

describe('AjouterExamenComponent', () => {
  let component: AjouterExamenComponent;
  let fixture: ComponentFixture<AjouterExamenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterExamenComponent]
    });
    fixture = TestBed.createComponent(AjouterExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
