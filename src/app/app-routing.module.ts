import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { authGuard } from 'src/services/auth/auth.guard';
import { PatientListingComponent } from './patient-listing/patient-listing.component';
import { AjouterExamenComponent } from './ajouter-examen/ajouter-examen.component';
import { AjouterQuestionComponent } from './ajouter-question/ajouter-question.component';
import { QuestionsComponent } from './questions/questions.component';
import { ConsultationComponent } from './consultation/consultation.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { ModifierReponseComponent } from './modifier-reponse/modifier-reponse.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'listpatient',
    component: PatientListingComponent,
    canActivate: [authGuard]
  },
  {
    path: 'examen',
    component: AjouterExamenComponent,
    canActivate: [authGuard]
  },
  {
    path: 'add-questions/:examId',
    component: AjouterQuestionComponent,
    canActivate: [authGuard]
  },
  {
    path: 'questions/:typeexamId',
    component: QuestionsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'questions-modifier/:typeexamId',
    component: ModifierReponseComponent,
    canActivate: [authGuard]
  },

  {
    path: 'consultation/:idPatient',
    component: ConsultationComponent,
    canActivate: [authGuard]
  },
  {
    path: 'consultation-details/:consultationId',
    component: QuestionDetailComponent,
    canActivate: [authGuard]
  },
  {
    path:"**",
    pathMatch:"full",
    redirectTo:"login"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
