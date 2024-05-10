import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeExamenComponent } from './type-examen.component';

describe('TypeExamenComponent', () => {
  let component: TypeExamenComponent;
  let fixture: ComponentFixture<TypeExamenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeExamenComponent]
    });
    fixture = TestBed.createComponent(TypeExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
