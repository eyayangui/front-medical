import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierReponseComponent } from './modifier-reponse.component';

describe('ModifierReponseComponent', () => {
  let component: ModifierReponseComponent;
  let fixture: ComponentFixture<ModifierReponseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifierReponseComponent]
    });
    fixture = TestBed.createComponent(ModifierReponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
