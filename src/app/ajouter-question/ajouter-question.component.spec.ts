import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterQuestionComponent } from './ajouter-question.component';

describe('AjouterQuestionComponent', () => {
  let component: AjouterQuestionComponent;
  let fixture: ComponentFixture<AjouterQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterQuestionComponent]
    });
    fixture = TestBed.createComponent(AjouterQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
